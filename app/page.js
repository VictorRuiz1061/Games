"use client";
import { useState } from "react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="inicio-sesion">
      <div className="title-container">
        <h1>ninten</h1><h1>games</h1>
      </div>
      
      <div className="logo-container">
        <img src="/mario.png" alt="Mario" />
      </div>

      <form>
        <input type="email" placeholder="Correo Electrónico" required />
        <div className="input-password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            required
          />
          <span
            className={`eye-icon ${showPassword ? "show" : ""}`}
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={0}
            role="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              // Ícono de ojo abierto (SVG)
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5c4.89 0 9.27 3.11 11 7.5-1.73 4.39-6.11 7.5-11 7.5-4.89 0-9.27-3.11-11-7.5z" stroke="#b86868" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="#b86868" strokeWidth="2"/>
              </svg>
            ) : (
              // Ícono de ojo cerrado (SVG)
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5c4.89 0 9.27 3.11 11 7.5-1.73 4.39-6.11 7.5-11 7.5-4.89 0-9.27-3.11-11-7.5z" stroke="#b86868" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="#b86868" strokeWidth="2"/>
                <line x1="4" y1="20" x2="20" y2="4" stroke="#b86868" strokeWidth="2"/>
              </svg>
            )}
          </span>
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
