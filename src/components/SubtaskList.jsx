import { useState } from "react";

export default function SubtaskList({ taskId, subtasks, onAdd, onToggle, onDelete, onUpdate }) {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const done = subtasks.filter((s) => s.done).length;
  const total = subtasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const handleAdd = () => {
    if (!input.trim()) return;
    onAdd(taskId, input);
    setInput("");
  };

  const handleEditStart = (s) => {
    setEditingId(s.id);
    setEditText(s.text);
  };

  const handleEditSave = (subtaskId) => {
    if (editText.trim()) onUpdate(taskId, subtaskId, editText);
    setEditingId(null);
  };

  return (
    <div className="subtask-list">
      {/* Barre de progression sous-tâches */}
      {total > 0 && (
        <div className="subtask-progress">
          <div className="subtask-progress-track">
            <div className="subtask-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="subtask-progress-label">{done}/{total}</span>
        </div>
      )}

      {/* Liste des sous-tâches */}
      {subtasks.map((s) => (
        <div key={s.id} className={`subtask-item ${s.done ? "subtask-item--done" : ""}`}>
          <button
            className={`subtask-check ${s.done ? "subtask-check--checked" : ""}`}
            onClick={() => onToggle(taskId, s.id)}
            aria-label={s.done ? "Marquer non fait" : "Marquer fait"}
          >
            {s.done && "✓"}
          </button>

          {editingId === s.id ? (
            <input
              className="subtask-edit-input"
              value={editText}
              autoFocus
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave(s.id);
                if (e.key === "Escape") setEditingId(null);
              }}
              onBlur={() => handleEditSave(s.id)}
            />
          ) : (
            <span
              className="subtask-text"
              onDoubleClick={() => handleEditStart(s)}
              title="Double-clic pour modifier"
            >
              {s.text}
            </span>
          )}

          <div className="subtask-actions">
            <button
              className="subtask-action-btn"
              onClick={() => handleEditStart(s)}
              aria-label="Modifier"
            >
              <EditIcon />
            </button>
            <button
              className="subtask-action-btn subtask-action-btn--delete"
              onClick={() => onDelete(taskId, s.id)}
              aria-label="Supprimer"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {/* Champ d'ajout */}
      <div className="subtask-add-row">
        <span className="subtask-add-icon">+</span>
        <input
          className="subtask-add-input"
          placeholder="Ajouter une sous-tâche…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
      </div>
    </div>
  );
}

const EditIcon = () => (
  <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
    <path d="M11.5 1.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);