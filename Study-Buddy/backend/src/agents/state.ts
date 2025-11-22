import { Annotation } from '@langchain/langgraph';
import { UploadedFile } from '../types/api.types';
import { CalendarEvent, ChatMessage, QuizQuestion } from '../types/agent.types';

/**
 * LangGraph Agent State Definition
 * This defines the shared state that flows through the agent workflow
 */

export const AgentStateAnnotation = Annotation.Root({
  // Input data
  userId: Annotation<string>,
  studyPlanId: Annotation<string>,
  materials: Annotation<UploadedFile[]>,
  topic: Annotation<string>,
  difficulty: Annotation<'beginner' | 'intermediate' | 'advanced'>,
  duration: Annotation<number>,
  
  // Research Agent outputs
  extractedText: Annotation<string | undefined>,
  researchSummary: Annotation<string | undefined>,
  simplifiedContent: Annotation<string | undefined>,
  additionalResources: Annotation<string[] | undefined>,
  
  // Compiler Agent outputs
  pdfBuffer: Annotation<Buffer | undefined>,
  driveFileId: Annotation<string | undefined>,
  driveFileUrl: Annotation<string | undefined>,
  driveFolderId: Annotation<string | undefined>,
  driveFolderUrl: Annotation<string | undefined>,
  
  // Scheduler Agent outputs
  calendarEvents: Annotation<CalendarEvent[] | undefined>,
  
  // Tutor Agent (stateful chat)
  chatHistory: Annotation<ChatMessage[] | undefined>,
  quizQuestions: Annotation<QuizQuestion[] | undefined>,
  userMessage: Annotation<string | undefined>,
  assistantResponse: Annotation<string | undefined>,
  
  // Workflow control
  currentStep: Annotation<string | undefined>,
  errors: Annotation<string[] | undefined>,
  completed: Annotation<boolean | undefined>,
});

export type AgentState = typeof AgentStateAnnotation.State;
