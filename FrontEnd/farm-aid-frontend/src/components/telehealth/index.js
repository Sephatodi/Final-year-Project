// Telehealth components index file
import ChatWindow from './ChatWindow';
import ConsultationCard from './ConsultationCard';
import ConsultationList from './ConsultationList';
import ConsultationSummary from './ConsultationSummary';
import ExpertInfo from './ExpertInfo';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import RatingModal from './RatingModal';
import VideoCall from './VideoCall';

export {
  ChatWindow,
  ConsultationCard,
  ConsultationList,
  ConsultationSummary,
  ExpertInfo,
  MessageBubble,
  MessageInput,
  RatingModal,
  VideoCall,
};

// Re-export all telehealth components as a single object
const TelehealthComponents = {
  ConsultationList,
  ConsultationCard,
  ChatWindow,
  MessageBubble,
  MessageInput,
  ExpertInfo,
  VideoCall,
  ConsultationSummary,
  RatingModal,
};

export default TelehealthComponents;
