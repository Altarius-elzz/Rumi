import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppSettings, Category, Language, Task, ThemeMode } from './types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
  loadCategories,
  loadSettings,
  loadTasks,
  saveCategories,
  saveSettings,
  saveTasks,
} from './storage';
import {
  cancelTaskReminders,
  registerForNotifications,
  scheduleTaskReminders,
} from './notifications';
import { categoryLabel, t } from './i18n';
import { getColors, ThemeColors } from './theme';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

type NewTaskInput = Omit<Task, 'id' | 'createdAt' | 'done' | 'notificationIds'>;

interface StoreValue {
  ready: boolean;
  tasks: Task[];
  categories: Category[];
  settings: AppSettings;
  colors: ThemeColors;
  isDark: boolean;
  // task actions
  addTask: (input: NewTaskInput) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  // category actions
  addCategory: (input: Omit<Category, 'id' | 'isDefault'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // settings
  setLanguage: (lang: Language) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  // helpers
  tr: (key: string) => string;
  getCategory: (id: string) => Category;
  catLabel: (id: string) => string;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    (async () => {
      const [t0, c0, s0] = await Promise.all([
        loadTasks(),
        loadCategories(),
        loadSettings(),
      ]);
      setTasks(t0);
      setCategories(c0);
      setSettings(s0);
      setReady(true);
      if (s0.notificationsEnabled) {
        registerForNotifications().catch(() => undefined);
      }
    })();
  }, []);

  useEffect(() => {
    if (ready) saveTasks(tasks);
  }, [tasks, ready]);
  useEffect(() => {
    if (ready) saveCategories(categories);
  }, [categories, ready]);
  useEffect(() => {
    if (ready) saveSettings(settings);
  }, [settings, ready]);

  const addTask = useCallback<StoreValue['addTask']>(
    async (input) => {
      const task: Task = {
        ...input,
        id: uid(),
        done: false,
        createdAt: Date.now(),
        notificationIds: [],
      };
      if (settings.notificationsEnabled) {
        task.notificationIds = await scheduleTaskReminders(task, settings.language);
      }
      setTasks((prev) => [task, ...prev]);
    },
    [settings.notificationsEnabled, settings.language],
  );

  const updateTask = useCallback<StoreValue['updateTask']>(
    async (id, patch) => {
      setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, ...patch } : tk)));
      const existing = tasks.find((tk) => tk.id === id);
      if (!existing) return;
      const next = { ...existing, ...patch };
      const timingChanged =
        patch.date !== undefined ||
        patch.time !== undefined ||
        patch.reminders !== undefined ||
        patch.title !== undefined;
      if (timingChanged) {
        await cancelTaskReminders(existing.notificationIds);
        let ids: string[] = [];
        if (settings.notificationsEnabled && !next.done) {
          ids = await scheduleTaskReminders(next, settings.language);
        }
        setTasks((prev) =>
          prev.map((tk) => (tk.id === id ? { ...tk, notificationIds: ids } : tk)),
        );
      }
    },
    [tasks, settings.notificationsEnabled, settings.language],
  );

  const deleteTask = useCallback<StoreValue['deleteTask']>(
    async (id) => {
      const existing = tasks.find((tk) => tk.id === id);
      await cancelTaskReminders(existing?.notificationIds);
      setTasks((prev) => prev.filter((tk) => tk.id !== id));
    },
    [tasks],
  );

  const toggleTask = useCallback<StoreValue['toggleTask']>(
    async (id) => {
      const existing = tasks.find((tk) => tk.id === id);
      if (!existing) return;
      const done = !existing.done;
      if (done) {
        await cancelTaskReminders(existing.notificationIds);
        setTasks((prev) =>
          prev.map((tk) => (tk.id === id ? { ...tk, done, notificationIds: [] } : tk)),
        );
      } else {
        let ids: string[] = [];
        if (settings.notificationsEnabled) {
          ids = await scheduleTaskReminders({ ...existing, done }, settings.language);
        }
        setTasks((prev) =>
          prev.map((tk) => (tk.id === id ? { ...tk, done, notificationIds: ids } : tk)),
        );
      }
    },
    [tasks, settings.notificationsEnabled, settings.language],
  );

  const addCategory = useCallback<StoreValue['addCategory']>(async (input) => {
    const cat: Category = { ...input, id: uid() };
    setCategories((prev) => [...prev, cat]);
  }, []);

  const deleteCategory = useCallback<StoreValue['deleteCategory']>(async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id || c.isDefault));
    setTasks((prev) =>
      prev.map((tk) => (tk.category === id ? { ...tk, category: 'personal' } : tk)),
    );
  }, []);

  const setLanguage = useCallback<StoreValue['setLanguage']>(async (language) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  const setTheme = useCallback<StoreValue['setTheme']>(async (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback<StoreValue['toggleTheme']>(async () => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const setNotificationsEnabled = useCallback<StoreValue['setNotificationsEnabled']>(
    async (enabled) => {
      if (enabled) await registerForNotifications();
      setSettings((prev) => ({ ...prev, notificationsEnabled: enabled }));
    },
    [],
  );

  const tr = useCallback((key: string) => t(settings.language, key), [settings.language]);

  const getCategory = useCallback(
    (id: string) =>
      categories.find((c) => c.id === id) ?? categories[0] ?? DEFAULT_CATEGORIES[0],
    [categories],
  );

  const catLabel = useCallback(
    (id: string) => {
      const c = categories.find((x) => x.id === id);
      return categoryLabel(settings.language, id, c?.label ?? id);
    },
    [categories, settings.language],
  );

  const isDark = settings.theme === 'dark';
  const colors = useMemo(() => getColors(settings.theme), [settings.theme]);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      tasks,
      categories,
      settings,
      colors,
      isDark,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      addCategory,
      deleteCategory,
      setLanguage,
      setTheme,
      toggleTheme,
      setNotificationsEnabled,
      tr,
      getCategory,
      catLabel,
    }),
    [
      ready, tasks, categories, settings, colors, isDark,
      addTask, updateTask, deleteTask, toggleTask,
      addCategory, deleteCategory, setLanguage, setTheme, toggleTheme,
      setNotificationsEnabled, tr, getCategory, catLabel,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
