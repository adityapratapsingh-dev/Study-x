// Pure Web Audio API synthesized ambient noise generators
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentType: 'rain' | 'white' | 'lofi' | null = null;
  private isPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(type: 'rain' | 'white' | 'lofi', volume = 0.25) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.currentType = type;
    this.isPlaying = true;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'white') {
      // White noise generator
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      // Low pass filter for soothing sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      whiteNoise.start(0);
      this.currentSource = whiteNoise;
    } else if (type === 'rain') {
      // Pink/Brownish rain generator
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.25;
        data[i] = (b0 + b1 + b2) * 0.4;
      }

      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = buffer;
      rainSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.5, this.ctx.currentTime);

      rainSource.connect(filter);
      filter.connect(this.gainNode);
      rainSource.start(0);
      this.currentSource = rainSource;
    } else if (type === 'lofi') {
      // Warm low drone/binaural-like focus hum
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(146, this.ctx.currentTime); // 6Hz theta binaural beat

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.gainNode);

      osc1.start(0);
      osc2.start(0);
      this.currentSource = osc1;
    }
  }

  setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  stop() {
    if (this.currentSource) {
      try {
        (this.currentSource as any).stop?.();
        this.currentSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.currentSource = null;
    }
    this.isPlaying = false;
    this.currentType = null;
  }

  getStatus() {
    return { isPlaying: this.isPlaying, type: this.currentType };
  }
}

export const ambientAudio = new AmbientAudioEngine();
