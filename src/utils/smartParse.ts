import { ParsedInput } from '../types';
import { toDateKey } from './date';

/**
 * The "smart brain" — a local, offline natural-language parser.
 *
 * It extracts a date, time, category and a cleaned title from free text like:
 *   "26 nov cook fried rice at 2 pm"
 *   "besok jam 7 pagi olahraga"
 *   "minggu depan meeting kerja jam 2 siang"
 *
 * Designed to be easy to upgrade later to a hybrid (local + online AI) setup:
 * keep this signature and add an async `parseSmartInputAI` that falls back here.
 */

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3, june: 5, july: 6, august: 7,
  september: 8, october: 9, november: 10, december: 11,
  // Indonesian
  mei: 4, agu: 7, agustus: 7, okt: 9, oktober: 9, des: 11, desember: 11,
  januari: 0, februari: 1, maret: 2, juni: 5, juli: 6, nopember: 10,
};

const MONTH_SHORT = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
];

interface ParseOptions {
  /** Reference "now" — defaults to real current time. Injectable for testing. */
  now?: Date;
}

function extractDate(lower: string, now: Date): string {
  // 1) Relative Indonesian / English keywords
  const day = 24 * 60 * 60 * 1000;
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const relative: Array<[RegExp, number]> = [
    [/\b(hari ini|today)\b/, 0],
    [/\b(besok|tomorrow|bsk)\b/, 1],
    [/\b(lusa|day after tomorrow)\b/, 2],
    [/\b(minggu depan|next week)\b/, 7],
  ];
  for (const [re, offset] of relative) {
    if (re.test(lower)) {
      const d = new Date(base.getTime() + offset * day);
      return toDateKey(d.getFullYear(), d.getMonth(), d.getDate());
    }
  }

  // 2) Explicit month + day: "26 nov" or "nov 26" / "november 26"
  for (const [key, val] of Object.entries(MONTHS)) {
    const re = new RegExp(`(\\d{1,2})\\s*${key}\\b|\\b${key}\\s*(\\d{1,2})`);
    const m = lower.match(re);
    if (m) {
      const dayNum = parseInt(m[1] || m[2], 10);
      if (dayNum >= 1 && dayNum <= 31) {
        // choose the year: if the month/day already passed this year, keep this year anyway
        return toDateKey(now.getFullYear(), val, dayNum);
      }
    }
  }

  // 3) "tanggal 25" / "on the 25th"
  const dom = lower.match(/\b(?:tanggal|tgl)\s*(\d{1,2})\b/);
  if (dom) {
    const dayNum = parseInt(dom[1], 10);
    if (dayNum >= 1 && dayNum <= 31) {
      return toDateKey(now.getFullYear(), now.getMonth(), dayNum);
    }
  }

  return '';
}

function extractTime(lower: string): string {
  // "at 2 pm", "14:00", "2.30 pm", "jam 5 sore", "jam 7 pagi"
  // First: HH:mm or H.mm with optional am/pm
  const re1 = /(\d{1,2})\s*[:.]\s*(\d{2})\s*(am|pm)?/i;
  const re2 = /\b(?:jam|at|pukul)?\s*(\d{1,2})\s*(am|pm)\b/i;
  const re3 = /\b(?:jam|pukul)\s*(\d{1,2})\b\s*(pagi|siang|sore|malam)?/i;

  let h = -1;
  let min = 0;
  let suffix = '';

  const m1 = lower.match(re1);
  if (m1) {
    h = parseInt(m1[1], 10);
    min = parseInt(m1[2], 10);
    suffix = (m1[3] || '').toLowerCase();
  } else {
    const m2 = lower.match(re2);
    if (m2) {
      h = parseInt(m2[1], 10);
      suffix = (m2[2] || '').toLowerCase();
    } else {
      const m3 = lower.match(re3);
      if (m3) {
        h = parseInt(m3[1], 10);
        const idPart = (m3[2] || '').toLowerCase();
        // Indonesian time-of-day words
        if (idPart === 'sore' || idPart === 'malam') suffix = 'pm';
        else if (idPart === 'siang' && h < 12) suffix = 'pm';
        else if (idPart === 'pagi') suffix = 'am';
      }
    }
  }

  if (h < 0) return '';

  if (suffix === 'pm' && h < 12) h += 12;
  if (suffix === 'am' && h === 12) h = 0;
  if (h > 23) h = 23;

  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function cleanTitle(raw: string): string {
  let title = raw
    // remove "26 nov" / "november 26"
    .replace(/\d{1,2}\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|des|dec|mei|agu|okt)\w*/gi, '')
    .replace(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|des|dec|mei|agu|okt|nov)\w*\s*\d{1,2}/gi, '')
    // relative words
    .replace(/\b(hari ini|today|besok|tomorrow|bsk|lusa|minggu depan|next week)\b/gi, '')
    // "tanggal 25"
    .replace(/\b(tanggal|tgl)\s*\d{1,2}\b/gi, '')
    // time expressions
    .replace(/\b(at|on|by|jam|pukul)\b\s*\d{1,2}([:.]\d{2})?\s*(am|pm)?/gi, '')
    .replace(/\d{1,2}([:.]\d{2})?\s*(am|pm)/gi, '')
    .replace(/\b(pagi|siang|sore|malam)\b/gi, '')
    // leftover filler words at edges
    .replace(/\s+/g, ' ')
    .trim();

  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  return title;
}

function guessCategory(text: string): string {
  const s = text.toLowerCase();
  if (/cook|eat|food|rice|meal|lunch|dinner|breakfast|masak|makan|nasi|sarapan|kopi|coffee|cafe/.test(s)) return 'cooking';
  if (/run|gym|yoga|workout|health|exercise|sport|olahraga|lari|sehat|jogging|renang/.test(s)) return 'health';
  if (/meet|call|standup|review|work|office|project|client|kerja|rapat|kantor|proyek|meeting|deadline|tugas/.test(s)) return 'work';
  if (/friend|party|social|hangout|visit|teman|pesta|nongkrong|kumpul|arisan/.test(s)) return 'social';
  if (/flight|travel|trip|hotel|pack|vacation|jalan|liburan|pesawat|tiket|wisata/.test(s)) return 'travel';
  return 'personal';
}

export function parseSmartInput(raw: string, opts: ParseOptions = {}): ParsedInput | null {
  if (!raw.trim()) return null;
  const now = opts.now ?? new Date();
  const lower = raw.toLowerCase();

  const date = extractDate(lower, now);
  const time = extractTime(lower);
  let title = cleanTitle(raw);
  if (!title) title = raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1);
  const category = guessCategory(title || raw);

  return { title, date, time, category };
}

/** Format an ISO date for the preview chip using short English month (matches Figma). */
export function chipDateShort(dateISO: string): string {
  if (!dateISO) return '';
  const [, m, d] = dateISO.split('-').map(Number);
  return `${MONTH_SHORT[m - 1]} ${d}`;
}
