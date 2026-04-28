// SymptomChecker components index file
import SpeciesSelector from './SpeciesSelector';
import AffectedAreaSelector from './AffectedAreaSelector';
import SymptomList from './SymptomList';
import PhotoUpload from './PhotoUpload';
import AIResults from './AIResults';
import FMDWarning from './FMDWarning';
import TreatmentRecommendations from './TreatmentRecommendations';
import StepProgress from './StepProgress';

// Re-export all symptom checker components as a single object
const SymptomCheckerComponents = {
  SpeciesSelector,
  AffectedAreaSelector,
  SymptomList,
  PhotoUpload,
  AIResults,
  FMDWarning,
  TreatmentRecommendations,
  StepProgress,
};

export default SymptomCheckerComponents;