let tf;
try {
  tf = require('@tensorflow/tfjs-node');
} catch (error) {
  try {
    tf = require('@tensorflow/tfjs');
    console.log('ℹ️ TensorFlow Node.js not found, using generic TensorFlow package.');
  } catch (err) {
    console.log('⚠️ TensorFlow not found or failed to load. AI diagnostics will fall back to rule-based system.');
    tf = null;
  }
}
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class AIDiagnosticService {
  constructor() {
    this.model = null;
    this.symptomModel = null;
    this.diseaseDatabase = this.loadDiseaseDatabase();
    this.modelPath = process.env.AI_MODEL_PATH || path.join(__dirname, '../../models/livestock_disease.tflite');
  }

  async loadModel() {
    try {
      if (!this.model) {
        // Load TensorFlow Lite model
        this.model = await tf.loadLiteModel(this.modelPath);
        console.log('AI model loaded successfully');
      }
      return this.model;
    } catch (error) {
      console.error('Error loading AI model:', error);
      // Fallback to rule-based system
      return null;
    }
  }

  loadDiseaseDatabase() {
    // Common livestock diseases in Botswana
    return {
      cattle: [
        {
          name: 'Foot and Mouth Disease',
          symptoms: ['fever', 'blisters_mouth', 'lameness', 'drooling', 'loss_appetite'],
          treatment: 'quarantine, supportive care, vaccination',
          severity: 'high',
          contagious: true,
          reportable: true
        },
        {
          name: 'CBPP (Contagious Bovine Pleuropneumonia)',
          symptoms: ['fever', 'coughing', 'difficulty_breathing', 'nasal_discharge', 'loss_appetite'],
          treatment: 'antibiotics, isolation, vaccination',
          severity: 'high',
          contagious: true,
          reportable: true
        },
        {
          name: 'Internal Parasites',
          symptoms: ['weight_loss', 'diarrhea', 'weakness', 'rough_coat', 'anemia'],
          treatment: 'deworming medication, pasture rotation',
          severity: 'medium',
          contagious: false,
          reportable: false
        }
      ],
      goat: [
        {
          name: 'Peste des Petits Ruminants',
          symptoms: ['fever', 'nasal_discharge', 'diarrhea', 'mouth_sores', 'pneumonia'],
          treatment: 'supportive care, antibiotics for secondary infections',
          severity: 'high',
          contagious: true,
          reportable: true
        }
      ],
      sheep: [
        {
          name: 'Sheep Pox',
          symptoms: ['fever', 'skin_lesions', 'difficulty_breathing', 'loss_appetite'],
          treatment: 'supportive care, antibiotics',
          severity: 'high',
          contagious: true,
          reportable: true
        }
      ]
    };
  }

  async analyzeSymptoms(symptoms) {
    try {
      // Try ML model first
      if (this.model) {
        return await this.mlSymptomAnalysis(symptoms);
      }
      
      // Fallback to rule-based analysis
      return this.ruleBasedSymptomAnalysis(symptoms);
    } catch (error) {
      console.error('Symptom analysis error:', error);
      return this.ruleBasedSymptomAnalysis(symptoms);
    }
  }

  async mlSymptomAnalysis(symptoms) {
    // Convert symptoms to tensor
    const symptomTensor = this.encodeSymptoms(symptoms);
    
    // Run inference
    const prediction = await this.model.predict(symptomTensor);
    const results = await prediction.data();
    
    // Decode results
    const diagnoses = this.decodePredictions(results);
    
    return {
      primaryDiagnosis: diagnoses[0],
      differentialDiagnoses: diagnoses.slice(1, 4),
      confidence: results[0],
      analysisMethod: 'ml'
    };
  }

  ruleBasedSymptomAnalysis(symptoms) {
    const matches = [];
    const symptomSet = new Set(symptoms);

    // Check each disease in database
    for (const [species, diseases] of Object.entries(this.diseaseDatabase)) {
      for (const disease of diseases) {
        const diseaseSymptoms = new Set(disease.symptoms);
        const intersection = new Set(
          [...symptomSet].filter(s => diseaseSymptoms.has(s))
        );
        
        const matchPercentage = (intersection.size / diseaseSymptoms.size) * 100;
        
        if (matchPercentage > 50) {
          matches.push({
            ...disease,
            matchPercentage,
            matchedSymptoms: Array.from(intersection)
          });
        }
      }
    }

    // Sort by match percentage
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      primaryDiagnosis: matches[0]?.name || 'Unknown',
      differentialDiagnoses: matches.slice(1, 4).map(m => m.name),
      possibleDiseases: matches,
      analysisMethod: 'rule-based',
      disclaimer: 'This is an AI-assisted preliminary diagnosis. Please consult a veterinarian for confirmation.'
    };
  }

  async analyzeImages(imageUrls) {
    try {
      const results = [];

      for (const url of imageUrls) {
        // Load and preprocess image
        const imagePath = url.startsWith('/uploads') ? 
          path.join(__dirname, '../..', url) : url;
        
        if (fs.existsSync(imagePath)) {
          const processedImage = await this.preprocessImage(imagePath);
          
          // Run image analysis
          const analysis = await this.runImageAnalysis(processedImage);
          results.push({
            url,
            analysis
          });
        }
      }

      // Combine results from multiple images
      return this.combineImageAnalyses(results);
    } catch (error) {
      console.error('Image analysis error:', error);
      return null;
    }
  }

  async preprocessImage(imagePath) {
    try {
      // Resize and normalize image
      const imageBuffer = await sharp(imagePath)
        .resize(224, 224)
        .normalize()
        .toBuffer();

      // Convert to tensor
      const tensor = tf.node.decodeImage(imageBuffer, 3)
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));

      return tensor;
    } catch (error) {
      console.error('Image preprocessing error:', error);
      throw error;
    }
  }

  async runImageAnalysis(imageTensor) {
    // This would run the actual ML model
    // For now, return placeholder analysis
    return {
      detectedIssues: ['possible skin lesion'],
      confidence: 0.75,
      recommendations: ['Consult veterinarian for examination']
    };
  }

  combineImageAnalyses(results) {
    if (results.length === 0) return null;

    // Combine findings from multiple images
    const allIssues = results.flatMap(r => r.analysis.detectedIssues);
    const avgConfidence = results.reduce((sum, r) => sum + r.analysis.confidence, 0) / results.length;

    // Get unique issues
    const uniqueIssues = [...new Set(allIssues)];

    return {
      detectedIssues: uniqueIssues,
      confidence: avgConfidence,
      imagesAnalyzed: results.length,
      recommendations: ['Based on image analysis, please provide symptom details for better diagnosis']
    };
  }

  encodeSymptoms(symptoms) {
    // Convert symptoms to one-hot encoding
    const allSymptoms = [
      'fever', 'coughing', 'diarrhea', 'lameness', 'weight_loss',
      'blisters_mouth', 'difficulty_breathing', 'nasal_discharge',
      'loss_appetite', 'weakness', 'rough_coat', 'anemia',
      'skin_lesions', 'mouth_sores', 'drooling'
    ];

    const encoding = allSymptoms.map(symptom => 
      symptoms.includes(symptom) ? 1 : 0
    );

    return tf.tensor2d([encoding]);
  }

  decodePredictions(predictions) {
    // This would decode model outputs to disease names
    // For now, return placeholder
    return ['Foot and Mouth Disease', 'CBPP', 'Internal Parasites'];
  }

  async getTreatmentRecommendations(diagnosis, species) {
    // Get treatment recommendations based on diagnosis
    for (const [diseaseSpecies, diseases] of Object.entries(this.diseaseDatabase)) {
      if (diseaseSpecies === species || diseaseSpecies === 'cattle') { // fallback to cattle
        const disease = diseases.find(d => 
          d.name.toLowerCase().includes(diagnosis.toLowerCase())
        );
        
        if (disease) {
          return {
            diagnosis: disease.name,
            treatment: disease.treatment,
            severity: disease.severity,
            contagious: disease.contagious,
            reportable: disease.reportable,
            disclaimer: 'Please consult a veterinarian before administering treatment.'
          };
        }
      }
    }

    return {
      diagnosis: 'Unknown',
      treatment: 'Consult a veterinarian immediately',
      disclaimer: 'Unable to determine specific treatment. Professional veterinary advice required.'
    };
  }
}

module.exports = new AIDiagnosticService();