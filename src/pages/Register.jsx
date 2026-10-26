import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "../components/Field.jsx";
import { regiones } from "../data.js";
import { validateRegistration } from "../services/validation.js";
import { getUsers, registerUser } from "../services/auth.js";
import { BrandLogo } from "../components/BrandLogo.jsx";
const empty = {
  fullName: "",
  email: "",
  emailConfirm: "",
  password: "",
  passwordConfirm: "",
  phone: "",
  region: "",
  commune: "",
};
export function Register({ onRegister = registerUser, loadUsers = getUsers }) {
  const [values, setValues] = useState(empty),
    [errors, setErrors] = useState({}),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [success, setSuccess] = useState(false);
  function change(key, value) {
    setSuccess(false);
    setValues((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "region" ? { commune: "" } : {}),
    }));
    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
      ...(key === "region" ? { commune: undefined } : {}),
    }));
  }
  async function submit(event) {
    event.preventDefault();
    setStatus("");
    setSuccess(false);
    const next = validateRegistration(values, loadUsers());
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    setBusy(true);
    try {
      await onRegister(values);
      setSuccess(true);
      setValues(empty);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }
  const bind = (key) => ({
    value: values[key],
    onChange: (event) => change(key, event.target.value),
    error: errors[key],
  });
  return (
    <section className="container py-5">
      <div className="auth-card mx-auto p-4 p-md-5">
        <BrandLogo className="brand-logo-auth mb-4" />
        <p className="eyebrow">BIENVENIDO A LA COMUNIDAD</p>
        <h1 className="h2">Crea tu cuenta</h1>
        <p className="text-secondary">Tu próxima colección empieza aquí.</p>
        {success && (
          <p className="alert alert-success" role="status">
            Cuenta creada.{" "}
            <Link to="/login">Inicia sesión para continuar.</Link>
          </p>
        )}
        {status && (
          <p className="alert alert-danger" role="alert">
            {status}
          </p>
        )}
        <form onSubmit={submit} noValidate aria-label="Registro de usuario">
          <Field
            id="fullName"
            label="Nombre completo"
            autoComplete="name"
            maxLength={50}
            required
            {...bind("fullName")}
          />
          <div className="row">
            <div className="col-md-6">
              <Field
                id="email"
                label="Correo"
                type="email"
                autoComplete="email"
                required
                {...bind("email")}
              />
            </div>
            <div className="col-md-6">
              <Field
                id="emailConfirm"
                label="Confirmar correo"
                type="email"
                required
                {...bind("emailConfirm")}
              />
            </div>
          </div>
          <Field
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            maxLength={128}
            required
            hint="De 8 a 128 caracteres, mayúscula, minúscula, número y símbolo."
            {...bind("password")}
          />
          <Field
            id="passwordConfirm"
            label="Confirmar contraseña"
            type="password"
            autoComplete="new-password"
            required
            {...bind("passwordConfirm")}
          />
          <Field
            id="phone"
            label="Teléfono (opcional)"
            type="tel"
            autoComplete="tel"
            hint="Ejemplo: +56 9 1234 5678"
            {...bind("phone")}
          />
          <div className="row">
            <div className="col-md-6">
              <Field
                id="region"
                label="Región"
                error={errors.region}
                hint="Selecciona tu región para ver las comunas disponibles."
              >
                <select
                  value={values.region}
                  onChange={(e) => change("region", e.target.value)}
                  required
                >
                  <option value="">Selecciona una región</option>
                  {Object.keys(regiones).map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="col-md-6">
              <Field id="commune" label="Comuna" error={errors.commune}>
                <select
                  value={values.commune}
                  onChange={(e) => change("commune", e.target.value)}
                  disabled={!values.region}
                  required
                >
                  <option value="">Selecciona una comuna</option>
                  {(regiones[values.region] || []).map((commune) => (
                    <option key={commune}>{commune}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
          <button className="btn btn-brand w-100" disabled={busy}>
            {busy ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>
        <p className="small text-secondary mt-4 mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}
