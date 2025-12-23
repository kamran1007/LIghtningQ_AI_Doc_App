import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function istDayRangeToUtc(dateStr: string) {
  if (!dateStr) return null;

  const startUtc = dayjs
    .tz(`${dateStr} 00:00:00`, 'Asia/Kolkata')
    .utc()
    .toDate();

  const endUtc = dayjs
    .tz(`${dateStr} 23:59:59`, 'Asia/Kolkata')
    .utc()
    .toDate();

  return { start: startUtc, end: endUtc };
}
