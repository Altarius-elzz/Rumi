import { DAY_LONG, DAY_SHORT, MONTH_NAMES } from '../i18n';
import { Language } from '../types';

/** Returns YYYY-MM-DD in local time for a Date */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function toDateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Combine an ISO date (YYYY-MM-DD) and time (HH:mm) into a Date */
export function combineDateTime(dateISO: string, time?: string): Date {
  const [y, m, d] = dateISO.split('-').map(Number);
  if (time) {
    const [hh, mm] = time.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm, 0, 0);
  }
  return new Date(y, m - 1, d, 9, 0, 0, 0);
}

export function formatTimeFromDate(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** e.g. "Friday, November 27, 2026" / "Jumat, 27 November 2026" */
export function formatLongDate(dateISO: string, lang: Language): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = DAY_LONG[lang][date.getDay()];
  const monthName = MONTH_NAMES[lang][date.getMonth()];
  return lang === 'id'
    ? `${dayName}, ${d} ${monthName} ${y}`
    : `${dayName}, ${monthName} ${d}, ${y}`;
}

/** e.g. "Fri, Nov 27" / "Jum, 27 Nov" */
export function formatShortDate(dateISO: string, lang: Language): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = DAY_SHORT[lang][date.getDay()];
  const monthName = MONTH_NAMES[lang][date.getMonth()].slice(0, 3);
  return lang === 'id' ? `${dayName}, ${d} ${monthName}` : `${dayName}, ${monthName} ${d}`;
}

/** e.g. "Nov 27" / "27 Nov" — used in chips */
export function formatChipDate(dateISO: string, lang: Language): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const monthName = MONTH_NAMES[lang][m - 1].slice(0, 3);
  return lang === 'id' ? `${d} ${monthName}` : `${monthName} ${d}`;
}

export function isPast(dateISO: string, time?: string): boolean {
  return combineDateTime(dateISO, time).getTime() < Date.now();
}
