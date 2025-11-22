import { pgTable, uuid, varchar, text, integer, timestamp, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Users table - stores user authentication and Google OAuth tokens
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  googleAccessToken: text('google_access_token'),
  googleRefreshToken: text('google_refresh_token'),
  googleTokenExpiry: bigint('google_token_expiry', { mode: 'number' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Study plans table - main entity for organizing study sessions
 */
export const studyPlans = pgTable('study_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  topic: varchar('topic', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(), // beginner, intermediate, advanced
  duration: integer('duration').notNull(), // in days
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, processing, completed, failed
  driveFolderId: varchar('drive_folder_id', { length: 255 }),
  driveFolderUrl: text('drive_folder_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Resources table - stores uploaded files and generated materials
 */
export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  studyPlanId: uuid('study_plan_id').references(() => studyPlans.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'original', 'simplified', 'pdf'
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: text('file_path'), // local path
  driveFileId: varchar('drive_file_id', { length: 255 }),
  driveFileUrl: text('drive_file_url'),
  fileSize: integer('file_size'), // in bytes
  mimeType: varchar('mime_type', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Chat messages table - stores conversation history with tutor agent
 */
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  studyPlanId: uuid('study_plan_id').references(() => studyPlans.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 50 }).notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Calendar events table - tracks Google Calendar study sessions
 */
export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  studyPlanId: uuid('study_plan_id').references(() => studyPlans.id, { onDelete: 'cascade' }).notNull(),
  eventId: varchar('event_id', { length: 255 }).notNull(), // Google Calendar event ID
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  studyPlans: many(studyPlans),
}));

export const studyPlansRelations = relations(studyPlans, ({ one, many }) => ({
  user: one(users, {
    fields: [studyPlans.userId],
    references: [users.id],
  }),
  resources: many(resources),
  chatMessages: many(chatMessages),
  calendarEvents: many(calendarEvents),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  studyPlan: one(studyPlans, {
    fields: [resources.studyPlanId],
    references: [studyPlans.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  studyPlan: one(studyPlans, {
    fields: [chatMessages.studyPlanId],
    references: [studyPlans.id],
  }),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
  studyPlan: one(studyPlans, {
    fields: [calendarEvents.studyPlanId],
    references: [studyPlans.id],
  }),
}));
