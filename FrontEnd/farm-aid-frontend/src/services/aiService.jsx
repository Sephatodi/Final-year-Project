import api, { post, uploadFile } from './api';

class AIService {
  async checkSymptoms(species, symptoms, photos = []) {
    const formData = new FormData();
    formData.append('species', species);
    formData.append('symptoms', JSON.stringify(symptoms));
    
    photos.forEach((photo, index) => {
      if (photo instanceof File) {
        formData.append(`photos[${index}]`, photo);
      }
    });

    const response = await api.post('/ai/symptom-check', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async analyzeImage(file) {
    const response = await uploadFile('/ai/analyze-image', file);
    return response.data;
  }

  async getDiseasePrediction(species, symptoms, location) {
    const response = await post('/ai/predict-disease', {
      species,
      symptoms,
      location,
    });
    return response.data;
  }

  async getTreatmentRecommendations(disease, species) {
    const response = await post('/ai/treatment-recommendations', {
      disease,
      species,
    });
    return response.data;
  }

  async getAreaPredictions(location, radius) {
    const response = await post('/ai/area-prediction', {
      location,
      radius,
    });
    return response.data;
  }

  async analyzeHealthTrends(animalIds, timeframe) {
    const response = await post('/ai/analyze-trends', {
      animalIds,
      timeframe,
    });
    return response.data;
  }

  async detectAnomalies(animalId, metrics) {
    const response = await post('/ai/detect-anomalies', {
      animalId,
      metrics,
    });
    return response.data;
  }

  async getRiskAssessment(farmData) {
    const response = await post('/ai/risk-assessment', farmData);
    return response.data;
  }

  async matchSymptomsToDisease(symptoms, species) {
    const response = await post('/ai/match-symptoms', {
      symptoms,
      species,
    });
    return response.data;
  }

  async getVaccinationReminders(herd) {
    const response = await post('/ai/vaccination-reminders', { herd });
    return response.data;
  }

  async optimizeFeeding(animalData) {
    const response = await post('/ai/optimize-feeding', animalData);
    return response.data;
  }

  async predictWeight(animalId, age, breed) {
    const response = await post('/ai/predict-weight', {
      animalId,
      age,
      breed,
    });
    return response.data;
  }
}

export default new AIService();