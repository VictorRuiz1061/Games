"use client";

import "./crear.css";
import { useState } from "react";

export default function Page() {
  const [gameData, setGameData] = useState({
    title: "",
    platform: "",
    category: "",
    cover: null,
    year: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGameData({
      ...gameData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setGameData({
        ...gameData,
        cover: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del juego:", gameData);
    // Aquí iría la lógica para enviar los datos al servidor
  };

  return (
    <div className="crear-page">
      <button className="atras-btn">←</button>
      <div className="crear-header">
        <h1>Adicionar VideoJuego</h1>
        <button className="cerrar-sesion">✕</button>
      </div>

      <div className="image-upload-container">
        <img src="/mario.png" alt="Subir imagen" />
      </div>

      <form className="crear-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="title"
          placeholder="Título" 
          value={gameData.title}
          onChange={handleInputChange}
        />
        
        <div className="select-container">
          <select name="platform" value={gameData.platform} onChange={handleInputChange} >
            <option value="switch">Nintendo Switch</option>
            <option value="ps5">PlayStation 5</option>
            <option value="xbox">Xbox Series X</option>
            <option value="pc">PC</option>
          </select>
          <span className="arrow-icon">▼</span>
        </div>
        
        <div className="select-container">
          <select name="category" value={gameData.category} onChange={handleInputChange} >
            <option value="accion">Acción</option>
            <option value="aventura">Aventura</option>
            <option value="rpg">RPG</option>
            <option value="estrategia">Estrategia</option>
            <option value="deportes">Deportes</option>
          </select>
          <span className="arrow-icon">▼</span>
        </div>
        
        <div className="upload-field">
          <input 
            type="text"
            readOnly
            placeholder="Subir Portada"
            value={gameData.cover ? gameData.cover.name : ""}
          />
          <label htmlFor="cover-upload" className="camera-icon">📷</label>
          <input 
            id="cover-upload"
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <input 
          type="number" 
          name="year"
          placeholder="Año" 
          min="1970"
          max="2030"
          value={gameData.year}
          onChange={handleInputChange}
        />

        <button type="submit" className="guardar-btn">Guardar</button>
      </form>
    </div>
  );
}
