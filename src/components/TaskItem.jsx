import { useState } from "react";
import { PRIORITIES, CATEGORIES } from "../utils/constants";
import TaskForm from "./TaskForm";

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const priority = PRIORITIES[task.priority];
  const cat = CATEGORIES.find((c) => c.value === task.category);
  const overdue = isOverdue(task.dueDate) && !task.done;

  const handleUpdate = (changes) => {
    onUpdate(task.id, changes);
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(task.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  if (editing) {
    return (
      <li className="task-item task-item--editing">
        <TaskForm initial={task} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className={`task-item ${task.done ? "task-item--done" : ""} ${overdue ? "task-item--overdue" : ""}`}>
      <button
        className={`task-check ${task.done ? "task-check--checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "Marquer non terminé" : "Marquer terminé"}
      >
        {task.done && <CheckIcon />}
      </button>

      <div className="task-body">
        <span className="task-text">{task.text}</span>
        <div className="task-tags">
          <span className="tag tag--priority" style={{ background: priority.bg, color: priority.color }}>
            {priority.label}
          </span>
          <span className="tag tag--category" style={{ color: cat?.color }}>
            {cat?.icon} {task.category}
          </span>
          {task.dueDate && (
            <span className={`tag tag--date ${overdue ? "tag--overdue" : ""}`}>
              {overdue ? "⚠ " : ""}
              {new Date(task.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="action-btn" onClick={() => setEditing(true)} aria-label="Modifier" title="Modifier">
          <EditIcon />
        </button>
        <button
          className={`action-btn ${confirmDelete ? "action-btn--danger" : ""}`}
          onClick={handleDelete}
          aria-label="Supprimer"
          title={confirmDelete ? "Cliquer encore pour confirmer" : "Supprimer"}
        >
          {confirmDelete ? <span style={{ fontSize: 11, fontWeight: 600 }}>Oui ?</span> : <TrashIcon />}
        </button>
      </div>
    </li>
  );
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M11.5 1.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 4h11M5 4V2.5h5V4M6 7v4M9 7v4M3 4l1 9h7l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);