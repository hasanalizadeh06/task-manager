import { DateTime } from "luxon";

export const formatDate = (dateStr: string, format: string = "yyyy-LL-dd") => {
  return DateTime.fromISO(dateStr).toFormat(format);
};

export const isPastDue = (dueDate: string) => {
  return DateTime.fromISO(dueDate) < DateTime.now();
};

export const getRelativeTime = (dateStr: string) => {
  return DateTime.fromISO(dateStr).toRelative(); // e.g. "in 2 days"
};

export const getTodayISO = () => {
  return DateTime.now().toISODate(); // "2025-05-08"
};
