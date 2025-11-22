/**
 * LangGraph Agent State and Types
 */

import { UploadedFile } from './api.types';

/**
 * Main state interface for LangGraph workflow
 */
export interface AgentState {
  // Input data
  userId: string;
  studyPlanId: string;
  materials: UploadedFile[];
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  
  // Research Agent outputs
  extractedText?: string;
  researchSummary?: string;
  simplifiedContent?: string;
  additionalResources?: string[];
  
  // Compiler Agent outputs
  pdfBuffer?: Buffer;
  driveFileId?: string;
  driveFileUrl?: string;
  
  // Scheduler Agent outputs
  calendarEvents?: CalendarEvent[];
  
  // Tutor Agent (stateful chat)
  chatHistory?: ChatMessage[];
  quizQuestions?: QuizQuestion[];
  userMessage?: string;
  assistantResponse?: string;
  
  // Workflow control
  currentStep?: string;
  errors?: string[];
  completed?: boolean;
}

/**
 * Calendar event structure
 */
export interface CalendarEvent {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  eventId?: string;
}

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Quiz question structure
 */
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

/**
 * Text chunk for processing large documents
 */
export interface TextChunk {
  content: string;
  chunkIndex: number;
  totalChunks: number;
  startPosition: number;
  endPosition: number;
}

/**
 * Chunking configuration
 */
export interface ChunkConfig {
  maxTokens: number;
  overlapTokens: number;
  estimatedCharsPerToken: number;
}

/**
 * Gemini API response structure
 */
export interface GeminiResponse {
  text: string;
  tokensUsed?: number;
}

/**
 * Google Drive upload result
 */
export interface DriveUploadResult {
  fileId: string;
  fileUrl: string;
  fileName: string;
}

/**
 * Agent node result type
 */
export type AgentNodeResult = Partial<AgentState>;
