import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';

const VideoCall = ({ onEndCall, remoteUser, isInitiator = false }) => {
  const { t } = useTranslation();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState('good');

  useEffect(() => {
    // Simulate getting local video stream
    if (localVideoRef.current) {
      // In production, this would use getUserMedia
      console.log('Initializing local video');
    }

    // Call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In production: toggle audio track
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // In production: toggle video track
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In production: implement screen sharing
  };

  const handleEndCall = () => {
    // In production: cleanup streams
    onEndCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Call Header */}
      <div className="bg-black/50 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-icons-outlined text-primary">videocam</span>
          </div>
          <div>
            <h3 className="font-bold">{remoteUser?.name || 'Veterinarian'}</h3>
            <p className="text-xs text-sage-300">
              {formatDuration(callDuration)} • {t('telecall.connecting') || 'Connected'}
            </p>
          </div>
        </div>

        {/* Connection Quality */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            connectionQuality === 'good' ? 'bg-green-500' :
            connectionQuality === 'fair' ? 'bg-amber-500' :
            'bg-red-500'
          }`} />
          <span className="text-sm text-sage-300">
            {connectionQuality === 'good' ? 'Good connection' :
             connectionQuality === 'fair' ? 'Fair connection' :
             'Poor connection'}
          </span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0 bg-gray-900">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            poster="https://via.placeholder.com/1280x720?text=Remote+Video"
          />
          
          {/* Remote User Info */}
          <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {remoteUser?.name || 'Veterinarian'}
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-white">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            poster="https://via.placeholder.com/640x480?text=You"
          />
          
          {isVideoOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <span className="material-icons-outlined text-4xl text-gray-400">videocam_off</span>
            </div>
          )}

          {/* Local User Name */}
          <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-0.5 rounded text-xs">
            You
          </div>
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-gray-900 px-6 py-6">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-4">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="material-icons-outlined text-2xl text-white">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          {/* Video On/Off */}
          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="material-icons-outlined text-2xl text-white">
              {isVideoOff ? 'videocam_off' : 'videocam'}
            </span>
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isScreenSharing 
                ? 'bg-primary hover:bg-primary-dark' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span className="material-icons-outlined text-2xl text-white">
              {isScreenSharing ? 'stop_screen_share' : 'screen_share'}
            </span>
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
          >
            <span className="material-icons-outlined text-2xl text-white">call_end</span>
          </button>
        </div>

        {/* Additional Options */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="text-sage-400 hover:text-white text-sm flex items-center gap-1">
            <span className="material-icons-outlined text-base">chat</span>
            Chat
          </button>
          <button className="text-sage-400 hover:text-white text-sm flex items-center gap-1">
            <span className="material-icons-outlined text-base">people</span>
            Add Participant
          </button>
          <button className="text-sage-400 hover:text-white text-sm flex items-center gap-1">
            <span className="material-icons-outlined text-base">settings</span>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

VideoCall.propTypes = {
  onEndCall: PropTypes.func.isRequired,
  remoteUser: PropTypes.object,
  isInitiator: PropTypes.bool,
};

export default VideoCall;