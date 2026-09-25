// Core data types for Todoku

export type ReminderOffset =
  | 'none'
  | 'at_time'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '3h'
  | '1d'
  | '2d'
  | '3d'
  | '1w';

export interface Category {
  id: string;
  /** i18n key OR literal label; we store a label per language via i18n */
  label: string;
  /** Emoji shown next to the category */
  emoji: string;
  /** Hex color used for chips, dots and accents */
  color: string;
  /** Built-in categories cannot be deleted, only custom ones can */
  isDefault?: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  /** category id */
  category: string;
  /** ISO date string, e.g. 2026-09-25 */
  date: string;
  /** Time in HH:mm (24h) */
  time: string;
  /** Reminder offsets scheduled before the task datetime */
  reminders: ReminderOffset[];
  done: boolean;
  createdAt: number;
  /** Notification ids scheduled for this task (for cancellation) */
  notificationIds?: string[];
}

export type Language = 'id' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  notificationsEnabled: boolean;
}

/** Result of the smart parser (before it becomes a full Task) */
export interface ParsedInput {
  title: string;
  date: string; // may be '' if not detected
  time: string; // may be '' if not detected
  category: string;
}
