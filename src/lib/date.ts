/**
 * `YYYY-MM` only. These are never turned into a Date: constructing one from a
 * month invents a day and can shift across a timezone boundary.
 */
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export type Month = `${number}-${number}`;

const parts = (m: string) => {
  const [y, mo] = m.split('-');
  return { year: Number(y), month: Number(mo) };
};

/** "2025-07" -> "Jul 2025" */
export const formatMonth = (m: string): string => {
  const { year, month } = parts(m);
  return `${MONTHS[month - 1]} ${year}`;
};

/** "2025-07" -> "2025" */
export const yearOf = (m: string): string => m.slice(0, 4);

/** Sortable integer. "2025-07" -> 202507 */
export const monthKey = (m: string): number => {
  const { year, month } = parts(m);
  return year * 100 + month;
};

/** "Jul 2025 — Present" */
export const formatRange = (start: string, end?: string): string =>
  `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;

/** "1 yr 3 mos" — inclusive of both endpoints. */
export const formatDuration = (start: string, end?: string): string => {
  const a = parts(start);
  const now = new Date();
  const b = end ? parts(end) : { year: now.getFullYear(), month: now.getMonth() + 1 };
  const total = (b.year - a.year) * 12 + (b.month - a.month) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const bits: string[] = [];
  if (years) bits.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months) bits.push(`${months} mo${months > 1 ? 's' : ''}`);
  return bits.join(' ') || '1 mo';
};
