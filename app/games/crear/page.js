"use client";

import "../../css/crear.css";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [game, setGame] = useState({
    title: "",
    plataformId: "",
    categoryId: "",
    cover: null,
    year: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState("/mario.png");
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("id");

  // Función genérica para peticiones con autenticación
  const fetchAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return null;
    }
    const res = await fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers }
    });
    if (!res.ok) throw new Error(`Error al cargar ${url}`);
    return res.json();
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [platData, catData] = await Promise.all([
          fetchAuth("/api/platforms"),
          fetchAuth("/api/categories")
        ]);
        if (!platData || !catData) return;

        setPlatforms(platData);
        setCategories(catData);

        if (gameId) {
          setLoading(true);
          const gameInfo = await fetchAuth(`/api/games/${gameId}`);
          if (!gameInfo) return;
          setGame({
            title: gameInfo.title || "",
            plataformId: gameInfo.plataformId?.toString() || "",
            categoryId: gameInfo.categoryId?.toString() || "",
            year: gameInfo.year?.toString() || "",
            cover: null
          });
          if (gameInfo.cover) setPreview(gameInfo.cover);
          setIsEditing(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gameId]);

  // Manejo de cambios
  const handleChange = e => setGame({ ...game, [e.target.name]: e.target.value });

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGame({ ...game, cover: file });
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Guardar juego
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/");

      const year = parseInt(game.year);
      if (isNaN(year)) throw new Error("El año debe ser un número válido");

      const formData = new FormData();
      Object.entries({ ...game, year }).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      const url = isEditing ? `/api/games/${gameId}` : "/api/games";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error((await res.json()).error || "Error al guardar el juego");
      router.push("/games");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-page">
      <button className="atras-btn" onClick={() => router.push("/games")}>←</button>
      <div className="crear-header">
        <h1>{isEditing ? "Editar" : "Adicionar"} VideoJuego</h1>
        <button className="cerrar-sesion" onClick={() => router.push("/")}>✕</button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="image-upload-container">
            <img src={preview} alt="Imagen del juego" />
          </div>

          <form className="crear-form" onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Título" value={game.title} onChange={handleChange} required />

            <div className="select-container">
              <select name="plataformId" value={game.plataformId} onChange={handleChange} required>
                <option value="">Selecciona una plataforma</option>
                {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <span className="arrow-icon">▼</span>
            </div>

            <div className="select-container">
              <select name="categoryId" value={game.categoryId} onChange={handleChange} required>
                <option value="">Selecciona una categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span className="arrow-icon">▼</span>
            </div>

            <div className="upload-field">
              <input type="text" readOnly placeholder="Subir Portada"
                value={game.cover ? game.cover.name : isEditing ? "Mantener imagen actual" : ""} />
              <label htmlFor="cover-upload" className="camera-icon">📷</label>
              <input id="cover-upload" type="file" accept="image/*" onChange={handleFile} />
            </div>

            <input type="number" name="year" placeholder="Año" min="1960" max="2030"
              value={game.year} onChange={handleChange} required />

            <button type="submit" className="guardar-btn" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
