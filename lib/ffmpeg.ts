import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function getFFmpeg() {
  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      throw new Error('Failed to load FFmpeg');
    }
  }

  return ffmpeg;
}

export async function processAudioWithFFmpeg(file: File) {
  const ffmpeg = await getFFmpeg();
  const inputFileName = 'input' + file.name.substring(file.name.lastIndexOf('.'));
  const outputFileName = 'output.mp3';

  try {
    // Create a buffer from the file
    const data = await file.arrayBuffer();
    const inputData = new Uint8Array(data);

    // Write the file to FFmpeg's virtual filesystem
    await ffmpeg.writeFile(inputFileName, inputData);

    // Run FFmpeg command to process the audio
    await ffmpeg.exec([
      '-i', inputFileName,
      '-af', 'asetrate=44100*0.9,aresample=44100',  // Slow down audio to 90%
      '-q:a', '2',  // High quality MP3
      outputFileName
    ]);

    // Read the processed file
    const outputData = await ffmpeg.readFile(outputFileName);
    const blob = new Blob([outputData], { type: 'audio/mp3' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
}