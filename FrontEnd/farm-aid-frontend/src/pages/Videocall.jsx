// VideoCall.jsx - WebRTC Video Integration
const VideoCall = ({ consultationId, farmerId, vetId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  
  useEffect(() => {
    // Initialize WebRTC
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    
    // Get local camera/mic stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      });
    
    // Handle remote stream
    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };
    
    // WebSocket signaling
    const ws = new WebSocket('wss://api.farmaid.bw/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'offer') {
        pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        pc.createAnswer().then(answer => {
          pc.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', answer, consultationId }));
        });
      } else if (data.type === 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === 'ice-candidate') {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
    
    // Send ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ 
          type: 'ice-candidate', 
          candidate: event.candidate,
          consultationId 
        }));
      }
    };
    
    setPeerConnection(pc);
    
    return () => {
      pc.close();
      ws.close();
    };
  }, [consultationId]);
  
  return (
    <div className="video-call-container">
      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div className="local-video">
        <video ref={localVideoRef} autoPlay playsInline muted />
      </div>
      <div className="controls">
        <button onClick={toggleMute}>🎤 Mute</button>
        <button onClick={toggleVideo}>📹 Camera</button>
        <button onClick={endCall} className="bg-red-500">📞 End Call</button>
      </div>
    </div>
  );
};