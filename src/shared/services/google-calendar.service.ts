import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar;

  constructor() {
    // Initialize Google Calendar API
    // TODO: Load credentials from environment variables or config
    this.initializeCalendar();
  }

  private async initializeCalendar() {
    try {
      // TODO: Replace with actual service account credentials
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });
      console.log("Google Service Account Key Path:", process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE);
      this.calendar = google.calendar({ version: 'v3', auth });
    } catch (error) {
      this.logger.error('Failed to initialize Google Calendar API', error);
    }
  }

  async createMeeting(slot: any, attendeeEmail: string, attendeeName: string): Promise<string> {
    try {
      if (!this.calendar) {
        this.logger.warn('Google Calendar not initialized, returning placeholder link');
        return `https://meet.google.com/placeholder-${slot.id}`;
      }

      const startDateTime = new Date(`${slot.date}T${slot.startTime}:00`);
      const endDateTime = new Date(`${slot.date}T${slot.endTime}:00`);

      const event = {
        summary: `Meeting with ${attendeeName}`,
        description: `Scheduled meeting with ${attendeeName}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: [
          { email: attendeeEmail, name: attendeeName },
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${slot.id}-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary', // or your specific calendar ID
        resource: event,
        conferenceDataVersion: 1,
      });

      const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
      
      if (meetLink) {
        this.logger.log(`Created Google Meet link: ${meetLink}`);
        return meetLink;
      } else {
        this.logger.warn('No Meet link generated, returning placeholder');
        return `https://meet.google.com/placeholder-${slot.id}`;
      }
    } catch (error) {
      this.logger.error('Failed to create Google Meet link', error);
      return `https://meet.google.com/placeholder-${slot.id}`;
    }
  }

  async deleteMeeting(eventId: string): Promise<void> {
    try {
      if (!this.calendar) {
        this.logger.warn('Google Calendar not initialized, skipping deletion');
        return;
      }

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      this.logger.log(`Deleted Google Calendar event: ${eventId}`);
    } catch (error) {
      this.logger.error('Failed to delete Google Calendar event', error);
    }
  }
} 