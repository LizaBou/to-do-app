import { useState } from "react";
import { PRIORITIES, CATEGORIES } from "../utils/constants";
import TaskForm from "./TaskForm";
import SubtaskList from "./SubtaskList";

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const priority = PRIORITIES[task.priority];
  const cat = CATEGORIES.find((c) => c.value === task.category);
  const overdue = isOverdue(task.dueDate) && !task.done;
  const subtaskCount = task.subtasks?.length ?? 0;
  const subtaskDone = task.subtasks?.filter((s) => s.done).length ?? 0;

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
    <li className={`task-item ${task.done ? "task-item--done" : ""} ${overdue ? "task-item--overdue" : ""} ${expanded ? "task-item--expanded" : ""}`}>
      {/* Ligne principale */}
      <div className="task-main-row">
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
            {/* Badge sous-tâches */}
            {subtaskCount > 0 && (
              <button
                className={`tag tag--subtasks ${subtaskDone === subtaskCount ? "tag--subtasks-done" : ""}`}
                onClick={() => setExpanded((v) => !v)}
              >
                ☑ {subtaskDone}/{subtaskCount}
              </button>
            )}
          </div>
        </div>

        <div className="task-actions">
          {/* Bouton expand sous-tâches */}
          <button
            className={`action-btn action-btn--expand ${expanded ? "action-btn--expand-open" : ""}`}
            onClick={() => setExpanded((v) => !v)}
            aria-label="Afficher les sous-tâches"
            title="Sous-tâches"
          >
            <ChevronIcon />
          </button>
          <button className="action-btn" onClick={() => setEditing(true)} aria-label="Modifier" title="Modifier">
            <EditIcon />
          </button>
          <button
            className={`action-btn ${confirmDelete ? "action-btn--danger" : ""}`}
            onClick={handleDelete}
            aria-label="Supprimer"
            title={confirmDelete ? "Confirmer ?" : "Supprimer"}
          >
            {confirmDelete ? <span style={{ fontSize: 11, fontWeight: 600 }}>Oui ?</span> : <TrashIcon />}
          </button>
        </div>
      </div>

      {/* Sous-tâches (expandable) */}
      {expanded && (
        <SubtaskList
          taskId={task.id}
          subtasks={task.subtasks ?? []}
          onAdd={onAddSubtask}
          onToggle={onToggleSubtask}
          onDelete={onDeleteSubtask}
          onUpdate={onUpdateSubtask}
        />
      )}
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
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);