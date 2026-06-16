const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check for API key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables. Gemini features will return mock responses.');
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Sends a prompt to Gemini and parses the JSON response.
 * If API Key is missing or request fails, falls back to realistic mock responses based on prompt type.
 */
const generateJSONResponse = async (prompt, systemInstruction = '', fallbackData = {}) => {
  const genAI = getGeminiClient();
  
  if (!genAI) {
    console.log('Gemini client not initialized, returning fallback data');
    return fallbackData;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const fullPrompt = `${systemInstruction}\n\nUser Request: ${prompt}\n\nPlease output the result strictly as a valid JSON object.`;
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    
    // Clean markdown code blocks if any exist
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini API call failed, using fallback data. Error:', error.message);
    return fallbackData;
  }
};

module.exports = {
  generateJSONResponse
};
