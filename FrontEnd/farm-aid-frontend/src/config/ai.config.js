// AI configuration
export const aiConfig = {
  // Enable AI features
  enabled: process.env.REACT_APP_AI_ENABLED !== 'false',
  
  // AI models
  models: {
    symptomChecker: {
      enabled: true,
      version: '1.0.0',
      type: 'tensorflow', // 'tensorflow', 'api', 'mock'
      path: '/models/symptom-checker/model.json',
      accuracy: 0.92,
      latency: 1000, // ms
      offlineCapable: true,
    },
    imageAnalysis: {
      enabled: true,
      version: '1.0.0',
      type: 'api',
      endpoint: '/ai/analyze-image',
      accuracy: 0.89,
      latency: 2000, // ms
      offlineCapable: false,
    },
    diseasePrediction: {
      enabled: true,
      version: '1.0.0',
      type: 'api',
      endpoint: '/ai/predict-disease',
      accuracy: 0.85,
      latency: 1500, // ms
      offlineCapable: false,
    },
    treatmentRecommendation: {
      enabled: true,
      version: '1.0.0',
      type: 'rules', // 'rules', 'api', 'ml'
      accuracy: 0.88,
      latency: 500, // ms
      offlineCapable: true,
    },
    riskAssessment: {
      enabled: true,
      version: '1.0.0',
      type: 'api',
      endpoint: '/ai/risk-assessment',
      accuracy: 0.82,
      latency: 2000, // ms
      offlineCapable: false,
    },
  },

  // Diseases supported by AI
  diseases: [
    {
      id: 'fmd',
      name: 'Foot and Mouth Disease',
      notifiable: true,
      priority: 'critical',
      species: ['cattle', 'goat', 'sheep'],
      symptoms: ['fever', 'salivation', 'blisters', 'lameness'],
      confidenceThreshold: 0.7,
    },
    {
      id: 'heartwater',
      name: 'Heartwater',
      notifiable: true,
      priority: 'high',
      species: ['cattle', 'goat', 'sheep'],
      symptoms: ['fever', 'nervous signs', 'difficulty breathing'],
      confidenceThreshold: 0.65,
    },
    {
      id: 'anthrax',
      name: 'Anthrax',
      notifiable: true,
      priority: 'critical',
      species: ['cattle', 'goat', 'sheep'],
      symptoms: ['sudden death', 'fever', 'bloody discharges'],
      confidenceThreshold: 0.8,
    },
    {
      id: 'lsd',
      name: 'Lumpy Skin Disease',
      notifiable: true,
      priority: 'high',
      species: ['cattle'],
      symptoms: ['skin lesions', 'fever', 'lumps'],
      confidenceThreshold: 0.7,
    },
    {
      id: 'cbpp',
      name: 'Contagious Bovine Pleuropneumonia',
      notifiable: true,
      priority: 'high',
      species: ['cattle'],
      symptoms: ['difficulty breathing', 'fever', 'coughing'],
      confidenceThreshold: 0.7,
    },
    {
      id: 'blackleg',
      name: 'Blackleg',
      notifiable: false,
      priority: 'medium',
      species: ['cattle', 'sheep'],
      symptoms: ['lameness', 'swelling', 'fever'],
      confidenceThreshold: 0.65,
    },
    {
      id: 'mastitis',
      name: 'Mastitis',
      notifiable: false,
      priority: 'medium',
      species: ['cattle', 'goat', 'sheep'],
      symptoms: ['swollen udder', 'abnormal milk', 'fever'],
      confidenceThreshold: 0.6,
    },
  ],

  // Symptom database
  symptoms: {
    cattle: [
      'fever',
      'lameness',
      'salivation',
      'blisters',
      'coughing',
      'difficulty breathing',
      'nasal discharge',
      'skin lesions',
      'lumps',
      'swelling',
      'loss of appetite',
      'weight loss',
      'diarrhea',
      'bloating',
      'nervous signs',
      'sudden death',
    ],
    goat: [
      'fever',
      'lameness',
      'salivation',
      'blisters',
      'coughing',
      'difficulty breathing',
      'nasal discharge',
      'skin lesions',
      'lumps',
      'swelling',
      'loss of appetite',
      'weight loss',
      'diarrhea',
      'nervous signs',
    ],
    sheep: [
      'fever',
      'lameness',
      'salivation',
      'blisters',
      'coughing',
      'difficulty breathing',
      'nasal discharge',
      'skin lesions',
      'lumps',
      'swelling',
      'loss of appetite',
      'weight loss',
      'diarrhea',
      'nervous signs',
    ],
  },

  // Body areas for symptom selection
  bodyAreas: [
    { id: 'mouth', name: 'Mouth', icon: 'mouthpiece' },
    { id: 'feet', name: 'Feet/Legs', icon: 'footprint' },
    { id: 'skin', name: 'Skin/Hide', icon: 'skincare' },
    { id: 'breathing', name: 'Breathing', icon: 'lungs' },
    { id: 'stomach', name: 'Digestive', icon: 'stomach' },
    { id: 'eyes', name: 'Eyes', icon: 'visibility' },
    { id: 'udder', name: 'Udder', icon: 'pets' },
    { id: 'general', name: 'General', icon: 'person' },
  ],

  // Confidence levels
  confidenceLevels: {
    'very-high': { min: 0.9, label: 'Very High', color: 'green' },
    'high': { min: 0.7, label: 'High', color: 'blue' },
    'moderate': { min: 0.5, label: 'Moderate', color: 'amber' },
    'low': { min: 0.3, label: 'Low', color: 'orange' },
    'very-low': { min: 0, label: 'Very Low', color: 'red' },
  },

  // AI service endpoints
  endpoints: {
    symptomCheck: '/ai/symptom-check',
    analyzeImage: '/ai/analyze-image',
    predictDisease: '/ai/predict-disease',
    treatment: '/ai/treatment-recommendations',
    areaPrediction: '/ai/area-prediction',
    trends: '/ai/analyze-trends',
    anomalies: '/ai/detect-anomalies',
    risk: '/ai/risk-assessment',
    matchSymptoms: '/ai/match-symptoms',
    vaccinationReminders: '/ai/vaccination-reminders',
    optimizeFeeding: '/ai/optimize-feeding',
    predictWeight: '/ai/predict-weight',
  },

  // Model training
  training: {
    enabled: false,
    frequency: 'weekly',
    dataRetention: 90, // days
    minimumSamples: 1000,
    validationSplit: 0.2,
    testSplit: 0.1,
  },

  // Performance
  performance: {
    cacheResults: true,
    cacheTTL: 3600000, // 1 hour
    maxConcurrentRequests: 5,
    timeout: 10000, // 10 seconds
    retryAttempts: 2,
    batchSize: 10,
  },

  // Fallback behavior
  fallback: {
    onError: 'rule-based', // 'rule-based', 'cache', 'none'
    onOffline: 'rule-based',
    onTimeout: 'cache',
    defaultConfidence: 0.5,
  },

  // Monitoring
  monitoring: {
    enabled: true,
    logPredictions: true,
    logErrors: true,
    logLatency: true,
    trackAccuracy: true,
    feedbackLoop: true,
  },

  // Local models (for offline use)
  localModels: {
    symptomChecker: {
      enabled: true,
      size: '5MB',
      version: '1.0.0',
      lastUpdated: '2024-01-01',
    },
    treatmentRecommendations: {
      enabled: true,
      size: '2MB',
      version: '1.0.0',
      lastUpdated: '2024-01-01',
    },
  },

  // API rate limiting
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    perSeconds: 60,
  },

  // Debugging
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    logPredictions: true,
    logConfidence: true,
    simulateDelay: false,
    simulateErrors: false,
    mockResponses: false,
  },
};

export default aiConfig;