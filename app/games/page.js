"use client";

import "../css/games.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Helper para requests autenticadas
  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      throw new Error("No autenticado");
    }
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(await res.text() || "Error en la solicitud");
    return res.json();
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/games");
      setGames(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este juego?")) return;
    try {
      await apiRequest(`/api/games/${id}`, { method: "DELETE" });
      fetchGames(); // Recargar lista
    } catch (err) {
      alert("Error al eliminar el juego: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const GameCard = ({ game }) => (
    <div className="game-card">
      <img
        src={game.cover || "/mario.png"}
        alt={game.title}
        className="game-image"
        onError={(e) => (e.target.src = "/mario.png")}
      />
      <div className="game-info">
        <h2>{game.title}</h2>
        <p>{game.plataformId}</p>
      </div>
      <div className="game-actions">
        <ActionButton icon="🔍" onClick={() => router.push(`/games/ver/${game.id}`)} />
        <ActionButton icon="✏️" onClick={() => router.push(`/games/crear?id=${game.id}`)} />
        <ActionButton icon="🗑️" onClick={() => handleDelete(game.id)} />
      </div>
    </div>
  );

  const ActionButton = ({ icon, onClick }) => (
    <button className="action-btn" onClick={onClick}>
      <span className="icon">{icon}</span>
    </button>
  );

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>Administrar Videojuegos</h1>
        <button className="cerrar-sesion" onClick={handleLogout}>
          ✕
        </button>
      </div>

      <button className="adicionar-btn" onClick={() => router.push("/games/crear")}>
        <span>+</span> Adicionar
      </button>

      {loading ? (
        <div className="loading">Cargando juegos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : games.length === 0 ? (
        <div className="no-games">No hay juegos disponibles</div>
      ) : (
        <div className="games-list">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
