// utils/scheduler.util.ts
export function calculateNextRun(frequency: string, from: Date = new Date()): Date {
  const now = new Date(from);

  if (frequency === 'Weekly') {
    // Option A: always next Monday
    now.setDate(now.getDate() + (7 - now.getDay()));
    now.setHours(8, 0, 0, 0);
    return now;

    // Option B (if you want same weekday instead):
    // now.setDate(now.getDate() + 7);
    // now.setHours(8, 0, 0, 0);
    // return now;
  }

  if (frequency === 'Monthly') {
    now.setMonth(now.getMonth() + 1, 1);
    now.setHours(8, 0, 0, 0);
    return now;
  }

  return now;
}
