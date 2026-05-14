export default function StatsBar({ stats }) {
  return (
    <div className="stats-section">
      <div className="stats-grid">
        <StatCard label="Total" value={stats.total} accent="#534AB7" />
        <StatCard label="À faire" value={stats.todo} accent="#185FA5" />
        <StatCard label="Terminées" value={stats.done} accent="#0F6E56" />
        <StatCard label="Urgentes" value={stats.urgent} accent="#E24B4A" />
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${stats.progress}%` }}
          role="progressbar"
          aria-valuenow={stats.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="progress-label">
        {stats.total === 0
          ? "Aucune tâche — commencez !"
          : stats.progress === 100
          ? "🎉 Tout est terminé !"
          : `${stats.progress}% accompli`}
      </p>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={{ color: accent }}>{value}</span>
    </div>
  );
}