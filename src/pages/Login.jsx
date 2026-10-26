import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../components/Field.jsx";
import { emailValid } from "../services/validation.js";
import { loginUser } from "../services/auth.js";
import { BrandLogo } from "../components/BrandLogo.jsx";
export function Login({ onSession, authenticate = loginUser }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [errors, setErrors] = useState({}),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    setStatus("");
    const next = {};
    if (!emailValid(email)) next.loginEmail = "Ingresa un correo válido.";
    if (!password) next.loginPassword = "Ingresa tu contraseña.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    setBusy(true);
    try {
      onSession(await authenticate(email, password));
      navigate("/");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="container py-5">
      <div className="auth-card auth-card-small mx-auto p-4 p-md-5">
        <BrandLogo className="brand-logo-auth mb-4" />
        <p className="eyebrow">DE VUELTA AL JUEGO</p>
        <h1 className="h2">Inicia sesión</h1>
        <p className="text-secondary">Qué bueno tenerte por aquí.</p>
        {status && (
          <p className="alert alert-danger" role="alert">
            {status}
          </p>
        )}
        <form onSubmit={submit} noValidate aria-label="Inicio de sesión">
          <Field
            id="loginEmail"
            label="Correo"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.loginEmail}
            required
          />
          <Field
            id="loginPassword"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.loginPassword}
            required
          />
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
        <p className="small text-secondary mt-4 mb-0">
          ¿Primera visita? <Link to="/registro">Crea tu cuenta</Link>
        </p>
      </div>
    </section>
  );
}
