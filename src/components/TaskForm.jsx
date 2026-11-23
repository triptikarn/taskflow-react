import { useState } from 'react';
import { PRIORITIES, STATUSES, toDateInputValue } from '../utils/format';

const EMPTY = { title: '', notes: '', status: 'todo', priority: 'medium', dueDate: '' };

/**
 * Create/edit form for a task. Pass an existing `task` to edit it,
 * or nothing to create a new one. Calls onSubmit(payload) and lets the
 * parent own the API call + error state.
 */
export default function TaskForm({ task, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(
    task
      ? {
          title: task.title || '',
          notes: task.notes || '',
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          dueDate: toDateInputValue(task.dueDate),
        }
      : EMPTY
  );

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title: form.title.trim(),
      notes: form.notes.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          required
          maxLength={140}
          value={form.title}
          onChange={update('title')}
          placeholder="What needs doing?"
        />
      </label>
      <label>
        Notes
        <textarea rows={3} value={form.notes} onChange={update('notes')} />
      </label>
      <div className="form-row">
        <label>
          Status
          <select value={form.status} onChange={update('status')}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select value={form.priority} onChange={update('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label>
          Due date
          <input type="date" value={form.dueDate} onChange={update('dueDate')} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {task ? 'Save changes' : 'Add task'}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
