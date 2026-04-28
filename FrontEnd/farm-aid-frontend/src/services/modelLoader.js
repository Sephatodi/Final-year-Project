// src/services/modelLoader.js
import * as tf from '@tensorflow/tfjs';
import { localDB, getDiseaseMetadata } from './db';

// Model configuration
const MODEL_URL = '/model/model.json';
const MODEL_STORAGE_KEY = 'tfjs_model';

// Class labels matching our diseases
const CLASS_LABELS = [
  'disease_fmd',           // Foot and Mouth Disease
  'disease_lsd',           // Lumpy Skin Disease
  'disease_ppr',           // PPR
  'disease_heartwater',    // Heartwater
  'disease_orf',           // Orf/Soremouth
  'disease_anaplasmosis',  // Anaplasmosis
  'disease_pinkeye',       // Pinkeye
  'disease_mastitis',      // Mastitis
  'disease_coccidiosis',   // Coccidiosis
  'disease_footrot',       // Footrot
  'disease_bloat',         // Bloat
  'disease_healthy'        // Healthy
];

let model = null;
let isModelLoading = false;
let loadingPromise = null;

// Load model from IndexedDB or network
export async function loadModel() {
  if (model) return model;
  if (isModelLoading) return loadingPromise;
  
  isModelLoading = true;
  
  loadingPromise = (async () => {
    try {
      // Try to load from IndexedDB first
      const storedModel = await loadModelFromIndexedDB();
      if (storedModel) {
        console.log('✅ Model loaded from IndexedDB');
        model = storedModel;
        isModelLoading = false;
        return model;
      }
      
      // Fall back to network load
      console.log('📡 Loading model from network...');
      model = await tf.loadGraphModel(MODEL_URL);
      
      // Save to IndexedDB for offline use
      await saveModelToIndexedDB(model);
      console.log('💾 Model saved to IndexedDB');
      
      isModelLoading = false;
      return model;
    } catch (error) {
      console.error('❌ Failed to load model:', error);
      isModelLoading = false;
      throw error;
    }
  })();
  
  return loadingPromise;
}

// Save model to IndexedDB via PouchDB
async function saveModelToIndexedDB(tfModel) {
  try {
    // Get model weights
    const modelArtifacts = await tfModel.save({
      save: async (artifacts) => {
        // Store in PouchDB
        const doc = {
          _id: MODEL_STORAGE_KEY,
          type: 'model_artifacts',
          modelTopology: artifacts.modelTopology,
          weightSpecs: artifacts.weightSpecs,
          weightData: Array.from(new Uint8Array(artifacts.weightData)), // Convert to array for storage
          format: artifacts.format,
          generatedBy: artifacts.generatedBy,
          convertedBy: artifacts.convertedBy,
          timestamp: Date.now()
        };
        
        await localDB.put(doc);
        return { modelArtifacts: artifacts };
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to save model to IndexedDB:', error);
    return false;
  }
}

// Load model from IndexedDB
async function loadModelFromIndexedDB() {
  try {
    const doc = await localDB.get(MODEL_STORAGE_KEY);
    if (!doc.modelTopology) return null;
    
    // Check if model is too old (optional: refresh after 30 days)
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - doc.timestamp > THIRTY_DAYS) {
      console.log('Model is outdated, will refresh from network');
      return null;
    }
    
    const model = await tf.loadGraphModel({
      load: async () => {
        return {
          modelTopology: doc.modelTopology,
          weightSpecs: doc.weightSpecs,
          weightData: new Uint8Array(doc.weightData).buffer
        };
      }
    });
    
    return model;
  } catch (error) {
    if (error.status !== 404) {
      console.error('Error loading model from IndexedDB:', error);
    }
    return null;
  }
}

// Preprocess image for model input
export async function preprocessImage(imageElement, targetSize = 224) {
  // Convert to tensor
  let tensor = tf.browser.fromPixels(imageElement);
  
  // Resize to target dimensions
  tensor = tf.image.resizeBilinear(tensor, [targetSize, targetSize]);
  
  // Normalize to [0,1] range
  tensor = tensor.div(255.0);
  
  // Expand dimensions to create batch
  tensor = tensor.expandDims(0);
  
  return tensor;
}

// Classify an image
export async function classifyImage(imageElement) {
  const currentModel = await loadModel();
  if (!currentModel) {
    throw new Error('Model not loaded');
  }
  
  // Preprocess image
  const tensor = await preprocessImage(imageElement);
  
  // Run inference
  const predictions = await currentModel.predict(tensor).data();
  
  // Clean up tensor
  tensor.dispose();
  
  // Process results
  const results = [];
  for (let i = 0; i < predictions.length; i++) {
    results.push({
      diseaseId: CLASS_LABELS[i],
      confidence: predictions[i],
      diseaseMetadata: await getDiseaseMetadata(CLASS_LABELS[i])
    });
  }
  
  // Sort by confidence descending
  results.sort((a, b) => b.confidence - a.confidence);
  
  return results;
}

// Classify from file/blob
export async function classifyFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(url);
      try {
        const results = await classifyImage(img);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// Classify from camera capture
export async function classifyFromCamera(videoElement) {
  // Create temporary canvas to capture frame
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert canvas to image
  const img = new Image();
  img.src = canvas.toDataURL('image/jpeg');
  
  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        const results = await classifyImage(img);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
  });
}

// Get model status
export function getModelStatus() {
  return {
    isLoaded: model !== null,
    isLoading: isModelLoading,
    classCount: CLASS_LABELS.length
  };
}
