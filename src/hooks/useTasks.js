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

  const createTask = useCallback(({ text, priority = "medium", category = "Perso", dueDate = "" }) => {
    const task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      priority,
      category,
      dueDate,
      done: false,
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

  const reorderTask = useCallback((fromIndex, toIndex) => {
    setTasks((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  }, []);

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    todo: tasks.filter((t) => !t.done).length,
    urgent: tasks.filter((t) => t.priority === "high" && !t.done).length,
    progress: tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0,
  };

  return { tasks, stats, createTask, updateTask, deleteTask, toggleTask, clearCompleted, reorderTask };
}