class CameraService {
  async getCameraStream(facingMode = 'environment', constraints = {}) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          ...constraints,
        },
      });
      return stream;
    } catch (error) {
      console.error('Failed to get camera stream:', error);
      throw error;
    }
  }

  async getFrontCamera() {
    return this.getCameraStream('user');
  }

  async getBackCamera() {
    return this.getCameraStream('environment');
  }

  stopStream(stream) {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  async takePhoto(videoElement) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
        });
      }, 'image/jpeg', 0.9);
    });
  }

  async getAvailableCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  }

  async switchCamera(currentStream, facingMode) {
    this.stopStream(currentStream);
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    return this.getCameraStream(newFacingMode);
  }

  async checkPermissions() {
    const result = await navigator.permissions.query({ name: 'camera' });
    return result.state; // 'granted', 'denied', 'prompt'
  }

  async requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stopStream(stream);
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  }

  async getSupportedConstraints() {
    return navigator.mediaDevices.getSupportedConstraints();
  }

  async getCapabilities(stream) {
    const track = stream.getVideoTracks()[0];
    return track.getCapabilities?.() || {};
  }

  async applyConstraints(stream, constraints) {
    const track = stream.getVideoTracks()[0];
    await track.applyConstraints(constraints);
  }

  async zoom(stream, factor) {
    const track = stream.getVideoTracks()[0];
    if (track.getCapabilities?.().zoom) {
      await track.applyConstraints({
        advanced: [{ zoom: factor }],
      });
    }
  }

  async torch(stream, enabled) {
    const track = stream.getVideoTracks()[0];
    if (track.getCapabilities?.().torch) {
      await track.applyConstraints({
        advanced: [{ torch: enabled }],
      });
    }
  }

  async focus(stream, mode = 'continuous') {
    const track = stream.getVideoTracks()[0];
    if (track.getCapabilities?.().focusMode) {
      await track.applyConstraints({
        advanced: [{ focusMode: mode }],
      });
    }
  }
}

export default new CameraService();