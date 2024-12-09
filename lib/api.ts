import OpenAI from 'openai';
import { GenerateScriptParams } from '@/types/types';

// Ensure you have a valid OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeImage(imageFile: File): Promise<string> {
  try {
    // Convert File to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

    // Call OpenAI Vision API to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a creative comedy context extractor. Analyze images and provide comedic inspiration."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe the key elements of this image that could inspire comedy material. Focus on unique, unexpected, or humorous aspects."
            },
            {
              type: "image_url",
              image_url: { url: base64Image }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const imageContext = response.choices[0].message.content;
    
    if (!imageContext) {
      throw new Error('No image context generated');
    }

    return imageContext;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image');
  }
}

export async function generateScript({ formData, settings }: GenerateScriptParams): Promise<string> {
  try {
    // Validate input parameters
    if (!formData || !settings) {
      throw new Error('Invalid input parameters');
    }

    // Analyze image if provided
    let imageContext = '';
    if (formData.image) {
      try {
        imageContext = await analyzeImage(formData.image);
      } catch (imageAnalysisError) {
        console.warn('Image analysis failed', imageAnalysisError);
      }
    }

    // Combine text context with image context if available
    const combinedContext = [
      formData.context || '',
      imageContext ? `\n\nAdditional Image Context: ${imageContext}` : ''
    ].join('').trim();

    // Create a detailed prompt based on form data, settings, and combined context
    const prompt = createPrompt(
      { ...formData, context: combinedContext }, 
      settings
    );
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional comedy writer specializing in ${formData.comedyType} comedy. 
          Create a high-quality comedy script with a modern, conversational standup comedy style. 
          Use direct audience interaction, witty observations, and a personal, relatable tone.`
        },
        {
          role: "user",
          content: `Generate a comedy script that follows these specific formatting guidelines:
          - Use a conversational, direct standup comedy style
          - Write as if speaking directly to the audience
          - Include natural pauses and comedic timing through formatting
          - Avoid traditional screenplay formatting
          - Focus on raw, unfiltered comedic monologue

          ${prompt}`
        }
      ],
      temperature: settings.creativityLevel / 100,
      max_tokens: 3000,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    });

    const script = completion.choices[0].message.content;
    
    if (!script) {
      throw new Error('No script content generated');
    }

    return formatStandupScript(script);
  } catch (error) {
    console.error('Comprehensive script generation error:', error);
    
    if (error instanceof Error) {
      throw new Error(`Script Generation Failed: ${error.message}`);
    }
    
    throw new Error('Unexpected error during script generation');
  }
}

// New function to format standup comedy script
function formatStandupScript(rawScript: string): string {
  // Split the script into paragraphs
  const paragraphs = rawScript.split('\n\n').map(para => para.trim());
  
  // Format paragraphs with slight indentation and spacing
  const formattedParagraphs = paragraphs.map(para => {
    // Add slight left padding for a more organic look
    return `  ${para}`;
  });

  // Join paragraphs with double newlines for natural breaks
  return formattedParagraphs.join('\n\n');
}

function createPrompt(formData: GenerateScriptParams['formData'], settings: GenerateScriptParams['settings']): string {
  return `
COMEDY SCRIPT REQUIREMENTS:
- Style: Standup Comedy Monologue
- Type: ${formData.comedyType} Comedy
- Duration: ${formData.duration} minutes
- Target Audience: ${formData.targetAudience}
- Tone: ${settings.tone}
- Voice: ${settings.voice}

ADDITIONAL CONTEXT:
${formData.context || 'No specific context provided'}

SPECIFIC INSTRUCTIONS:
1. Write a conversational, direct comedy monologue
2. Use personal, relatable humor
3. Include direct audience interaction
4. Maintain ${settings.tone} tone
5. Tailor content to ${formData.targetAudience} audience

PERFORMANCE NOTES:
- Use natural, conversational language
- Include subtle pauses and comedic timing
- Focus on witty observations and personal anecdotes
`.trim();
}