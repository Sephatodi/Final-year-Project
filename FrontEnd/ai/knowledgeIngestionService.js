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
  
  // First, check for MyFarmData structure
  const myFarmDataIndex = parts.indexOf('MyFarmData');
  if (myFarmDataIndex !== -1 && parts.length > myFarmDataIndex + 1) {
    const categoryFolder = parts[myFarmDataIndex + 1];
    const speciesRaw = categoryFolder.split('_')[0].toLowerCase();
    const validSpecies = ['cattle', 'goat', 'sheep', 'poultry'];
    const species = validSpecies.includes(speciesRaw) ? speciesRaw : 'all';
    const tags = categoryFolder.split('_').map(t => t.toLowerCase());
    return { categoryFolder, species, tags, source: 'MyFarmData' };
  }
  
  // Check for images folder structure
  const imagesIndex = parts.indexOf('images');
  if (imagesIndex !== -1 && parts.length > imagesIndex + 1) {
    const subfolder = parts[imagesIndex + 1];
    const speciesRaw = subfolder.split('_')[0].toLowerCase();
    const validSpecies = ['cattle', 'goat', 'sheep', 'poultry', 'diseases'];
    const species = validSpecies.includes(speciesRaw) && speciesRaw !== 'diseases' ? speciesRaw : 'all';
    const tags = subfolder.split('_').map(t => t.toLowerCase()).filter(t => t !== 'diseases');
    return { categoryFolder: subfolder, species, tags, source: 'images' };
  }
  
  return { categoryFolder: 'General', species: 'all', tags: [], source: 'unknown' };
}

export async function learnFromPDFs(mobilenetModel) {
  if (isLearning) return;
  isLearning = true;
  
  try {

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
    // const imageModules = import.meta.glob('../public/MyFarmData/**/*.{png,jpg,jpeg,webp}', { query: '?url', import: 'default', eager: true });
    const imageModules = {};
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

/**
 * Learn from PDFs stored in /public/images folder for additional diagnostics.
 * This complements MyFarmData learning with legacy PDF materials.
 */
export async function learnFromImagesFolderPDFs(mobilenetModel) {
  if (isLearning) return;
  isLearning = true;
  
  try {
    // Collect PDFs from multiple sources
    const pdfSources = [
      { pattern: '/public/images/**/*.pdf', label: 'Images folder hierarchy' },
      { pattern: '/public/images/*.pdf', label: 'Images folder root' },
      { pattern: '/public/*.pdf', label: 'Public folder root' }
    ];
    
    let totalPDFs = [];
    for (const source of pdfSources) {
      // const pdfModules = import.meta.glob(source.pattern, { query: '?url', import: 'default', eager: true });
      const pdfModules = {};
      totalPDFs = totalPDFs.concat(Object.entries(pdfModules));
    }
    
    // Remove duplicates (same file might be matched by multiple patterns)
    const uniquePDFs = Array.from(new Map(totalPDFs.map(entry => [entry[0], entry])).values());
    
    if (uniquePDFs.length === 0) {
      console.log("[PDF Ingestion] No PDFs found in /public/images or /public folder");
      return;
    }
    
    const total = uniquePDFs.length;
    let currentCount = 0;

    await updateStatus({ 
      status: 'learning-images-pdfs', 
      current: 0, 
      total: total, 
      message: 'Analyzing reference materials...' 
    });
    
    const db = await getDB();

    for (const [path, rawUrl] of uniquePDFs) {
      currentCount++;
      const url = rawUrl.replace(/^\/public\//, '/');
      const pdfName = path.split('/').pop().replace('.pdf', '');
      const context = extractContextFromPath(path);
      
      const existing = await db.get('knowledgeBase', `PDF-IMG-${pdfName}-0`);
      
      if (existing) {
        await updateStatus({ 
          status: 'learning-images-pdfs', 
          current: currentCount, 
          total: total, 
          message: `Already learned ${pdfName}` 
        });
        continue;
      }
      
      await updateStatus({ 
        status: 'learning-images-pdfs', 
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
          id: `PDF-IMG-${pdfName}-${pageNum - 1}`,
          diseaseCode: `PDF_IMG_${pdfName.substring(0, 5).toUpperCase()}_P${pageNum}`,
          titleEn: `${pdfName.replace(/[-_]/g, ' ')} - Page ${pageNum}`,
          titleTn: ``,
          species: context.species,
          contentEn: pageText,
          symptoms: extractedSym,
          tags: ['pdf-learned', 'images-folder', ...context.tags],
          imageEmbedding: embeddingData,
          source: `Reference Material (${context.categoryFolder})`,
          createdAt: new Date().toISOString()
        };
        
        await saveIngestedArticle(article);
      }
    }

    await updateStatus({ 
      status: 'idle', 
      current: total, 
      total: total, 
      message: 'AI Knowledge base is up to date.' 
    });

  } catch (error) {
    console.error("[PDF Ingestion from Images] Error during ingestion:", error);
  } finally {
    isLearning = false;
  }
}

/**
 * Master orchestration function for all AI learning tasks.
 * Coordinates learning from MyFarmData semantic folders and /public/images folder.
 * This is the main entry point for the background AI knowledge ingestion.
 */
export async function startComprehensiveAILearning(mobilenetModel) {
  try {
    await updateStatus({ 
      status: 'learning-all', 
      current: 0, 
      total: 3, 
      message: 'Starting comprehensive AI learning...' 
    });

    // Phase 1: Learn from MyFarmData PDFs (new semantic structure)
    console.log("[AI Learning] Phase 1: Learning from MyFarmData PDFs...");
    await learnFromPDFs(mobilenetModel);

    // Phase 2: Learn from MyFarmData images (semantic context)
    console.log("[AI Learning] Phase 2: Learning from MyFarmData images...");
    await ingestLocalImages(mobilenetModel);

    // Phase 3: Learn from legacy /public/images folder PDFs
    console.log("[AI Learning] Phase 3: Learning from legacy reference materials...");
    await learnFromImagesFolderPDFs(mobilenetModel);

    await updateStatus({ 
      status: 'idle', 
      current: 3, 
      total: 3, 
      message: 'AI Knowledge base fully synchronized.' 
    });

    console.log("[AI Learning] Comprehensive learning complete!");
  } catch (error) {
    console.error("[AI Learning] Orchestration error:", error);
    await updateStatus({ 
      status: 'error', 
      message: `Learning interrupted: ${error.message}` 
    });
  }
}
