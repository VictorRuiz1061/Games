"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function EyeIcon({ show }) {
  return show ? (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5c4.89 0 9.27 3.11 11 7.5-1.73 4.39-6.11 7.5-11 7.5-4.89 0-9.27-3.11-11-7.5z"
        stroke="#b86868" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="#b86868" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path d="M1 12C2.73 7.61 7.11 4.5 12 4.5c4.89 0 9.27 3.11 11 7.5-1.73 4.39-6.11 7.5-11 7.5-4.89 0-9.27-3.11-11-7.5z"
        stroke="#b86868" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="#b86868" strokeWidth="2" />
      <line x1="4" y1="20" x2="20" y2="4" stroke="#b86868" strokeWidth="2" />
    </svg>
  );
}

function PasswordInput({ value, onChange, show, toggle }) {
  return (
    <div className="input-password-container">
      <input
        type={show ? "text" : "password"}
        name="password"
        placeholder="Contraseña"
        value={value}
        onChange={onChange}
        required
      />
      <span
        className={`eye-icon ${show ? "show" : ""}`}
        onClick={toggle}
        tabIndex={0}
        role="button"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        <EyeIcon show={show} />
      </span>
    </div>
  );
}

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = `/api/auth/${isRegister ? "register" : "login"}`;
      const body = isRegister ? formData : {
        email: formData.email,
        password: formData.password
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en la solicitud");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/games");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inicio-sesion">
      <div className="title-container">
        <h1>ninten</h1>
        <h1>games</h1>
      </div>

      <div className="logo-container">
        <img src="/mario.png" alt="Mario" />
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {isRegister && (
          <input
            type="text"
            name="fullname"
            placeholder="Nombre Completo"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          show={showPassword}
          toggle={() => setShowPassword((v) => !v)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>

    </div>
  );
}
