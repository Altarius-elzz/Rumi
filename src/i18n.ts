import { Language, ReminderOffset } from './types';

type Dict = Record<string, string>;

const id: Dict = {
  appName: 'Todoku',
  home: 'Beranda',
  tasks: 'Tugas',
  settings: 'Pengaturan',
  myTasks: 'Tugas Saya',
  smartPlaceholder: 'Ketik tanggal, jam, atau agenda…',
  smartParseResult: 'Hasil Baca Pintar',
  untitledTask: 'Tugas tanpa judul',
  edit: 'Ubah',
  saveToCalendar: 'Simpan ke Kalender',
  newTask: 'Tugas Baru',
  taskTitle: 'Judul Tugas',
  taskTitlePlaceholder: 'mis. Masak nasi goreng',
  date: 'Tanggal',
  time: 'Jam',
  category: 'Kategori',
  reminder: 'Pengingat',
  addToCalendar: 'Tambah ke Kalender',
  addCategory: 'Tambah Kategori',
  categories: 'Kategori',
  preferences: 'Preferensi',
  language: 'Bahasa',
  notifications: 'Notifikasi',
  notificationsDesc: 'Pengingat & peringatan tugas',
  darkMode: 'Mode Gelap',
  darkActive: 'Tema gelap aktif',
  lightActive: 'Tema terang aktif',
  noTasksTitle: 'Belum ada tugas!',
  noTasksDesc: 'Harimu masih kosong. Tambahkan tugas pertamamu lewat input pintar atau tombol di bawah.',
  addFirstTask: 'Tambah Tugas Pertama',
  nothingScheduled: 'Tidak ada jadwal',
  dayAllYours: 'Hari ini milikmu sepenuhnya.',
  noTasksThisDay: 'Tidak ada tugas hari ini',
  done: 'selesai',
  deleteTask: 'Hapus tugas ini?',
  deleteCategory: 'Hapus kategori ini? Tugas di dalamnya dipindah ke Pribadi.',
  cancel: 'Batal',
  delete: 'Hapus',
  categoryName: 'Nama kategori',
  emoji: 'Ikon (emoji)',
  color: 'Warna',
  overdue: 'Terlewat',
  // categories
  cat_work: 'Kerja',
  cat_cooking: 'Masak',
  cat_health: 'Kesehatan',
  cat_social: 'Sosial',
  cat_personal: 'Pribadi',
  cat_travel: 'Jalan-jalan',
  // reminders
  rem_none: 'Tidak ada',
  rem_at_time: 'Tepat waktu',
  rem_5m: '5 menit sebelum',
  rem_15m: '15 menit sebelum',
  rem_30m: '30 menit sebelum',
  rem_1h: '1 jam sebelum',
  rem_3h: '3 jam sebelum',
  rem_1d: '1 hari sebelum (H-1)',
  rem_2d: '2 hari sebelum (H-2)',
  rem_3d: '3 hari sebelum (H-3)',
  rem_1w: '1 minggu sebelum',
  rem_short_none: '🔕 Tidak ada',
  notifDeadline: 'Pengingat tenggat',
  notifTime: 'Waktunya!',
};

const en: Dict = {
  appName: 'Todoku',
  home: 'Home',
  tasks: 'Tasks',
  settings: 'Settings',
  myTasks: 'My Tasks',
  smartPlaceholder: 'Type date, time, or agenda…',
  smartParseResult: 'Smart Parse Result',
  untitledTask: 'Untitled task',
  edit: 'Edit',
  saveToCalendar: 'Save to Calendar',
  newTask: 'New Task',
  taskTitle: 'Task Title',
  taskTitlePlaceholder: 'e.g. Cook fried rice',
  date: 'Date',
  time: 'Time',
  category: 'Category',
  reminder: 'Reminder',
  addToCalendar: 'Add to Calendar',
  addCategory: 'Add Category',
  categories: 'Categories',
  preferences: 'Preferences',
  language: 'Language',
  notifications: 'Notifications',
  notificationsDesc: 'Task reminders & alerts',
  darkMode: 'Dark Mode',
  darkActive: 'Dark theme active',
  lightActive: 'Light theme active',
  noTasksTitle: 'No tasks yet!',
  noTasksDesc: 'Your day is wide open. Add your first task using the smart input or the button below.',
  addFirstTask: 'Add First Task',
  nothingScheduled: 'Nothing scheduled',
  dayAllYours: 'This day is all yours.',
  noTasksThisDay: 'No tasks this day',
  done: 'done',
  deleteTask: 'Delete this task?',
  deleteCategory: 'Delete this category? Its tasks move to Personal.',
  cancel: 'Cancel',
  delete: 'Delete',
  categoryName: 'Category name',
  emoji: 'Icon (emoji)',
  color: 'Color',
  overdue: 'Overdue',
  cat_work: 'Work',
  cat_cooking: 'Cooking',
  cat_health: 'Health',
  cat_social: 'Social',
  cat_personal: 'Personal',
  cat_travel: 'Travel',
  rem_none: 'None',
  rem_at_time: 'At time',
  rem_5m: '5 min before',
  rem_15m: '15 min before',
  rem_30m: '30 min before',
  rem_1h: '1 hour before',
  rem_3h: '3 hours before',
  rem_1d: '1 day before',
  rem_2d: '2 days before',
  rem_3d: '3 days before',
  rem_1w: '1 week before',
  rem_short_none: '🔕 None',
  notifDeadline: 'Deadline reminder',
  notifTime: "It's time!",
};

const dictionaries: Record<Language, Dict> = { id, en };

export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
}

export function reminderLabel(lang: Language, offset: ReminderOffset): string {
  return t(lang, `rem_${offset}`);
}

/** Short chip label for reminder pills, e.g. "⏰ 1 day before" */
export function reminderChipLabel(lang: Language, offset: ReminderOffset): string {
  if (offset === 'none') return t(lang, 'rem_short_none');
  return `⏰ ${reminderLabel(lang, offset)}`;
}

/** Localized category label, falls back to stored custom label */
export function categoryLabel(lang: Language, id: string, fallback: string): string {
  const key = `cat_${id}`;
  const val = dictionaries[lang]?.[key];
  return val ?? fallback;
}

export const REMINDER_OPTIONS: ReminderOffset[] = [
  'none',
  'at_time',
  '5m',
  '15m',
  '30m',
  '1h',
  '3h',
  '1d',
  '2d',
  '3d',
  '1w',
];

export const MONTH_NAMES: Record<Language, string[]> = {
  id: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
};

export const DAY_SHORT: Record<Language, string[]> = {
  id: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
};

export const DAY_LONG: Record<Language, string[]> = {
  id: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
};
