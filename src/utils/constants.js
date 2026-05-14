export const PRIORITIES = {
  high:   { label: "Urgent",  color: "#E24B4A", bg: "#FCEBEB", dot: "🔴" },
  medium: { label: "Moyenne", color: "#BA7517", bg: "#FAEEDA", dot: "🟡" },
  low:    { label: "Basse",   color: "#3B6D11", bg: "#EAF3DE", dot: "🟢" },
};

export const CATEGORIES = [
  { value: "Perso",   icon: "✦", color: "#534AB7" },
  { value: "Travail", icon: "◈", color: "#185FA5" },
  { value: "Courses", icon: "◉", color: "#0F6E56" },
  { value: "Santé",   icon: "◎", color: "#993556" },
  { value: "Autre",   icon: "○", color: "#5F5E5A" },
];

export const FILTERS = [
  { key: "all",     label: "Toutes" },
  { key: "todo",    label: "À faire" },
  { key: "done",    label: "Faites" },
  { key: "high",    label: "Urgent" },
  { key: "Travail", label: "Travail" },
  { key: "Perso",   label: "Perso" },
];

export function filterTasks(tasks, filter, search) {
  let result = tasks;
  if (search.trim()) {
    result = result.filter((t) =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );
  }
  switch (filter) {
    case "todo":    return result.filter((t) => !t.done);
    case "done":    return result.filter((t) => t.done);
    case "high":    return result.filter((t) => t.priority === "high");
    default:
      if (["Perso","Travail","Courses","Santé","Autre"].includes(filter))
        return result.filter((t) => t.category === filter);
      return result;
  }
}