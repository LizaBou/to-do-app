import { useState } from "react";

export default function AuthPage({ onLogin, onRegister, error }) {
  const [mode, setMode]         = useState("login"); // "login" | "register"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    if (mode === "login") await onLogin(email, password);
    else await onRegister(email, password);
    setLoading(false);
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Taskflow</span>
        </div>
        <p className="auth-sub">
          {mode === "login" ? "Connecte-toi pour accéder à tes tâches" : "Crée ton compte gratuitement"}
        </p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "auth-tab--active" : ""}`}
            onClick={() => setMode("login")}
          >
            Connexion
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "auth-tab--active" : ""}`}
            onClick={() => setMode("register")}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="toi@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Mot de passe</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Message erreur / succès */}
          {error && (
            <p className={`auth-msg ${error.startsWith("Vérifie") ? "auth-msg--success" : "auth-msg--error"}`}>
              {error}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Chargement…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}