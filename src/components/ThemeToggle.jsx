export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          {isDark ? <MoonIcon /> : <SunIcon />}
        </span>
      </span>
    </button>
  );
}

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);