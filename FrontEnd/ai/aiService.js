import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { comprehensiveDiseaseData } from '../db/diseaseDataComprehensive';
import { knowledgeBaseQueries } from '../db/knowledgeBaseQueries';
import { startComprehensiveAILearning } from './knowledgeIngestionService';

let model = null;
let referenceEmbeddings = [];
let referenceTensor = null;
let initPromise = null;

// Pre-warm the AI engine at startup with a robust lock to prevent null model errors
export async function initializeAI() {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    console.log("[AI System] Warming up engines...");
    try {
      const startTime = performance.now();
      
      // 1. Load Model (Force WebGL for speed)
      await tf.setBackend('webgl');
      await tf.ready();
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
      
      // 2. Build Vector Index
      await buildReferenceCache();
      
      // 3. Start comprehensive background learning (MyFarmData + Legacy PDFs)
      console.log("[AI System] Initiating background knowledge ingestion...");
      startComprehensiveAILearning(model).catch(err => {
        console.warn("[AI System] Background learning error (non-blocking):", err);
      });
      
      console.log(`[AI System] Ready in ${Math.round(performance.now() - startTime)}ms`);
      return true;
    } catch (err) {
      console.warn("[AI System] Initialization error, falling back to CPU", err);
      await tf.setBackend('cpu');
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
      
      // Still attempt background learning on CPU
      startComprehensiveAILearning(model).catch(err => {
        console.warn("[AI System] Background learning error on CPU (non-blocking):", err);
      });
      
      return true;
    }
  })();
  
  return initPromise;
}

async function buildReferenceCache() {
  const dbArticles = await knowledgeBaseQueries.getAllArticles();
  const learnedItems = dbArticles.filter(a => a.imageEmbedding?.length > 0);
  
  const cache = [];
  const vectors = [];
  
  comprehensiveDiseaseData.forEach(d => {
    if (d.imageEmbedding) {
      cache.push({ code: d.diseaseCode });
      vectors.push(d.imageEmbedding);
    }
  });
  
  learnedItems.forEach(a => {
    cache.push({ code: a.diseaseCode });
    vectors.push(a.imageEmbedding);
  });
  
  if (vectors.length > 0) {
    tf.tidy(() => {
      const raw = tf.tensor2d(vectors);
      const norms = tf.norm(raw, 2, 1, true);
      if (referenceTensor) referenceTensor.dispose();
      referenceTensor = tf.keep(raw.div(norms));
    });
    referenceEmbeddings = cache;
  }
}

async function fastSemanticSearch(queryEmbedding) {
  if (!referenceTensor) return [];
  
  const scores = tf.tidy(() => {
    const qNorm = tf.norm(queryEmbedding, 2, 1, true);
    const normalizedQ = queryEmbedding.div(qNorm);
    return tf.matMul(normalizedQ, referenceTensor, false, true);
  });

  const data = await scores.data();
  scores.dispose();

  const results = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0.42) {
      results.push({ diseaseCode: referenceEmbeddings[i].code, confidence: data[i] });
    }
  }
  return results.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

export async function unifiedSearch(inputs) {
  // Wait for AI to be ready
  await initializeAI();
  if (!model) {
     console.error("[AI] Model failed to load even after initialization.");
     return [];
  }

  const startTime = performance.now();
  const searchResults = { keyword: [], visual: [] };
  const tasks = [];

  if (inputs.text || inputs.symptoms) {
    const query = inputs.text || inputs.symptoms.join(' ');
    tasks.push(knowledgeBaseQueries.searchBySymptoms(query.split(' '), inputs.species).then(res => {
      searchResults.keyword = res.map(r => ({ diseaseCode: r.article.diseaseCode, confidence: r.confidence }));
    }));
  }

  if (inputs.image) {
    tasks.push((async () => {
      const img = new Image();
      img.src = inputs.image;
      await new Promise(r => img.onload = r);
      
      const embedding = tf.tidy(() => {
        const t = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
        return model.infer(t, true);
      });

      searchResults.visual = await fastSemanticSearch(embedding);
      embedding.dispose();
    })());
  }

  await Promise.all(tasks);

  const k = 60;
  const fusionScores = new Map();
  const sources = new Map();

  [searchResults.keyword, searchResults.visual].forEach((results, setIdx) => {
    results.forEach((res, rank) => {
      const code = res.diseaseCode;
      const score = 1 / (k + rank + 1);
      fusionScores.set(code, (fusionScores.get(code) || 0) + score);
      
      if (!sources.has(code)) sources.set(code, { keyword: 0, visual: 0 });
      if (setIdx === 0) sources.get(code).keyword = res.confidence;
      else sources.get(code).visual = res.confidence;
    });
  });

  const final = [];
  for (const [code, fScore] of fusionScores.entries()) {
    const article = await knowledgeBaseQueries.getArticleByDiseaseCode(code);
    if (!article) continue;

    let boost = 1.0;
    if (inputs.species && article.species !== 'all' && article.species !== inputs.species) boost = 0.4;
    if (inputs.species && article.species === inputs.species) boost = 1.3;

    final.push({
      ...article,
      confidence: Math.min(0.99, fScore * 12 * boost),
      matchSources: sources.get(code)
    });
  }

  return final.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

export async function recognizeDiseaseFromImageBase64(base64) {
  return await unifiedSearch({ image: base64 });
}

export async function recognizeDiseaseFromVideoFile(file) {
  await initializeAI();
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url;
  await new Promise(r => video.onloadeddata = r);
  
  const canvas = document.createElement('canvas');
  canvas.width = 224; canvas.height = 224;
  const ctx = canvas.getContext('2d');
  
  video.currentTime = video.duration / 2;
  await new Promise(r => video.onseeked = r);
  ctx.drawImage(video, 0, 0, 224, 224);
  const results = await unifiedSearch({ image: canvas.toDataURL('image/jpeg') });
  
  URL.revokeObjectURL(url);
  return results;
}
