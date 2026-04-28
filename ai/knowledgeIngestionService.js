import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';
import { getDB } from '../db/indexedDB';
import * as tf from '@tensorflow/tfjs';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

let isLearning = false;

// Helper for status updates to avoid circular dependency on knowledgeBaseQueries
async function updateStatus(status) {
  const db = await getDB();
  if (!status.id) status.id = 'ai-ingestion';
  status.updatedAt = new Date().toISOString();
  await db.put('systemStatus', status);
}

// Helper for saving articles (minimal version of knowledgeBaseQueries.saveArticle)
async function saveIngestedArticle(article) {
  const db = await getDB();
  if (!article.id) article.id = `${article.diseaseCode}-${Date.now()}`;
  article.updatedAt = new Date().toISOString();
  if (!article.createdAt) article.createdAt = new Date().toISOString();
  await db.put('knowledgeBase', article);
  
  // Add to sync queue for consistency
  await db.put('syncQueue', {
    id: `sync-${Date.now()}`,
    type: 'put',
    store: 'knowledgeBase',
    data: article,
    timestamp: new Date().toISOString(),
    synced: false
  });
}

// Extract keywords to map to basic symptoms
function extractSymptoms(text) {
  const commonSymptoms = [
    'fever', 'diarrhea', 'lesion', 'salivation', 'lameness', 'swelling', 'blister',
    'coughing', 'weight loss', 'lethargy', 'anorexia', 'weakness', 'nodule',
    'discharge', 'ulcer', 'abortion', 'death'
  ];
  
  const textLower = text.toLowerCase();
  return commonSymptoms.filter(sym => textLower.includes(sym));
}

// Utility to parse folder structure from Vite glob path for contextual AI tagging
function extractContextFromPath(path) {
  const parts = path.split('/');
  const baseIndex = parts.indexOf('MyFarmData');
  
  if (baseIndex !== -1 && parts.length > baseIndex + 1) {
    const categoryFolder = parts[baseIndex + 1];
    const speciesRaw = categoryFolder.split('_')[0].toLowerCase();
    const validSpecies = ['cattle', 'goat', 'sheep', 'poultry'];
    const species = validSpecies.includes(speciesRaw) ? speciesRaw : 'all';
    const tags = categoryFolder.split('_').map(t => t.toLowerCase());
    return { categoryFolder, species, tags };
  }
  
  return { categoryFolder: 'General', species: 'all', tags: [] };
}

export async function learnFromPDFs(mobilenetModel) {
  if (isLearning) return;
  isLearning = true;
  
  try {
    const pdfModules = import.meta.glob('/public/MyFarmData/**/*.pdf', { query: '?url', import: 'default', eager: true });
    const pdfEntries = Object.entries(pdfModules);
    const total = pdfEntries.length;
    let currentCount = 0;

    await updateStatus({ 
      status: 'learning-pdfs', 
      current: 0, 
      total: total, 
      message: 'Analyzing farming manuals...' 
    });
    
    const db = await getDB();

    for (const [path, rawUrl] of pdfEntries) {
      currentCount++;
      const url = rawUrl.replace(/^\/public\//, '/');
      const pdfName = path.split('/').pop().replace('.pdf', '');
      const context = extractContextFromPath(path);
      
      const existing = await db.get('knowledgeBase', `PDF-${pdfName}-0`);
      
      if (existing) {
        await updateStatus({ 
          status: 'learning-pdfs', 
          current: currentCount, 
          total: total, 
          message: `Already learned ${pdfName}` 
        });
        continue;
      }
      
      await updateStatus({ 
        status: 'learning-pdfs', 
        current: currentCount, 
        total: total, 
        message: `Reading ${pdfName}...` 
      });
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      const maxPages = Math.min(numPages, 15);
      
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        const extractedSym = extractSymptoms(pageText);
        
        const originalViewport = page.getViewport({ scale: 1.0 });
        const scale = 224 / originalViewport.width;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context2d = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context2d,
          viewport: viewport
        }).promise;
        
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = 224;
        resizedCanvas.height = 224;
        resizedCanvas.getContext('2d').drawImage(canvas, 0, 0, 224, 224);
        
        const embedding = tf.tidy(() => mobilenetModel.infer(resizedCanvas, true));
        const embeddingData = Array.from(embedding.dataSync());
        embedding.dispose();
        page.cleanup();
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const article = {
          id: `PDF-${pdfName}-${pageNum - 1}`,
          diseaseCode: `PDF_${pdfName.substring(0, 5).toUpperCase()}_P${pageNum}`,
          titleEn: `${pdfName.replace(/[-_]/g, ' ')} - Page ${pageNum}`,
          titleTn: ``,
          species: context.species,
          contentEn: pageText,
          symptoms: extractedSym,
          tags: ['pdf-learned', ...context.tags],
          imageEmbedding: embeddingData,
          source: `PDF Ingestion (${context.categoryFolder})`,
          createdAt: new Date().toISOString()
        };
        
        await saveIngestedArticle(article);
      }
    }
  } catch (error) {
    console.error("[PDF Learning] Error during ingestion:", error);
  } finally {
    isLearning = false;
  }
}

export async function ingestLocalImages(mobilenetModel) {
  if (isLearning) return;
  isLearning = true;
  
  try {
    const imageModules = import.meta.glob('/public/MyFarmData/**/*.{png,jpg,jpeg,webp}', { query: '?url', import: 'default', eager: true });
    const imageEntries = Object.entries(imageModules);
    const total = imageEntries.length;
    let currentCount = 0;

    await updateStatus({ 
      status: 'learning-images', 
      current: 0, 
      total: total, 
      message: 'Processing reference images...' 
    });
    
    const db = await getDB();

    for (const [path, rawUrl] of imageEntries) {
      currentCount++;
      const url = rawUrl.replace(/^\/public\//, '/');
      const filename = path.split('/').pop();
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      const diseaseName = nameWithoutExt.replace(/[0-9]+$/, "").replace(/_/g, ' ').trim().toLowerCase();
      
      const context = extractContextFromPath(path);
      
      const articleId = `IMG-${nameWithoutExt}`;
      const existing = await db.get('knowledgeBase', articleId);
      
      if (existing) {
        await updateStatus({ 
          status: 'learning-images', 
          current: currentCount, 
          total: total, 
          message: `Already learned ${filename}` 
        });
        continue;
      }
      
      await updateStatus({ 
        status: 'learning-images', 
        current: currentCount, 
        total: total, 
        message: `Analyzing image: ${filename}` 
      });
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 224;
      canvas.height = 224;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 224, 224);
      
      const embedding = tf.tidy(() => mobilenetModel.infer(canvas, true));
      const embeddingData = Array.from(embedding.dataSync());
      embedding.dispose();
      
      const article = {
        id: articleId,
        diseaseCode: diseaseName.toUpperCase(),
        titleEn: `Image Reference: ${diseaseName}`,
        titleTn: '',
        species: context.species,
        contentEn: `Visual reference image for ${diseaseName}.`,
        symptoms: [],
        tags: ['image-learned', diseaseName, ...context.tags],
        imageEmbedding: embeddingData,
        source: `Local Image Ingestion (${context.categoryFolder})`,
        createdAt: new Date().toISOString()
      };
      
      await saveIngestedArticle(article);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    await updateStatus({ 
      status: 'idle', 
      current: total, 
      total: total, 
      message: 'AI Knowledge base is up to date.' 
    });

  } catch (error) {
    console.error("[Image Ingestion] Error during ingestion:", error);
  } finally {
    isLearning = false;
  }
}
