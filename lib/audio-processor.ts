import { getFFmpeg } from './ffmpeg';

export interface AudioProcessingOptions {
  tempo: number;
  pitch: number;
  vinylCrackle: number;
  tapeWarble: number;
  ambientSounds: {
    rain: boolean;
    coffeeShop: boolean;
    forest: boolean;
  };
  lofiEffect?: {
    roomSize?: number;
    damping?: number;
    wetLevel?: number;
    dryLevel?: number;
    delay?: number;
    slowFactor?: number;
  };
  echoEffect?: {
    delay?: number;     // Time between echoes in seconds
    decay?: number;     // How quickly echo volume reduces
    feedback?: number;  // Amount of echo signal fed back into input
    maxEchoes?: number; // Maximum number of echo repetitions
  };
}

export async function processAudio(
  audioContext: AudioContext, 
  file: File, 
  options: AudioProcessingOptions
): Promise<AudioBufferSourceNode | null> {
  try {
    // Convert file to AudioBuffer
    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Apply lofi effect
    const lofiBuffer = await createLofiEffect(audioContext, originalBuffer, options.lofiEffect);

    // Apply echo effect
    const echoBuffer = await createEchoEffect(audioContext, lofiBuffer, options.echoEffect);

    // Create source node
    const source = audioContext.createBufferSource();
    source.buffer = echoBuffer;

    // Connect and return source
    source.connect(audioContext.destination);
    return source;
  } catch (error) {
    console.error('Audio processing error:', error);
    return null;
  }
}

async function createEchoEffect(
  audioContext: AudioContext, 
  audioBuffer: AudioBuffer,
  echoOptions: AudioProcessingOptions['echoEffect'] = {}
): Promise<AudioBuffer> {
  // Default echo settings
  const defaultOptions = {
    delay: 0.25,     // 250ms between echoes
    decay: 0.5,      // 50% volume reduction per echo
    feedback: 0.3,   // 30% feedback
    maxEchoes: 5     // Maximum 5 echo repetitions
  };

  const settings = { ...defaultOptions, ...echoOptions };

  // Calculate total length needed for echo effect
  const delaySamples = Math.floor(settings.delay * audioBuffer.sampleRate);
  const totalLength = audioBuffer.length + (delaySamples * settings.maxEchoes);

  // Create new buffer to accommodate echoes
  const echoBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    totalLength,
    audioBuffer.sampleRate
  );

  // Process each channel
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const originalData = audioBuffer.getChannelData(channel);
    const echoData = echoBuffer.getChannelData(channel);

    // Copy original audio first
    echoData.set(originalData);

    // Generate echo effect
    for (let echo = 1; echo <= settings.maxEchoes; echo++) {
      const echoStart = echo * delaySamples;
      const echoVolume = Math.pow(settings.decay, echo);

      for (let i = 0; i < originalData.length; i++) {
        if (echoStart + i < totalLength) {
          const sourceIndex = i;
          echoData[echoStart + i] += originalData[sourceIndex] * 
            echoVolume * 
            Math.pow(settings.feedback, echo);
        }
      }
    }
  }

  return echoBuffer;
}

async function createLofiEffect(
  audioContext: AudioContext, 
  audioBuffer: AudioBuffer,
  lofiOptions: AudioProcessingOptions['lofiEffect'] = {}
): Promise<AudioBuffer> {
  // Default lofi effect settings
  const defaultOptions = {
    roomSize: 0.75,
    damping: 0.5,
    wetLevel: 0.08,
    dryLevel: 0.2,
    delay: 2,
    slowFactor: 0.08
  };

  const settings = { ...defaultOptions, ...lofiOptions };

  // Slow down audio
  const slowedBuffer = await slowAudioBuffer(audioBuffer, settings.slowFactor!);

  // Create reverb effect
  const reverbBuffer = createReverbBuffer(audioContext, settings);

  // Mix original and reverb
  return mixBuffersWithReverb(audioContext, slowedBuffer, reverbBuffer, settings);
}

async function slowAudioBuffer(
  audioBuffer: AudioBuffer, 
  slowFactor: number
): Promise<AudioBuffer> {
  const { length, sampleRate, numberOfChannels } = audioBuffer;
  const slowedLength = Math.floor(length / (1 - slowFactor));
  
  const slowedBuffer = new AudioBuffer({ 
    length: slowedLength, 
    sampleRate, 
    numberOfChannels 
  });

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const originalData = audioBuffer.getChannelData(channel);
    const slowedData = slowedBuffer.getChannelData(channel);

    for (let i = 0; i < slowedLength; i++) {
      const originalIndex = Math.floor(i * (1 - slowFactor));
      slowedData[i] = originalData[originalIndex] || 0;
    }
  }

  return slowedBuffer;
}

function createReverbBuffer(
  audioContext: AudioContext, 
  options: Partial<AudioProcessingOptions['lofiEffect']>
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const length = Math.floor(sampleRate * (options.roomSize || 0.75));
  const reverbBuffer = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < reverbBuffer.numberOfChannels; channel++) {
    const buffer = reverbBuffer.getChannelData(channel);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = (Math.random() * 2 - 1) * 
        Math.exp(-i / (sampleRate * (options.damping || 0.5)));
    }
  }

  return reverbBuffer;
}

function mixBuffersWithReverb(
  audioContext: AudioContext,
  sourceBuffer: AudioBuffer,
  reverbBuffer: AudioBuffer,
  options: Partial<AudioProcessingOptions['lofiEffect']>
): AudioBuffer {
  const mixedBuffer = audioContext.createBuffer(
    sourceBuffer.numberOfChannels,
    sourceBuffer.length,
    sourceBuffer.sampleRate
  );

  const wetLevel = options.wetLevel || 0.08;
  const dryLevel = options.dryLevel || 0.2;

  for (let channel = 0; channel < sourceBuffer.numberOfChannels; channel++) {
    const sourceData = sourceBuffer.getChannelData(channel);
    const reverbData = reverbBuffer.getChannelData(channel);
    const mixedData = mixedBuffer.getChannelData(channel);

    for (let i = 0; i < sourceBuffer.length; i++) {
      // Mix dry and wet signals
      mixedData[i] = 
        sourceData[i] * dryLevel + 
        (reverbData[i % reverbData.length] * wetLevel);
    }
  }

  return mixedBuffer;
}

// Existing export and utility functions remain the same
export async function exportProcessedAudio(
  audioBuffer: AudioBuffer, 
  filename: string = 'processed_audio.wav'
): Promise<void> {
  const ffmpeg = await getFFmpeg();
  const wavData = await audioBufferToWav(audioBuffer);
  await ffmpeg.run('-i', wavData, filename);
}

async function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Uint8Array> {
  const { numberOfChannels, sampleRate, length } = audioBuffer;
  const wavBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(wavBuffer);

  // Write WAV header
  writeWavHeader(view, numberOfChannels, sampleRate, length);

  // Write audio data
  let offset = 44;
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < channelData.length; i++) {
      view.setInt16(offset, channelData[i] * 0x7fff, true);
      offset += 2;
    }
  }

  return new Uint8Array(wavBuffer);
}

function writeWavHeader(
  view: DataView, 
  channels: number, 
  sampleRate: number, 
  length: number
): void {
  const blockAlign = channels * 2;
  const byteRate = sampleRate * blockAlign;

  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + length * blockAlign, true); // file size - 8 bytes
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // size of fmt chunk
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, channels, true); // number of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, byteRate, true); // byte rate
  view.setUint16(32, blockAlign, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, length * blockAlign, true); // data chunk size
}