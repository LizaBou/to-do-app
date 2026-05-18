import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useStats } from "../hooks/useStats";

const CAT_COLORS = ["#534AB7", "#185FA5", "#0F6E56", "#993556", "#5F5E5A"];

// Tooltip custom
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function StatsPage({ tasks }) {
  const { last7, byCategory, byPriority, completionRate, total, done, overdue } = useStats(tasks);

  const hasData = total > 0;

  return (
    <div className="stats-page">
      <div className="stats-page-header">
        <h2 className="stats-page-title">Statistiques</h2>
        <p className="stats-page-sub">Vue d'ensemble de ta productivité</p>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>Ajoute des tâches pour voir tes statistiques</p>
        </div>
      ) : (
        <>
          {/* ── KPI cards ── */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-icon">✅</span>
              <span className="kpi-value">{completionRate}%</span>
              <span className="kpi-label">Taux de complétion</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">📋</span>
              <span className="kpi-value">{total}</span>
              <span className="kpi-label">Tâches total</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">✦</span>
              <span className="kpi-value" style={{ color: "var(--green)" }}>{done}</span>
              <span className="kpi-label">Terminées</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-icon">⚠</span>
              <span className="kpi-value" style={{ color: overdue > 0 ? "var(--red)" : undefined }}>{overdue}</span>
              <span className="kpi-label">En retard</span>
            </div>
          </div>

          {/* ── Activité 7 jours ── */}
          <div className="chart-card">
            <h3 className="chart-title">Activité des 7 derniers jours</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={last7} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCreees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c8b8ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c8b8ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCompletes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-3)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-2)" }} />
                <Area type="monotone" dataKey="créées" stroke="#c8b8ff" strokeWidth={2} fill="url(#gradCreees)" />
                <Area type="monotone" dataKey="complétées" stroke="#1D9E75" strokeWidth={2} fill="url(#gradCompletes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="charts-row">
            {/* ── Par catégorie ── */}
            {byCategory.length > 0 && (
              <div className="chart-card chart-card--half">
                <h3 className="chart-title">Par catégorie</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-3)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--text-3)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Tâches" radius={[4, 4, 0, 0]}>
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Par priorité ── */}
            {byPriority.length > 0 && (
              <div className="chart-card chart-card--half">
                <h3 className="chart-title">Par priorité</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={byPriority}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {byPriority.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-2)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}