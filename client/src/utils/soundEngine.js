/**
 * StudyFlow — Native Web Audio Sound Generator
 * 
 * Generates continuous calming study atmospheres and soft completion chimes
 * entirely in-browser using Web Audio API — zero external mp3 files, zero latency,
 * completely functional offline!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.activeSource = null;
    this.gainNode = null;
    this.masterVolume = 0.5;
    this.isMuted = false;
    this.currentAtmosphere = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx && !this.isMuted) {
      this.gainNode.gain.setTargetAtTime(this.masterVolume * 0.15, this.ctx.currentTime, 0.1);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.masterVolume * 0.15;
      this.gainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  stopAtmosphere() {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch {
        // ignore
      }
      this.activeSource = null;
    }
    this.currentAtmosphere = null;
  }

  playAtmosphere(type) {
    this.init();
    if (!this.ctx) return;

    if (this.currentAtmosphere === type) {
      this.stopAtmosphere();
      return;
    }

    this.stopAtmosphere();
    this.currentAtmosphere = type;

    // Buffer length: 5 seconds of looping noise
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "brown" || type === "cafe") {
        // Brown noise (warm low rumble)
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === "rain") {
        // Pinkish rain with random droplet intensity
        lastOut = 0.95 * lastOut + white * 0.05;
        data[i] = lastOut * 2.2;
      } else if (type === "wind") {
        // Gentle undulating wave
        const mod = Math.sin((i / bufferSize) * Math.PI * 4) * 0.5 + 0.5;
        lastOut = (lastOut + 0.03 * white) / 1.03;
        data[i] = lastOut * (1.5 + mod);
      } else {
        // Soft white noise
        data[i] = white * 0.15;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Lowpass filter for cozy soothing warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = type === "rain" ? 1400 : type === "cafe" ? 550 : 800;

    this.gainNode = this.ctx.createGain();
    const targetGain = this.isMuted ? 0 : this.masterVolume * 0.15;
    this.gainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    noise.start();
    this.activeSource = noise;
  }

  // Tibetan Singing Bowl Harmonic Bell for Pomodoro Completion
  playCompletionChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const fundamental = 432; // Harmonic peaceful frequency (A=432Hz)
    const harmonics = [fundamental, fundamental * 1.5, fundamental * 2.0];

    harmonics.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const initialVol = (0.25 / (index + 1)) * this.masterVolume;
      gain.gain.setValueAtTime(initialVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.6);
    });
  }
}

export const soundEngine = new SoundEngine();
