import { formatDate, isOverdue, STATUSES } from '../utils/format';

/**
 * One task on the board. Offers quick status moves (the arrow buttons
 * shift the task to the neighbouring column), plus edit and delete.
 */
export default function TaskCard({ task, onMove, onEdit, onDelete }) {
  const statusIndex = STATUSES.findIndex((s) => s.value === task.status);
  const overdue = isOverdue(task);

  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-head">
        <h3>{task.title}</h3>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
      </div>

      {task.notes && <p className="task-notes">{task.notes}</p>}

      {task.dueDate && (
        <p className={`task-due${overdue ? ' overdue' : ''}`}>
          Due {formatDate(task.dueDate)}
          {overdue ? ' - overdue' : ''}
        </p>
      )}

      <div className="task-actions">
        <button
          type="button"
          className="btn btn-small"
          disabled={statusIndex === 0}
          onClick={() => onMove(task, STATUSES[statusIndex - 1].value)}
          aria-label="Move back"
        >
          &larr;
        </button>
        <button
          type="button"
          className="btn btn-small"
          disabled={statusIndex === STATUSES.length - 1}
          onClick={() => onMove(task, STATUSES[statusIndex + 1].value)}
          aria-label="Move forward"
        >
          &rarr;
        </button>
        <span className="spacer" />
        <button type="button" className="btn btn-small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-small btn-danger"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
