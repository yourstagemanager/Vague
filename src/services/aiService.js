/**
 * AI Service Layer
 * Supports both Google Gemini API and local Ollama
 */

// AI Provider configuration
const AI_CONFIG = {
  // Provider: 'gemini' or 'ollama' or 'none'
  // FULLY HARDCODED FOR TESTING - browser caching issue
  provider: 'gemini',

  // Gemini settings
  geminiApiKey: 'AIzaSyCnmRrlN3RZqYn_lDKncFOobnLPB4aErdM',
  geminiModel: 'gemini-2.0-flash-exp', // or 'gemini-1.5-flash'

  // Ollama settings
  ollamaUrl: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
  ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2:3b', // or 'mistral', 'phi3'

  // Fallback to canned responses if AI fails
  useFallback: true,

  // Temperature (creativity) - 0.0 to 1.0
  temperature: 0.9,

  // Max tokens (response length)
  maxTokens: 200
};

// Debug logging - remove in production
console.log('🤖 AI Service Configuration:', {
  provider: AI_CONFIG.provider,
  hasGeminiKey: !!AI_CONFIG.geminiApiKey,
  geminiKeyLength: AI_CONFIG.geminiApiKey?.length || 0,
  geminiModel: AI_CONFIG.geminiModel,
  ollamaUrl: AI_CONFIG.ollamaUrl,
  ollamaModel: AI_CONFIG.ollamaModel
});

/**
 * Call Google Gemini API
 */
async function callGemini(systemPrompt, userMessage) {
  if (!AI_CONFIG.geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.geminiModel}:generateContent?key=${AI_CONFIG.geminiApiKey}`;

  const requestBody = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
      }]
    }],
    generationConfig: {
      temperature: AI_CONFIG.temperature,
      maxOutputTokens: AI_CONFIG.maxTokens,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini');
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

/**
 * Call local Ollama
 */
async function callOllama(systemPrompt, userMessage) {
  const url = `${AI_CONFIG.ollamaUrl}/api/generate`;

  const requestBody = {
    model: AI_CONFIG.ollamaModel,
    prompt: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`,
    stream: false,
    options: {
      temperature: AI_CONFIG.temperature,
      num_predict: AI_CONFIG.maxTokens
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error('Invalid response format from Ollama');
    }

    return data.response.trim();
  } catch (error) {
    console.error('Ollama API call failed:', error);
    throw error;
  }
}

/**
 * Main AI call function - routes to appropriate provider
 */
export async function getAIResponse(systemPrompt, userMessage) {
  console.log('🤖 getAIResponse called:', {
    provider: AI_CONFIG.provider,
    userMessageLength: userMessage?.length,
    systemPromptLength: systemPrompt?.length
  });

  try {
    switch (AI_CONFIG.provider) {
      case 'gemini':
        console.log('🤖 Calling Gemini API...');
        const geminiResponse = await callGemini(systemPrompt, userMessage);
        console.log('🤖 Gemini response received:', geminiResponse?.substring(0, 100) + '...');
        return geminiResponse;

      case 'ollama':
        console.log('🤖 Calling Ollama API...');
        const ollamaResponse = await callOllama(systemPrompt, userMessage);
        console.log('🤖 Ollama response received:', ollamaResponse?.substring(0, 100) + '...');
        return ollamaResponse;

      case 'none':
      default:
        console.log('🤖 AI provider is "none", returning null (will use canned responses)');
        return null; // Use canned responses
    }
  } catch (error) {
    console.error('🤖 AI call failed:', error);

    if (AI_CONFIG.useFallback) {
      console.log('🤖 Falling back to canned responses');
      return null;
    } else {
      throw error;
    }
  }
}

/**
 * Check if AI is configured and available
 */
export function isAIAvailable() {
  if (AI_CONFIG.provider === 'gemini') {
    return !!AI_CONFIG.geminiApiKey;
  } else if (AI_CONFIG.provider === 'ollama') {
    return true; // Assume available, will fail gracefully
  }
  return false;
}

/**
 * Get current AI provider info
 */
export function getAIProviderInfo() {
  return {
    provider: AI_CONFIG.provider,
    model: AI_CONFIG.provider === 'gemini' ? AI_CONFIG.geminiModel : AI_CONFIG.ollamaModel,
    available: isAIAvailable()
  };
}
