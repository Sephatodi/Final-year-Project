import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Card from '../common/Card';
import Button from '../common/Button';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ExpertInfo from './ExpertInfo';

const ChatWindow = ({
  consultation,
  messages = [],
  onSendMessage,
  onTyping,
  onEndConsultation,
  loading = false
}) => {
  const { t } = useTranslation();
  const { isOffline } = useOffline();
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (typing) => {
    setIsTyping(typing);
    if (onTyping) {
      onTyping(typing);
    }
  };

  const handleSendMessage = (content, attachments) => {
    onSendMessage({
      content,
      attachments,
      timestamp: new Date().toISOString(),
      senderId: 'current-user', // Would come from auth
      isOffline
    });
  };

  if (loading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sage-500">{t('common.loading') || 'Loading...'}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800 flex items-center justify-between">
        <ExpertInfo expert={consultation?.expert} consultation={consultation} />
        
        <div className="flex items-center gap-2">
          {consultation?.status === 'active' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon="videocam"
                onClick={() => {/* Handle video call */}}
              >
                {t('telehealth.videoCall') || 'Video Call'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="call"
                onClick={() => {/* Handle audio call */}}
              >
                {t('telehealth.audioCall') || 'Audio Call'}
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon="close"
            onClick={onEndConsultation}
          >
            {t('common.close') || 'Close'}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isOwn={message.senderId === 'current-user'}
            showAvatar={index === 0 || messages[index - 1]?.senderId !== message.senderId}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-sage-500">
            <div className="w-8 h-8 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center">
              <span className="text-sm">...</span>
            </div>
            <span className="text-sm">{t('telehealth.typing') || 'Typing...'}</span>
          </div>
        )}

        {/* Offline Indicator */}
        {isOffline && (
          <div className="text-center">
            <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 px-3 py-1 rounded-full">
              {t('telehealth.offlineMode') || 'Offline Mode - Messages will send when online'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={consultation?.status === 'resolved'}
        offline={isOffline}
      />

      {/* Consultation Footer */}
      {consultation?.status === 'resolved' && (
        <div className="px-6 py-3 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800 text-center">
          <p className="text-sm text-sage-500">
            {t('telehealth.consultationResolved') || 'This consultation has been resolved'}
          </p>
        </div>
      )}
    </Card>
  );
};

ChatWindow.propTypes = {
  consultation: PropTypes.object,
  messages: PropTypes.array,
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func,
  onEndConsultation: PropTypes.func,
  loading: PropTypes.bool,
};

export default ChatWindow;