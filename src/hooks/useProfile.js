import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useProfile(userId) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");

  // ── Charge l'avatar depuis Supabase Storage ──
  useEffect(() => {
    if (!userId) return;
    const path = `${userId}/avatar`;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    // Ajoute un timestamp pour éviter le cache navigateur
    setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
  }, [userId]);

  // ── Upload nouvel avatar ──
  const uploadAvatar = useCallback(async (file) => {
    if (!file || !userId) return;

    // Vérifie le type
    if (!file.type.startsWith("image/")) {
      setError("Fichier image requis (jpg, png, webp)");
      return;
    }
    // Vérifie la taille (max 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image trop lourde (max 2 MB)");
      return;
    }

    setUploading(true);
    setError("");

    const path = `${userId}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    }

    setUploading(false);
  }, [userId]);

  return { avatarUrl, uploading, error, uploadAvatar };
}