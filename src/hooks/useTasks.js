import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "todo_tasks_v1";

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ── CRUD Tâches ──
  const createTask = useCallback(({ text, priority = "medium", category = "Perso", dueDate = "" }) => {
    const task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      priority,
      category,
      dueDate,
      done: false,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback((id, changes) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: !t.done, updatedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.done));
  }, []);

  // ── CRUD Sous-tâches ──
  const addSubtask = useCallback((taskId, text) => {
    if (!text.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                { id: crypto.randomUUID(), text: text.trim(), done: false },
              ],
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !s.done } : s
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const updateSubtask = useCallback((taskId, subtaskId, newText) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, text: newText.trim() } : s
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  // ── Import (fusionne sans doublons) ──        ← NOUVEAU
  const importTasks = useCallback((imported) => {
    setTasks((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const newTasks = imported
        .filter((t) => !existingIds.has(t.id))
        .map((t) => ({ subtasks: [], ...t }));
      return [...newTasks, ...prev];
    });
  }, []);

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    todo: tasks.filter((t) => !t.done).length,
    urgent: tasks.filter((t) => t.priority === "high" && !t.done).length,
    progress: tasks.length
      ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
      : 0,
  };

  return {
    tasks,
    stats,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateSubtask,
    importTasks,             // ← NOUVEAU
  };
}