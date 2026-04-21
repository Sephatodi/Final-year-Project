// src/hooks/useAI.js
import { useState } from 'react';

export const useAI = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  const analyzeSymptoms = async (symptomData) => {
    setAnalyzing(true);
    setError(null);
    
    // Simulate AI analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock response based on symptoms
        const hasFMD = symptomData.symptoms.includes('mouth_sores') || 
                       symptomData.symptoms.includes('excessive_salivation');
        
        resolve({
          isFMD: hasFMD,
          disease: hasFMD ? 'Foot and Mouth Disease' : 'Common Cold',
          confidence: hasFMD ? 0.92 : 0.78,
          recommendations: hasFMD ? [
            'Isolate affected animal immediately',
            'Contact veterinary services',
            'Report to Department of Veterinary Services',
            'Disinfect all equipment and facilities'
          ] : [
            'Monitor animal for 24 hours',
            'Ensure adequate hydration',
            'Consult vet if symptoms persist'
          ],
          urgency: hasFMD ? 'high' : 'low'
        });
      }, 2000);
    }).finally(() => {
      setAnalyzing(false);
    });
  };
  
  return {
    analyzeSymptoms,
    analyzing,
    error
  };
};