import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// Convertit snake_case Supabase → camelCase React
function fromDB(t) {
  return {
    id:        t.id,
    text:      t.text,
    priority:  t.priority,
    category:  t.category,
    dueDate:   t.due_date,
    done:      t.done,
    subtasks:  t.subtasks ?? [],
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

// Convertit camelCase React → snake_case Supabase
function toDB(t, userId) {
  return {
    user_id:    userId,
    text:       t.text,
    priority:   t.priority,
    category:   t.category,
    due_date:   t.dueDate ?? "",
    done:       t.done,
    subtasks:   t.subtasks ?? [],
    updated_at: new Date().toISOString(),
  };
}

export function useTasksDB(userId) {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Charger les tâches ──
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setTasks((data ?? []).map(fromDB));
        setLoading(false);
      });
  }, [userId]);

  // ── Create ──
  const createTask = useCallback(async ({ text, priority = "medium", category = "Perso", dueDate = "" }) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([toDB({ text, priority, category, dueDate, done: false, subtasks: [] }, userId)])
      .select()
      .single();
    if (!error) setTasks((prev) => [fromDB(data), ...prev]);
  }, [userId]);

  // ── Update ──
  const updateTask = useCallback(async (id, changes) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const merged = { ...task, ...changes };
    const { error } = await supabase
      .from("tasks")
      .update(toDB(merged, userId))
      .eq("id", id);
    if (!error) setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...changes } : t));
  }, [tasks, userId]);

  // ── Delete ──
  const deleteTask = useCallback(async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Toggle done ──
  const toggleTask = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newDone = !task.done;
    const { error } = await supabase
      .from("tasks")
      .update({ done: newDone, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: newDone } : t));
  }, [tasks]);

  // ── Clear completed ──
  const clearCompleted = useCallback(async () => {
    const ids = tasks.filter((t) => t.done).map((t) => t.id);
    if (!ids.length) return;
    const { error } = await supabase.from("tasks").delete().in("id", ids);
    if (!error) setTasks((prev) => prev.filter((t) => !t.done));
  }, [tasks]);

  // ── Sous-tâches (stockées en JSONB) ──
  const updateSubtasks = useCallback(async (taskId, newSubtasks) => {
    const { error } = await supabase
      .from("tasks")
      .update({ subtasks: newSubtasks, updated_at: new Date().toISOString() })
      .eq("id", taskId);
    if (!error) setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, subtasks: newSubtasks } : t)
    );
  }, []);

  const addSubtask = useCallback(async (taskId, text) => {
    if (!text.trim()) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newSubtasks = [...task.subtasks, { id: crypto.randomUUID(), text: text.trim(), done: false }];
    await updateSubtasks(taskId, newSubtasks);
  }, [tasks, updateSubtasks]);

  const toggleSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newSubtasks = task.subtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s);
    await updateSubtasks(taskId, newSubtasks);
  }, [tasks, updateSubtasks]);

  const deleteSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newSubtasks = task.subtasks.filter((s) => s.id !== subtaskId);
    await updateSubtasks(taskId, newSubtasks);
  }, [tasks, updateSubtasks]);

  const updateSubtask = useCallback(async (taskId, subtaskId, newText) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newSubtasks = task.subtasks.map((s) => s.id === subtaskId ? { ...s, text: newText.trim() } : s);
    await updateSubtasks(taskId, newSubtasks);
  }, [tasks, updateSubtasks]);

  const stats = {
    total:    tasks.length,
    done:     tasks.filter((t) => t.done).length,
    todo:     tasks.filter((t) => !t.done).length,
    urgent:   tasks.filter((t) => t.priority === "high" && !t.done).length,
    progress: tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0,
  };

  return {
    tasks, stats, loading,
    createTask, updateTask, deleteTask, toggleTask, clearCompleted,
    addSubtask, toggleSubtask, deleteSubtask, updateSubtask,
  };
}