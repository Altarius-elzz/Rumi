import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Category, Task } from './types';

const KEYS = {
  tasks: '@todoku/tasks',
  categories: '@todoku/categories',
  settings: '@todoku/settings',
};

// Default categories from the Figma design. Users can add/remove custom ones.
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', label: 'Work', emoji: '💼', color: '#6C5CE7', isDefault: true },
  { id: 'cooking', label: 'Cooking', emoji: '🍳', color: '#E17055', isDefault: true },
  { id: 'health', label: 'Health', emoji: '💪', color: '#00B894', isDefault: true },
  { id: 'social', label: 'Social', emoji: '👥', color: '#0984E3', isDefault: true },
  { id: 'personal', label: 'Personal', emoji: '⭐', color: '#E84393', isDefault: true },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: '#00CEC9', isDefault: true },
];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'id',
  theme: 'light',
  notificationsEnabled: true,
};

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('storage read failed', key, e);
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('storage write failed', key, e);
  }
}

export const loadTasks = () => readJSON<Task[]>(KEYS.tasks, []);
export const saveTasks = (tasks: Task[]) => writeJSON(KEYS.tasks, tasks);

export async function loadCategories(): Promise<Category[]> {
  const stored = await readJSON<Category[] | null>(KEYS.categories, null);
  if (!stored || stored.length === 0) {
    await writeJSON(KEYS.categories, DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  return stored;
}
export const saveCategories = (categories: Category[]) =>
  writeJSON(KEYS.categories, categories);

export const loadSettings = () => readJSON<AppSettings>(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (settings: AppSettings) => writeJSON(KEYS.settings, settings);
