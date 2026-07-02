import React, { useEffect, useState } from 'react';
import { taskService } from '../services/tasks';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  owner: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.list();
      setTasks(data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      description,
      status: taskStatus,
    };

    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? updated : t))
        );
        setEditingTask(null);
      } else {
        const created = await taskService.create(payload);
        setTasks((prev) => [created, ...prev]);
      }
      setTitle('');
      setDescription('');
      setTaskStatus('To Do');
    } catch (err: any) {
      setError(err?.message || 'Failed to save task.');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setTaskStatus(task.status);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setTaskStatus('To Do');
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete task.');
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    setError(null);
    const payload = {
      title: task.title,
      description: task.description,
      status: newStatus,
    };

    try {
      const updated = await taskService.update(task.id, payload);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated : t))
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to update task status.');
    }
  };

  return (
    <div className="tasks-dashboard">
      <h2>Task Dashboard</h2>

      {error && <div className="error-banner">{error}</div>}

      <div className="task-form-section">
        <h3>{editingTask ? 'Edit Task' : 'Create Task'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
            {editingTask && (
              <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="task-list-section">
        <h3>My Tasks</h3>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found. Use the form above to add a task!</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description || <em>No description provided.</em>}</p>
                
                <div className="task-status-control">
                  <label htmlFor={`status-select-${task.id}`}>Status: </label>
                  <select
                    id={`status-select-${task.id}`}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="task-card-actions">
                  <button type="button" onClick={() => handleEditClick(task)} className="edit-btn">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
