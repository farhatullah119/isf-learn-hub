/**
 * Parse a deadline string (e.g. "March 14, 2026", "April 3, 2026") and check if it's expired.
 */
export function isDeadlineExpired(deadline: string | null): boolean {
  if (!deadline) return false;
  try {
    const parsed = Date.parse(deadline);
    if (isNaN(parsed)) return false;
    const deadlineDate = new Date(parsed);
    deadlineDate.setHours(23, 59, 59, 999);
    return deadlineDate < new Date();
  } catch {
    return false;
  }
}
