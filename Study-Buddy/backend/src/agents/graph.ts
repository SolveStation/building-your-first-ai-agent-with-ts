import { StateGraph } from '@langchain/langgraph';
import { AgentStateAnnotation, AgentState } from './state';
import { researchAgentNode } from './nodes/research.node';
import { compilerAgentNode } from './nodes/compiler.node';
import { schedulerAgentNode } from './nodes/scheduler.node';
import { tutorAgentNode, quizGeneratorNode } from './nodes/tutor.node';
import { logger } from '../utils/logger';

/**
 * LangGraph Workflow Definition
 * Orchestrates the flow between different agent nodes
 */

/**
 * Study Plan Creation Workflow
 * Flow: Research → Compiler → Scheduler → End
 */
export function createStudyPlanWorkflow() {
  const workflow = new StateGraph(AgentStateAnnotation)
    // Add nodes
    .addNode('research', researchAgentNode)
    .addNode('compiler', compilerAgentNode)
    .addNode('scheduler', schedulerAgentNode)
    
    // Define edges
    .addEdge('__start__', 'research')
    .addEdge('research', 'compiler')
    .addEdge('compiler', 'scheduler')
    .addEdge('scheduler', '__end__');

  return workflow.compile();
}

/**
 * Chat Workflow
 * Simple single-node workflow for tutor interactions
 */
export function createChatWorkflow() {
  const workflow = new StateGraph(AgentStateAnnotation)
    .addNode('tutor', tutorAgentNode)
    .addEdge('__start__', 'tutor')
    .addEdge('tutor', '__end__');

  return workflow.compile();
}

/**
 * Quiz Generation Workflow
 */
export function createQuizWorkflow() {
  const workflow = new StateGraph(AgentStateAnnotation)
    .addNode('quiz', quizGeneratorNode)
    .addEdge('__start__', 'quiz')
    .addEdge('quiz', '__end__');

  return workflow.compile();
}

/**
 * Execute study plan creation workflow
 */
export async function executeStudyPlanWorkflow(initialState: Partial<AgentState>): Promise<AgentState> {
  logger.info('Executing study plan workflow');

  try {
    const workflow = createStudyPlanWorkflow();
    const result = await workflow.invoke(initialState as AgentState);

    logger.info('Study plan workflow completed');
    return result;
  } catch (error: any) {
    logger.error('Study plan workflow failed:', error);
    throw error;
  }
}

/**
 * Execute chat workflow
 */
export async function executeChatWorkflow(initialState: Partial<AgentState>): Promise<AgentState> {
  logger.info('Executing chat workflow');

  try {
    const workflow = createChatWorkflow();
    const result = await workflow.invoke(initialState as AgentState);

    logger.info('Chat workflow completed');
    return result;
  } catch (error: any) {
    logger.error('Chat workflow failed:', error);
    throw error;
  }
}

/**
 * Execute quiz generation workflow
 */
export async function executeQuizWorkflow(initialState: Partial<AgentState>): Promise<AgentState> {
  logger.info('Executing quiz workflow');

  try {
    const workflow = createQuizWorkflow();
    const result = await workflow.invoke(initialState as AgentState);

    logger.info('Quiz workflow completed');
    return result;
  } catch (error: any) {
    logger.error('Quiz workflow failed:', error);
    throw error;
  }
}
