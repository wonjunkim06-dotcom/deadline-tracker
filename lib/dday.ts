export function getDday(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDday(d: number): string {
  if (d === 0) return "D-Day";
  return d > 0 ? `D-${d}` : `D+${Math.abs(d)}`;
}