import { useState } from "react";
import { useImportExport } from "../hooks/useImportExport";

export default function ImportExportBar({ tasks, onImport }) {
  const [imported, setImported] = useState(null); // feedback après import
  const {
    fileInputRef,
    handleExportJSON,
    handleExportCSV,
    handleImportClick,
    handleFileChange,
  } = useImportExport(tasks, (data) => {
    onImport(data);
    setImported(data.length);
    setTimeout(() => setImported(null), 3000);
  });

  return (
    <div className="ie-bar">
      <p className="ie-title">Données</p>

      {/* Export */}
      <div className="ie-group">
        <p className="ie-label">Exporter</p>
        <div className="ie-btns">
          <button className="ie-btn" onClick={handleExportJSON} title="Télécharger en JSON">
            <DownloadIcon /> JSON
          </button>
          <button className="ie-btn" onClick={handleExportCSV} title="Télécharger en CSV">
            <DownloadIcon /> CSV
          </button>
        </div>
      </div>

      {/* Import */}
      <div className="ie-group">
        <p className="ie-label">Importer</p>
        <button className="ie-btn ie-btn--import" onClick={handleImportClick}>
          <UploadIcon /> Fichier JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Feedback import */}
      {imported !== null && (
        <p className="ie-feedback">
          ✓ {imported} tâche{imported > 1 ? "s" : ""} importée{imported > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const UploadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M8 10V2M5 5l3-3 3 3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);