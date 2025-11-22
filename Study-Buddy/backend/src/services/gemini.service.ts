import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { logger } from '../utils/logger';

/**
 * Gemini AI Service
 * Handles all interactions with Google's Gemini API
 */
class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest',
    });

    logger.info('Gemini service initialized');
  }

  /**
   * Generate content from a prompt with retry logic
   */
  async generateContent(prompt: string, retries = 3): Promise<string> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.debug(`Generating content with Gemini (attempt ${attempt}/${retries})`);
        
        const result = await this.model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        logger.debug(`Generated ${text.length} characters`);
        
        return text;
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a retryable error (503, 429, network issues)
        const isRetryable = error.message?.includes('503') || 
                           error.message?.includes('429') || 
                           error.message?.includes('overloaded') ||
                           error.message?.includes('fetch failed');
        
        if (!isRetryable || attempt === retries) {
          logger.error(`Gemini API error (attempt ${attempt}/${retries}):`, error.message);
          throw new Error(`Gemini API error: ${error.message}`);
        }
        
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn(`Gemini API overloaded, retrying in ${delay/1000}s... (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`Gemini API error after ${retries} attempts: ${lastError.message}`);
  }

  /**
   * Generate content with streaming (for real-time responses)
   */
  async *generateContentStream(prompt: string): AsyncGenerator<string> {
    try {
      logger.debug('Starting streaming generation with Gemini');
      
      const result = await this.model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        yield text;
      }
    } catch (error: any) {
      logger.error('Error in streaming generation:', error);
      throw new Error(`Gemini streaming error: ${error.message}`);
    }
  }

  /**
   * Research Agent: Simplify and summarize study materials
   */
  async simplifyContent(
    content: string,
    topic: string,
    difficulty: string,
    chunkInfo?: { index: number; total: number }
  ): Promise<string> {
    const chunkContext = chunkInfo
      ? `\n\nNote: This is part ${chunkInfo.index + 1} of ${chunkInfo.total} of the content. ${
          chunkInfo.index > 0 ? 'Previous parts have been processed. Maintain consistency.' : ''
        } ${chunkInfo.index < chunkInfo.total - 1 ? 'More content follows in subsequent parts.' : 'This is the final part.'}`
      : '';

    const prompt = `You are an expert educational content simplifier and study guide creator.

Task: Analyze the following course material and create a comprehensive, easy-to-understand study guide.

Topic: ${topic}
Difficulty Level: ${difficulty}
${chunkContext}

Original Content:
${content}

Instructions:
1. Summarize key concepts in clear, simple language appropriate for ${difficulty} level students
2. Break down complex topics into digestible sections with clear explanations
3. Add practical examples and analogies to illustrate difficult concepts
4. Highlight important terms and definitions
5. Include any formulas, code snippets, or technical details (preserve formatting)
6. Format output in clean markdown with proper headers, bullet points, and emphasis

Output Format:
# ${topic} - Study Guide

## Overview
[Brief introduction to the topic]

## Key Concepts
[Main ideas broken down into subsections]

## Important Terms
[Definitions of crucial terminology]

## Examples and Applications
[Practical examples to reinforce understanding]

## Summary
[Quick recap of main points]

Generate the study guide now:`;

    return await this.generateContent(prompt);
  }

  /**
   * Scheduler Agent: Generate optimal study schedule
   */
  async generateStudySchedule(
    topic: string,
    duration: number,
    difficulty: string
  ): Promise<any> {
    const prompt = `You are an expert study planner and educational consultant.

Task: Create an optimal study schedule for the following:

Topic: ${topic}
Duration: ${duration} days
Difficulty Level: ${difficulty}
Current Date: ${new Date().toISOString().split('T')[0]}

Instructions:
1. Suggest an appropriate number of study sessions (typically 3-5 per week)
2. Each session should be 45-90 minutes (adjust based on difficulty)
3. Include breaks and review sessions
4. Space sessions optimally using spaced repetition principles
5. Consider best times of day for learning (suggest morning or evening)

Return ONLY a valid JSON array of session objects with this exact structure:
[
  {
    "title": "Study Session: [Topic] - [Session Name]",
    "description": "Focus areas: [what to cover]",
    "durationMinutes": 60,
    "dayOffset": 0,
    "timeOfDay": "morning"
  }
]

Important: 
- dayOffset is days from today (0 = today, 1 = tomorrow, etc.)
- timeOfDay must be "morning", "afternoon", or "evening"
- Include 3-5 sessions spread across the ${duration} days
- Return ONLY the JSON array, no additional text

Generate the schedule now:`;

    const response = await this.generateContent(prompt);
    
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Error parsing schedule JSON:', error);
      throw new Error('Failed to generate valid study schedule');
    }
  }

  /**
   * Tutor Agent: Answer student questions
   */
  async tutorChat(
    userMessage: string,
    studyMaterialContext: string,
    chatHistory: Array<{ role: string; content: string }> = []
  ): Promise<string> {
    const historyText = chatHistory
      .slice(-10) // Last 10 messages for context
      .map((msg) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are StudyBuddy, a friendly, knowledgeable, and encouraging AI tutor.

Study Material Context:
${studyMaterialContext.substring(0, 3000)} ${studyMaterialContext.length > 3000 ? '...' : ''}

Previous Conversation:
${historyText || 'No previous conversation'}

Student Question: ${userMessage}

Instructions:
- Answer clearly and concisely using the study material context when relevant
- Use examples and analogies to explain complex concepts
- Encourage critical thinking by asking follow-up questions when appropriate
- Be supportive and motivating
- If you don't know something, admit it honestly
- Keep responses focused and not too long (2-3 paragraphs max unless more detail is needed)

Respond naturally as a helpful tutor:`;

    return await this.generateContent(prompt);
  }

  /**
   * Tutor Agent: Generate quiz questions
   */
  async generateQuiz(studyMaterialContext: string, numberOfQuestions: number = 5): Promise<any> {
    const prompt = `You are an expert quiz creator for educational content.

Study Material:
${studyMaterialContext.substring(0, 4000)}

Task: Create ${numberOfQuestions} multiple-choice questions to test understanding of this material.

Requirements:
- Questions should test comprehension, not just memorization
- Include a mix of difficulty levels
- Each question should have 4 options
- Provide clear explanations for correct answers

Return ONLY a valid JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct"
  }
]

Important:
- correctAnswer is the index (0-3) of the correct option
- Return ONLY the JSON array, no additional text

Generate the quiz now:`;

    const response = await this.generateContent(prompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Error parsing quiz JSON:', error);
      throw new Error('Failed to generate valid quiz');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
