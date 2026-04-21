import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

const MessageInput = ({ onSendMessage, onTyping, disabled = false, offline = false }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);

    // Typing indicator
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1000);
  };

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      setIsTyping(false);
      onTyping?.(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files) => {
    const newAttachments = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newAttachments.push({
          id: Date.now() + Math.random(),
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          url: reader.result,
          file: file
        });
        
        if (newAttachments.length === files.length) {
          setAttachments(prev => [...prev, ...newAttachments]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      const files = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        handleFileSelect(files);
      }
    }
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="px-6 py-4 border-t border-sage-200 dark:border-sage-800">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map(attachment => (
            <div
              key={attachment.id}
              className="relative group"
            >
              {attachment.type.startsWith('image/') ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-sage-200 dark:border-sage-800">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-sage-100 dark:bg-sage-800 rounded-lg">
                  <span className="material-icons-outlined text-sm">insert_drive_file</span>
                  <span className="text-xs truncate max-w-[100px]">{attachment.name}</span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-icons-outlined text-xs">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            onPaste={handlePaste}
            placeholder={disabled 
              ? (t('telehealth.consultationEnded') || 'This consultation has ended')
              : (t('telehealth.typeMessage') || 'Type your message...')}
            disabled={disabled}
            rows="1"
            className="w-full px-4 py-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          
          {/* Character Count (for long messages) */}
          {message.length > 500 && (
            <div className="absolute bottom-2 right-3 text-xs text-amber-600">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Attachment Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          icon="attach_file"
          className="!p-3"
        />

        {/* Send Button */}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          icon="send"
          className="!p-3"
        />
      </div>

      {/* Offline Indicator */}
      {offline && (
        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
          <span className="material-icons-outlined text-xs">cloud_off</span>
          {t('telehealth.offlineMessage') || 'You are offline. Messages will be sent when connection is restored.'}
        </p>
      )}

      {/* Typing Hint */}
      <p className="text-xs text-sage-400 mt-2">
        {t('telehealth.enterToSend') || 'Press Enter to send, Shift+Enter for new line'}
      </p>
    </div>
  );
};

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func,
  disabled: PropTypes.bool,
  offline: PropTypes.bool,
};

export default MessageInput;