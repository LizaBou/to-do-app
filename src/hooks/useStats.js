import { useMemo } from "react";

// Retourne le label du jour en français
function dayLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { weekday: "short" });
}

// Retourne YYYY-MM-DD d'une date
function toDateKey(isoString) {
  return isoString.slice(0, 10);
}

export function useStats(tasks) {
  return useMemo(() => {
    const today = new Date();

    // ── 7 derniers jours ──
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return {
        date: toDateKey(d.toISOString()),
        label: dayLabel(d.toISOString()),
        créées: 0,
        complétées: 0,
      };
    });

    tasks.forEach((t) => {
      const createdKey = toDateKey(t.createdAt);
      const updatedKey = toDateKey(t.updatedAt);

      const createdDay = last7.find((d) => d.date === createdKey);
      if (createdDay) createdDay.créées += 1;

      if (t.done) {
        const doneDay = last7.find((d) => d.date === updatedKey);
        if (doneDay) doneDay.complétées += 1;
      }
    });

    // ── Répartition par catégorie ──
    const catMap = {};
    tasks.forEach((t) => {
      catMap[t.category] = (catMap[t.category] ?? 0) + 1;
    });
    const byCategory = Object.entries(catMap).map(([name, value]) => ({ name, value }));

    // ── Répartition par priorité ──
    const priMap = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => { priMap[t.priority] = (priMap[t.priority] ?? 0) + 1; });
    const byPriority = [
      { name: "Urgent",  value: priMap.high,   color: "#E24B4A" },
      { name: "Moyenne", value: priMap.medium, color: "#BA7517" },
      { name: "Basse",   value: priMap.low,    color: "#3B6D11" },
    ].filter((p) => p.value > 0);

    // ── Taux de complétion ──
    const total = tasks.length;
    const done  = tasks.filter((t) => t.done).length;
    const completionRate = total ? Math.round((done / total) * 100) : 0;

    // ── Tâches en retard ──
    const overdue = tasks.filter(
      (t) => !t.done && t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString())
    ).length;

    return { last7, byCategory, byPriority, completionRate, total, done, overdue };
  }, [tasks]);
}