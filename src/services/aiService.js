/**
 * AI Service Layer
 * Using official @google/generative-ai SDK
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// AI Provider configuration
const AI_CONFIG = {
  // Provider: 'gemini' or 'ollama' or 'none'
  provider: 'gemini',

  // Gemini settings - TEMPORARY hardcoded, will add proper env support
  geminiApiKey: 'AIzaSyCnmRrlN3RZqYn_lDKncFOobnLPB4aErdM',
  geminiModel: 'gemini-2.0-flash-exp',

  // Ollama settings (for future use)
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3.2:3b',

  // Fallback to canned responses if AI fails
  useFallback: true,

  // Generation parameters
  temperature: 0.9,
  maxTokens: 200
};

// Initialize Google Generative AI
let genAI = null;
let model = null;

if (AI_CONFIG.provider === 'gemini' && AI_CONFIG.geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(AI_CONFIG.geminiApiKey);
    model = genAI.getGenerativeModel({
      model: AI_CONFIG.geminiModel,
      generationConfig: {
        temperature: AI_CONFIG.temperature,
        maxOutputTokens: AI_CONFIG.maxTokens,
      }
    });
    console.log('✅ Google Generative AI initialized successfully!');
    console.log('🤖 Model:', AI_CONFIG.geminiModel);
    console.log('🤖 API Key:', AI_CONFIG.geminiApiKey.substring(0, 10) + '...');
  } catch (error) {
    console.error('❌ Failed to initialize Google Generative AI:', error);
  }
} else {
  console.warn('⚠️ Gemini not configured - AI provider:', AI_CONFIG.provider);
}

/**
 * Call Google Gemini API using official SDK
 */
async function callGemini(systemPrompt, userMessage) {
  if (!model) {
    throw new Error('Gemini model not initialized');
  }

  try {
    // Combine system prompt and user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

    console.log('🤖 Calling Gemini with prompt length:', fullPrompt.length);

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini response received:', text.substring(0, 100) + '...');

    return text.trim();
  } catch (error) {
    console.error('❌ Gemini API call failed:', error);
    throw error;
  }
}

/**
 * Call local Ollama (unchanged)
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
    modelInitialized: !!model,
    userMessageLength: userMessage?.length,
    systemPromptLength: systemPrompt?.length
  });

  try {
    switch (AI_CONFIG.provider) {
      case 'gemini':
        console.log('🤖 Using Gemini API...');
        const geminiResponse = await callGemini(systemPrompt, userMessage);
        return geminiResponse;

      case 'ollama':
        console.log('🤖 Using Ollama API...');
        const ollamaResponse = await callOllama(systemPrompt, userMessage);
        return ollamaResponse;

      case 'none':
      default:
        console.log('🤖 AI provider is "none", returning null (will use canned responses)');
        return null;
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
    return !!model;
  } else if (AI_CONFIG.provider === 'ollama') {
    return true;
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
    available: isAIAvailable(),
    initialized: !!model
  };
}
