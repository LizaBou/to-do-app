import { useRef } from "react";
import { useProfile } from "../hooks/useProfile";

export default function AvatarUpload({ user }) {
  const { avatarUrl, uploading, error, uploadAvatar } = useProfile(user?.id);
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
    e.target.value = "";
  };

  // Initiale de l'email si pas d'avatar
  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="avatar-wrap">
      <button
        className="avatar-btn"
        onClick={handleClick}
        title="Changer la photo de profil"
        disabled={uploading}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="avatar-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <span className="avatar-initial">{initial}</span>
        )}

        {/* Overlay au hover */}
        <span className="avatar-overlay">
          {uploading ? <SpinIcon /> : <CameraIcon />}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {error && <p className="avatar-error">{error}</p>}
    </div>
  );
}

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SpinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);