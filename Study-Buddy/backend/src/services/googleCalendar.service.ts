import { google } from 'googleapis';
import { logger } from '../utils/logger';
import { CalendarEvent } from '../types/agent.types';
import { createAuthenticatedClient } from '../config/google-oauth';

/**
 * Google Calendar Service
 * Handles calendar event creation and management
 */
class GoogleCalendarService {
  /**
   * Create a calendar event
   */
  async createEvent(
    event: CalendarEvent,
    oauth2Client: any
  ): Promise<{ eventId: string; eventUrl: string }> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const eventResource = {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: 'UTC',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 60 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventResource,
      });

      logger.info(`Created calendar event: ${event.title} (${response.data.id})`);

      return {
        eventId: response.data.id!,
        eventUrl: response.data.htmlLink!,
      };
    } catch (error: any) {
      logger.error('Error creating calendar event:', error);
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  /**
   * Create multiple calendar events
   */
  async createMultipleEvents(
    events: CalendarEvent[],
    oauth2Client: any
  ): Promise<Array<{ eventId: string; eventUrl: string; title: string }>> {
    const results = [];

    for (const event of events) {
      try {
        const result = await this.createEvent(event, oauth2Client);
        results.push({
          ...result,
          title: event.title,
        });
      } catch (error: any) {
        logger.error(`Failed to create event "${event.title}":`, error);
        // Continue with other events even if one fails
      }
    }

    return results;
  }

  /**
   * Update a calendar event
   */
  async updateEvent(
    eventId: string,
    updates: Partial<CalendarEvent>,
    oauth2Client: any
  ): Promise<void> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const eventResource: any = {};

      if (updates.title) eventResource.summary = updates.title;
      if (updates.description) eventResource.description = updates.description;
      if (updates.startTime) {
        eventResource.start = {
          dateTime: updates.startTime.toISOString(),
          timeZone: 'UTC',
        };
      }
      if (updates.endTime) {
        eventResource.end = {
          dateTime: updates.endTime.toISOString(),
          timeZone: 'UTC',
        };
      }

      await calendar.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody: eventResource,
      });

      logger.info(`Updated calendar event: ${eventId}`);
    } catch (error: any) {
      logger.error('Error updating calendar event:', error);
      throw new Error(`Failed to update calendar event: ${error.message}`);
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string, oauth2Client: any): Promise<void> {
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      await calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });

      logger.info(`Deleted calendar event: ${eventId}`);
    } catch (error: any) {
      logger.error('Error deleting calendar event:', error);
      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }

  /**
   * Create study session events based on schedule
   */
  async createStudySessions(
    schedule: Array<{
      title: string;
      description: string;
      durationMinutes: number;
      dayOffset: number;
      timeOfDay: 'morning' | 'afternoon' | 'evening';
    }>,
    oauth2Client: any
  ): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = [];

    for (const session of schedule) {
      const startTime = this.calculateSessionTime(session.dayOffset, session.timeOfDay);
      const endTime = new Date(startTime.getTime() + session.durationMinutes * 60 * 1000);

      const event: CalendarEvent = {
        title: session.title,
        description: session.description,
        startTime,
        endTime,
      };

      try {
        const result = await this.createEvent(event, oauth2Client);
        event.eventId = result.eventId;
        events.push(event);
      } catch (error: any) {
        logger.error(`Failed to create session "${session.title}":`, error);
      }
    }

    return events;
  }

  /**
   * Calculate session start time based on day offset and time of day
   */
  private calculateSessionTime(dayOffset: number, timeOfDay: string): Date {
    const now = new Date();
    const sessionDate = new Date(now);
    sessionDate.setDate(now.getDate() + dayOffset);

    // Set time based on timeOfDay
    switch (timeOfDay) {
      case 'morning':
        sessionDate.setHours(9, 0, 0, 0); // 9:00 AM
        break;
      case 'afternoon':
        sessionDate.setHours(14, 0, 0, 0); // 2:00 PM
        break;
      case 'evening':
        sessionDate.setHours(19, 0, 0, 0); // 7:00 PM
        break;
      default:
        sessionDate.setHours(10, 0, 0, 0); // Default 10:00 AM
    }

    return sessionDate;
  }

  /**
   * Get authenticated client for user
   */
  getAuthenticatedClient(accessToken: string, refreshToken: string, expiryDate: number) {
    return createAuthenticatedClient(accessToken, refreshToken, expiryDate);
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();
