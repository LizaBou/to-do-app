import { useState, useMemo } from "react";
import { useTasks } from "./hooks/useTasks";
import { FILTERS, filterTasks } from "./utils/constants";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import StatsBar from "./components/StatsBar";
import "./App.css";

export default function App() {
  const { tasks, stats, createTask, updateTask, deleteTask, toggleTask, clearCompleted } = useTasks();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterTasks(tasks, filter, search), [tasks, filter, search]);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Taskflow</span>
        </div>

        <nav className="sidebar-nav">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`nav-item ${filter === f.key ? "nav-item--active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              <span className="nav-label">{f.label}</span>
              {f.key === "all" && <span className="nav-count">{tasks.length}</span>}
              {f.key === "todo" && <span className="nav-count">{stats.todo}</span>}
              {f.key === "high" && stats.urgent > 0 && (
                <span className="nav-count nav-count--urgent">{stats.urgent}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {stats.done > 0 && (
            <button className="btn-clear" onClick={clearCompleted}>
              Vider les tâches faites ({stats.done})
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
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
              <p>{search ? "Aucun résultat pour cette recherche." : "Aucune tâche ici."}</p>
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
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);