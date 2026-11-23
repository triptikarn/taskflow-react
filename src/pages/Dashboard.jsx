import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { PRIORITIES, STATUSES } from '../utils/format';

/**
 * The board: three columns (To do / In progress / Done) fed by
 * GET /api/tasks. All mutations go through the API and the local list
 * is updated from the server's response, so the UI never drifts from
 * the database.
 */
export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editing, setEditing] = useState(null); // task being edited, or null
  const [showCreate, setShowCreate] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.listTasks(
        priorityFilter ? { priority: priorityFilter } : {}
      );
      setTasks(data.tasks);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [priorityFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(payload) {
    setBusy(true);
    try {
      const { task } = await api.createTask(payload);
      setTasks((t) => [task, ...t]);
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(payload) {
    setBusy(true);
    try {
      const { task } = await api.updateTask(editing._id, payload);
      setTasks((t) => t.map((x) => (x._id === task._id ? task : x)));
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleMove(task, status) {
    try {
      const { task: updated } = await api.updateTask(task._id, { status });
      setTasks((t) => t.map((x) => (x._id === updated._id ? updated : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await api.deleteTask(task._id);
      setTasks((t) => t.filter((x) => x._id !== task._id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h1>Your board</h1>
          <div className="page-head-actions">
            <label className="filter">
              Priority
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setEditing(null);
                setShowCreate((s) => !s);
              }}
            >
              {showCreate ? 'Close' : 'New task'}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {showCreate && (
          <section className="panel">
            <h2>New task</h2>
            <TaskForm onSubmit={handleCreate} busy={busy} />
          </section>
        )}

        {editing && (
          <section className="panel">
            <h2>Edit task</h2>
            <TaskForm
              task={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              busy={busy}
            />
          </section>
        )}

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <div className="board">
            {STATUSES.map((status) => {
              const column = tasks.filter((t) => t.status === status.value);
              return (
                <section key={status.value} className="column">
                  <h2>
                    {status.label} <span className="count">{column.length}</span>
                  </h2>
                  {column.length === 0 && <p className="empty">No tasks here yet.</p>}
                  {column.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onMove={handleMove}
                      onEdit={(t) => {
                        setShowCreate(false);
                        setEditing(t);
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
