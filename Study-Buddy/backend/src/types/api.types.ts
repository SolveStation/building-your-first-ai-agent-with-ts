/**
 * API Request and Response Types
 */

// Auth types
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
}

// Study Plan types
export interface CreateStudyPlanRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in days
}

export interface StudyPlanResponse {
  id: string;
  userId: string;
  topic: string;
  difficulty: string;
  duration: number;
  status: string;
  driveFolderId?: string;
  driveFolderUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Agent types
export interface ResearchAgentRequest {
  studyPlanId: string;
}

export interface CompileAgentRequest {
  studyPlanId: string;
}

export interface ScheduleAgentRequest {
  studyPlanId: string;
}

export interface ChatRequest {
  studyPlanId: string;
  message: string;
  mode: 'chat' | 'quiz';
}

export interface ChatResponse {
  role: 'assistant';
  content: string;
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// Resource types
export interface ResourceResponse {
  id: string;
  studyPlanId: string;
  type: string;
  fileName: string;
  driveFileUrl?: string;
  fileSize?: number;
  createdAt: Date;
}

// File upload types
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Calendar event types
export interface CalendarEventResponse {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}

// Error response
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
