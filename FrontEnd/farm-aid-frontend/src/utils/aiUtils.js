// Calculate confidence level for AI predictions
export const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.9) return 'very high';
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.5) return 'moderate';
  if (confidence >= 0.3) return 'low';
  return 'very low';
};

// Get color for confidence level
export const getConfidenceColor = (confidence) => {
  if (confidence >= 0.9) return 'text-green-600';
  if (confidence >= 0.7) return 'text-blue-600';
  if (confidence >= 0.5) return 'text-amber-600';
  if (confidence >= 0.3) return 'text-orange-600';
  return 'text-red-600';
};

// Get background color for confidence level
export const getConfidenceBgColor = (confidence) => {
  if (confidence >= 0.9) return 'bg-green-100';
  if (confidence >= 0.7) return 'bg-blue-100';
  if (confidence >= 0.5) return 'bg-amber-100';
  if (confidence >= 0.3) return 'bg-orange-100';
  return 'bg-red-100';
};

// Calculate risk level from predictions
export const calculateRiskLevel = (diseases) => {
  const maxConfidence = Math.max(...diseases.map(d => d.confidence));
  
  if (maxConfidence >= 0.8) return 'high';
  if (maxConfidence >= 0.5) return 'medium';
  return 'low';
};

// Get priority from disease name
export const getDiseasePriority = (diseaseName) => {
  const criticalDiseases = ['foot and mouth', 'fmd', 'anthrax', 'rabies'];
  const highDiseases = ['heartwater', 'cbpp', 'lsd', 'lumpy skin'];
  const mediumDiseases = ['blackleg', 'brucellosis', 'mastitis'];
  
  const name = diseaseName.toLowerCase();
  
  if (criticalDiseases.some(d => name.includes(d))) return 'critical';
  if (highDiseases.some(d => name.includes(d))) return 'high';
  if (mediumDiseases.some(d => name.includes(d))) return 'medium';
  
  return 'low';
};

// Get recommended action based on disease
export const getRecommendedAction = (disease) => {
  if (disease.notifiable) {
    return 'IMMEDIATE ACTION: Report to DVS and isolate animals';
  }
  
  switch (disease.priority) {
    case 'critical':
      return 'URGENT: Isolate animals and consult veterinarian immediately';
    case 'high':
      return 'Consult veterinarian within 24 hours';
    case 'medium':
      return 'Monitor closely and consult if symptoms persist';
    case 'low':
      return 'Monitor and maintain biosecurity measures';
    default:
      return 'Consult veterinarian if concerned';
  }
};

// Generate treatment summary
export const generateTreatmentSummary = (diagnosis, confidence) => {
  if (confidence < 0.3) {
    return 'Low confidence diagnosis. Please consult a veterinarian for accurate diagnosis.';
  }
  
  if (confidence < 0.6) {
    return `Possible ${diagnosis}. Veterinary confirmation recommended.`;
  }
  
  return `Likely ${diagnosis}. Follow treatment guidelines and monitor closely.`;
};

// Calculate match score between symptoms and disease
export const calculateMatchScore = (symptoms, diseaseSymptoms) => {
  if (!diseaseSymptoms.length) return 0;
  
  const matched = symptoms.filter(s => 
    diseaseSymptoms.some(ds => ds.toLowerCase().includes(s.toLowerCase()))
  );
  
  return matched.length / diseaseSymptoms.length;
};

// Get symptom severity
export const getSymptomSeverity = (symptom) => {
  const severeSymptoms = ['difficulty breathing', 'unconscious', 'severe bleeding', 'broken bone'];
  const moderateSymptoms = ['lameness', 'fever', 'swelling', 'loss of appetite'];
  
  const name = symptom.toLowerCase();
  
  if (severeSymptoms.some(s => name.includes(s))) return 'severe';
  if (moderateSymptoms.some(s => name.includes(s))) return 'moderate';
  
  return 'mild';
};

// Get symptom category
export const getSymptomCategory = (symptom) => {
  const respiratory = ['cough', 'sneeze', 'difficulty breathing', 'nasal discharge'];
  const digestive = ['diarrhea', 'vomiting', 'bloating', 'loss of appetite'];
  const musculoskeletal = ['lameness', 'swelling', 'stiffness', 'reluctant to move'];
  const skin = ['lesions', 'lumps', 'hair loss', 'itching'];
  const neurological = ['tremors', 'seizures', 'circling', 'head tilt'];
  
  const name = symptom.toLowerCase();
  
  if (respiratory.some(s => name.includes(s))) return 'respiratory';
  if (digestive.some(s => name.includes(s))) return 'digestive';
  if (musculoskeletal.some(s => name.includes(s))) return 'musculoskeletal';
  if (skin.some(s => name.includes(s))) return 'skin';
  if (neurological.some(s => name.includes(s))) return 'neurological';
  
  return 'other';
};

// Calculate treatment urgency
export const calculateTreatmentUrgency = (diagnosis, symptoms) => {
  if (diagnosis.notifiable) return 'immediate';
  
  const severeCount = symptoms.filter(s => getSymptomSeverity(s) === 'severe').length;
  
  if (severeCount > 0) return 'urgent';
  if (severeCount > 2) return 'immediate';
  
  return 'routine';
};

// Generate prevention tips
export const generatePreventionTips = (disease) => {
  const tips = [];
  
  if (disease.transmission?.includes('contact')) {
    tips.push('Isolate new or sick animals');
    tips.push('Practice good biosecurity');
  }
  
  if (disease.transmission?.includes('tick')) {
    tips.push('Implement tick control program');
    tips.push('Regular dipping/spraying');
  }
  
  if (disease.vaccination) {
    tips.push('Follow recommended vaccination schedule');
  }
  
  return tips;
};

// Calculate recovery time estimate
export const estimateRecoveryTime = (disease, severity) => {
  const baseTime = disease.recoveryTime || 14; // days
  
  switch (severity) {
    case 'mild':
      return Math.round(baseTime * 0.7);
    case 'moderate':
      return baseTime;
    case 'severe':
      return Math.round(baseTime * 1.5);
    default:
      return baseTime;
  }
};

// Get monitoring frequency
export const getMonitoringFrequency = (severity) => {
  switch (severity) {
    case 'critical':
      return 'every 2 hours';
    case 'high':
      return 'every 4 hours';
    case 'medium':
      return 'every 8 hours';
    case 'low':
      return 'daily';
    default:
      return 'as needed';
  }
};