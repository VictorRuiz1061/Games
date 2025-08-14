"use client";

import "../../../css/ver.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function Page({ params }) {
  const resolvedParams = use(params);
  const [game, setGame] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const id = resolvedParams.id; // Obtener el ID de los parámetros de la ruta resueltos

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!id || isNaN(parseInt(id))) {
          throw new Error("ID de juego no válido");
        }
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/");
          return;
        }
        
        // Cargar datos del juego
        const gameResponse = await fetch(`/api/games/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!gameResponse.ok) {
          throw new Error("Error al cargar los datos del juego");
        }
        
        const gameData = await gameResponse.json();
        setGame(gameData);
        
        // Cargar plataformas
        const platformsResponse = await fetch("/api/platforms", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!platformsResponse.ok) {
          throw new Error("Error al cargar las plataformas");
        }
        
        const platformsData = await platformsResponse.json();
        setPlatforms(platformsData);
        
        // Cargar categorías
        const categoriesResponse = await fetch("/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!categoriesResponse.ok) {
          throw new Error("Error al cargar las categorías");
        }
        
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, router]);

  const handleBack = () => {
    router.push("/games");
  };

  const handleClose = () => {
    router.push("/");
  };
  
  const handleEdit = () => {
    router.push(`/games/crear?id=${id}`);
  };

  const getPlatformName = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.name : "Desconocida";
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Desconocida";
  };

  if (loading) {
    return (
      <div className="ver-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="ver-page">
        <div className="error-message">
          {error || "No se pudo cargar el juego"}
        </div>
        <button className="atras-btn" onClick={handleBack}>←</button>
      </div>
    );
  }

  return (
    <div className="ver-page">
      <button className="atras-btn" onClick={handleBack}>←</button>
      <div className="ver-header">
        <h1>Consultar VideoJuego</h1>
        <button className="cerrar-btn" onClick={handleClose}>✕</button>
      </div>

      <div className="game-image-container">
        <img 
          src={game.cover || "/mario.png"} 
          alt={game.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/mario.png";
          }}
        />
      </div>

      <div className="game-details">
        <div className="detail-row">
          <div className="detail-label">Título:</div>
          <div className="detail-value">{game.title}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Consola:</div>
          <div className="detail-value">
            {getPlatformName(game.plataformId)}
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Categoría:</div>
          <div className="detail-value">
            {getCategoryName(game.categoryId)}
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Año:</div>
          <div className="detail-value">
            {game.year || "Desconocido"}
          </div>
        </div>
      </div>
    </div>
  );
}
