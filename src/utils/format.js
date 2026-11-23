/** Small date helpers shared by the task board. */

/** Format an ISO date string as e.g. "23 Nov 2026" (empty string for none). */
export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Convert an ISO date to the yyyy-mm-dd value an <input type="date"> needs. */
export function toDateInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

/** True when a due date is in the past and the task is not finished. */
export function isOverdue(task, now = new Date()) {
  if (!task.dueDate || task.status === 'done') return false;
  return new Date(task.dueDate) < now;
}

/** The three board columns, in order. */
export const STATUSES = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

export const PRIORITIES = ['low', 'medium', 'high'];
