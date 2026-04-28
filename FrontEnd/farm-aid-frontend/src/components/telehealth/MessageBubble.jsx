import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const MessageBubble = ({ message, isOwn, showAvatar = true }) => {
  const { t } = useTranslation();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sending':
        return <span className="material-icons-outlined text-xs text-sage-400">schedule</span>;
      case 'sent':
        return <span className="material-icons-outlined text-xs text-sage-400">done</span>;
      case 'delivered':
        return <span className="material-icons-outlined text-xs text-sage-400">done_all</span>;
      case 'read':
        return <span className="material-icons-outlined text-xs text-primary">done_all</span>;
      default:
        return null;
    }
  };

  const renderAttachment = (attachment) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-full max-h-64 object-contain cursor-zoom-in"
            onClick={() => window.open(attachment.url, '_blank')}
          />
        </div>
      );
    }

    return (
      <div className="mt-2 p-3 bg-sage-100 dark:bg-sage-800 rounded-lg flex items-center gap-3">
        <span className="material-icons-outlined text-sage-500">insert_drive_file</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-sage-500">{attachment.size}</p>
        </div>
        <a
          href={attachment.url}
          download={attachment.name}
          className="p-2 hover:bg-sage-200 dark:hover:bg-sage-700 rounded-lg transition-colors"
        >
          <span className="material-icons-outlined text-sm">download</span>
        </a>
      </div>
    );
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="material-icons-outlined text-sm text-primary">person</span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div>
          {/* Sender Name (for group chats) */}
          {showAvatar && !isOwn && message.senderName && (
            <p className="text-xs text-sage-500 mb-1 ml-2">{message.senderName}</p>
          )}

          {/* Message Bubble */}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwn
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-sage-100 dark:bg-sage-800 text-sage-900 dark:text-white rounded-bl-none'
            }`}
          >
            {/* Text Content */}
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            )}

            {/* Attachments */}
            {message.attachments?.map((attachment, index) => (
              <div key={index}>
                {renderAttachment(attachment)}
              </div>
            ))}

            {/* Timestamp and Status */}
            <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
              isOwn ? 'text-primary-100' : 'text-sage-500'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {isOwn && getStatusIcon(message.status)}
            </div>
          </div>

          {/* Offline Indicator */}
          {message.isOffline && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <span className="material-icons-outlined text-xs">cloud_off</span>
              {t('telehealth.willSend') || 'Will send when online'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string,
    attachments: PropTypes.array,
    senderId: PropTypes.string,
    senderName: PropTypes.string,
    senderAvatar: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.oneOf(['sending', 'sent', 'delivered', 'read']),
    isOffline: PropTypes.bool,
  }).isRequired,
  isOwn: PropTypes.bool,
  showAvatar: PropTypes.bool,
};

export default MessageBubble;