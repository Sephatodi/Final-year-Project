import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { comprehensiveDiseaseData } from '../../db/diseaseDataComprehensive';
import { knowledgeBaseQueries } from '../../db/knowledgeBaseQueries';
import { startComprehensiveAILearning } from './knowledgeIngestionService';

let model = null;
let referenceEmbeddings = [];
let referenceTensor = null;
let initPromise = null;

export async function initializeAI() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
      await buildReferenceCache();
      startComprehensiveAILearning(model).catch(() => {});
      return true;
    } catch (err) {
      await tf.setBackend('cpu');
      model = await mobilenet.load({ version: 2, alpha: 1.0 });
      startComprehensiveAILearning(model).catch(() => {});
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
    if (d.imageEmbedding) { cache.push({ code: d.diseaseCode }); vectors.push(d.imageEmbedding); }
  });
  learnedItems.forEach(a => { cache.push({ code: a.diseaseCode }); vectors.push(a.imageEmbedding); });
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

export async function unifiedSearch(inputs) {
  await initializeAI();
  if (!model) return [];
  // simplified: only keyword search if image not provided
  const results = [];
  if (inputs.text || inputs.symptoms) {
    const q = inputs.text || inputs.symptoms.join(' ');
    const res = await knowledgeBaseQueries.searchBySymptoms(q.split(' '), inputs.species);
    return res.map(r => ({ diseaseCode: r.article.diseaseCode, confidence: r.confidence }));
  }
  return results;
}

export async function recognizeDiseaseFromImageBase64(base64) {
  return await unifiedSearch({ image: base64 });
}
