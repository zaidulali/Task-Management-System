import React, { useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function Tasks() {
  const [tasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      
      <form onSubmit={handleAddTask}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
