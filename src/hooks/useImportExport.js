import { useCallback, useRef } from "react";

// ── Export JSON ──
export function exportJSON(tasks) {
  const data = JSON.stringify(tasks, null, 2);
  downloadFile(data, "taskflow-export.json", "application/json");
}

// ── Export CSV ──
export function exportCSV(tasks) {
  const headers = ["id", "text", "priority", "category", "done", "dueDate", "createdAt"];
  const rows = tasks.map((t) =>
    headers.map((h) => {
      const val = t[h] ?? "";
      // Échappe les virgules et guillemets dans le texte
      return typeof val === "string" && (val.includes(",") || val.includes('"'))
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  downloadFile(csv, "taskflow-export.csv", "text/csv");
}

// ── Téléchargement générique ──
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Import JSON ──
export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) throw new Error("Format invalide");
        // Validation minimale de chaque tâche
        const valid = parsed.filter(
          (t) => t.id && typeof t.text === "string"
        );
        resolve(valid);
      } catch {
        reject(new Error("Fichier JSON invalide"));
      }
    };
    reader.onerror = () => reject(new Error("Erreur de lecture"));
    reader.readAsText(file);
  });
}

// ── Hook principal ──
export function useImportExport(tasks, onImport) {
  const fileInputRef = useRef(null);

  const handleExportJSON = useCallback(() => exportJSON(tasks), [tasks]);
  const handleExportCSV  = useCallback(() => exportCSV(tasks),  [tasks]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importJSON(file);
      onImport(imported);
    } catch (err) {
      alert(err.message);
    }
    // Reset input pour permettre re-import du même fichier
    e.target.value = "";
  }, [onImport]);

  return { fileInputRef, handleExportJSON, handleExportCSV, handleImportClick, handleFileChange };
}