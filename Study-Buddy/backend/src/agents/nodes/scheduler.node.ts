import { AgentState } from '../state';
import { geminiService } from '../../services/gemini.service';
import { googleCalendarService } from '../../services/googleCalendar.service';
import { db, users } from '../../db';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger';

/**
 * Scheduler Agent Node
 * Generates study schedule and creates Google Calendar events
 */
export async function schedulerAgentNode(state: AgentState): Promise<Partial<AgentState>> {
  logger.info(`[Scheduler Agent] Starting for study plan: ${state.studyPlanId}`);

  try {
    // Step 1: Generate optimal study schedule using Gemini
    logger.debug('[Scheduler Agent] Generating study schedule');
    const schedule = await geminiService.generateStudySchedule(
      state.topic,
      state.duration,
      state.difficulty
    );

    logger.info(`[Scheduler Agent] Generated ${schedule.length} study sessions`);

    // Step 2: Get user's Google OAuth credentials
    logger.debug('[Scheduler Agent] Fetching user OAuth credentials');
    const user = await db.query.users.findFirst({
      where: eq(users.id, state.userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.googleAccessToken || !user.googleRefreshToken || !user.googleTokenExpiry) {
      throw new Error('User has not connected Google account');
    }

    // Step 3: Create authenticated Google client
    const oauth2Client = googleCalendarService.getAuthenticatedClient(
      user.googleAccessToken,
      user.googleRefreshToken,
      user.googleTokenExpiry
    );

    // Step 4: Enhance schedule with Drive folder link
    const enhancedSchedule = schedule.map((session: any) => ({
      ...session,
      description: `${session.description}\n\n📚 Study Materials: ${state.driveFolderUrl || 'Processing...'}`,
    }));

    // Step 5: Create calendar events
    logger.debug('[Scheduler Agent] Creating calendar events');
    const calendarEvents = await googleCalendarService.createStudySessions(
      enhancedSchedule,
      oauth2Client
    );

    logger.info(`[Scheduler Agent] Created ${calendarEvents.length} calendar events`);

    return {
      calendarEvents,
      currentStep: 'scheduler_complete',
    };
  } catch (error: any) {
    logger.error('[Scheduler Agent] Error:', error);

    return {
      currentStep: 'scheduler_failed',
      errors: [...(state.errors || []), `Scheduler Agent failed: ${error.message}`],
    };
  }
}
