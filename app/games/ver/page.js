"use client";

import "./ver.css";
import { useState, useEffect } from "react";

export default function Page() {
  // En un caso real, obtendríamos estos datos de la API
  const [game, setGame] = useState({
    title: "Super Mario Oddysey",
    platform: "Nintendo Switch",
    category: "Aventura",
    year: "2017",
    coverImage: "/mario.png"
  });

  return (
    <div className="ver-page">
      <button className="atras-btn">←</button>
      <div className="ver-header">
        <h1>Consultar VideoJuego</h1>
        <button className="cerrar-btn">✕</button>
      </div>

      <div className="game-image-container">
        <img src={game.coverImage} alt={game.title} />
      </div>

      <div className="game-details">
        <div className="detail-row">
          <div className="detail-label">Título:</div>
          <div className="detail-value">{game.title}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Consola:</div>
          <div className="detail-value">{game.platform}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Categoría:</div>
          <div className="detail-value">{game.category}</div>
        </div>
        
        <div className="detail-row">
          <div className="detail-label">Año:</div>
          <div className="detail-value">{game.year}</div>
        </div>
      </div>
    </div>
  );
}
