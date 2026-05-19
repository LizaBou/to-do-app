import { useState, useMemo } from "react";
import { useTasks } from "./hooks/useTasks";
import { useTheme } from "./hooks/useTheme";
import { FILTERS, filterTasks } from "./utils/constants";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import StatsBar from "./components/StatsBar";
import ThemeToggle from "./components/ThemeToggle";
import StatsPage from "./components/StatsPage";
import ImportExportBar from "./components/ImportExportBar"; // ← NOUVEAU
import "./App.css";

export default function App() {
  const {
    tasks, stats,
    createTask, updateTask, deleteTask, toggleTask, clearCompleted,
    addSubtask, toggleSubtask, deleteSubtask, updateSubtask,
    importTasks, // ← NOUVEAU
  } = useTasks();
  const { theme, toggle } = useTheme();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("tasks");

  const filtered = useMemo(() => filterTasks(tasks, filter, search), [tasks, filter, search]);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Taskflow</span>
        </div>

        {/* Navigation principale */}
        <div className="sidebar-views">
          <button
            className={`nav-item ${view === "tasks" ? "nav-item--active" : ""}`}
            onClick={() => setView("tasks")}
          >
            <span className="nav-label">☑ Tâches</span>
          </button>
          <button
            className={`nav-item ${view === "stats" ? "nav-item--active" : ""}`}
            onClick={() => setView("stats")}
          >
            <span className="nav-label">📊 Statistiques</span>
          </button>
        </div>

        {/* Filtres (seulement sur vue tâches) */}
        {view === "tasks" && (
          <nav className="sidebar-nav">
            <p className="sidebar-section-label">Filtres</p>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`nav-item ${filter === f.key ? "nav-item--active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                <span className="nav-label">{f.label}</span>
                {f.key === "all"  && <span className="nav-count">{tasks.length}</span>}
                {f.key === "todo" && <span className="nav-count">{stats.todo}</span>}
                {f.key === "high" && stats.urgent > 0 && (
                  <span className="nav-count nav-count--urgent">{stats.urgent}</span>
                )}
              </button>
            ))}
          </nav>
        )}

        <div className="sidebar-footer">

          {/* ── Import / Export ── NOUVEAU */}
          <ImportExportBar tasks={tasks} onImport={importTasks} />

          <div className="sidebar-theme-row">
            <span className="theme-label">
              {theme === "dark" ? "Mode sombre" : "Mode clair"}
            </span>
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>

          {stats.done > 0 && (
            <button className="btn-clear" onClick={clearCompleted}>
              Vider les tâches faites ({stats.done})
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">

        {/* ── Vue Statistiques ── */}
        {view === "stats" && <StatsPage tasks={tasks} />}

        {/* ── Vue Tâches ── */}
        {view === "tasks" && (
          <>
            <header className="main-header">
              <div>
                <h1 className="main-title">
                  {FILTERS.find((f) => f.key === filter)?.label ?? filter}
                </h1>
                <p className="main-sub">
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
              <div className="search-wrap">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Rechercher…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </header>

            <StatsBar stats={stats} />
            <TaskForm onSubmit={createTask} />

            <section className="task-section">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">○</span>
                  <p>{search ? "Aucun résultat." : "Aucune tâche ici."}</p>
                </div>
              ) : (
                <ul className="task-list">
                  {filtered.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      onUpdate={updateTask}
                      onAddSubtask={addSubtask}
                      onToggleSubtask={toggleSubtask}
                      onDeleteSubtask={deleteSubtask}
                      onUpdateSubtask={updateSubtask}
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);