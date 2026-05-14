import { useState } from "react";
import { PRIORITIES, CATEGORIES } from "../utils/constants";

export default function TaskForm({ onSubmit, initial = null, onCancel }) {
  const [text, setText] = useState(initial?.text ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? "medium");
  const [category, setCategory] = useState(initial?.category ?? "Perso");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ text, priority, category, dueDate });
    if (!initial) { setText(""); setPriority("medium"); setCategory("Perso"); setDueDate(""); }
  };

  const isEdit = !!initial;

  return (
    <form onSubmit={handleSubmit} className={`task-form ${isEdit ? "task-form--edit" : ""}`}>
      <div className="form-main-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isEdit ? "Modifier la tâche…" : "Ajouter une tâche…"}
          className="form-input"
          autoFocus={isEdit}
        />
        <button type="submit" className="btn btn-primary">
          {isEdit ? "Sauvegarder" : "+ Ajouter"}
        </button>
        {isEdit && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
      <div className="form-meta-row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select">
          {Object.entries(PRIORITIES).map(([k, v]) => (
            <option key={k} value={k}>{v.dot} {v.label}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-select">
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.icon} {c.value}</option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-select"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
    </form>
  );
}