"use client";

import "../css/games.css";

export default function Page() {
  // Datos de ejemplo para los juegos
  const games = [
    {
      id: 1,
      title: "Nintendo Switch",
      subtitle: "Super Mario Odyssey",
      image: "/mario.png"
    },
    {
      id: 2,
      title: "Nintendo Switch",
      subtitle: "Luigi Mansion 3",
      image: "/mario.png"
    },
    {
      id: 3,
      title: "Nintendo Switch",
      subtitle: "Zelda Links Awakening",
      image: "/mario.png"
    },
    {
      id: 4,
      title: "Nintendo Switch",
      subtitle: "Metroid Dread",
      image: "/mario.png"
    },
    {
      id: 5,
      title: "Nintendo Switch",
      subtitle: "Kirby Star Allies",
      image: "/mario.png"
    }
  ];

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>Administrar videoJuegos</h1>
        <button className="cerrar-sesion">✕</button>
      </div>

      <button className="adicionar-btn">
        <span>+</span> Adicionar
      </button>

      <div className="games-list">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <img src={game.image} alt={game.subtitle} className="game-image" />
            <div className="game-info">
              <h2>{game.title}</h2>
              <p>{game.subtitle}</p>
            </div>
            <div className="game-actions">
              <button className="action-btn search-btn">
                <span className="icon">🔍</span>
              </button>
              <button className="action-btn edit-btn">
                <span className="icon">✏️</span>
              </button>
              <button className="action-btn delete-btn">
                <span className="icon">🗑️</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
