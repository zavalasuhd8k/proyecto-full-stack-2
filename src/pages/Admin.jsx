import React, { useState } from "react";
import { Link } from "react-router-dom";
import { money, KEYS } from "../services/store.js";
import { BrandLogo } from "../components/BrandLogo.jsx";

const EMPTY = { nombre: "", tipo: "", atributo: "", descripcion: "", precio: "", imagen: "" };
const validImage = (value) => !value || /^https:\/\//i.test(value) || /^\.\//.test(value);

export function Admin({ products, onSave, onDelete, onLogout }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(KEYS.admin) === "1");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  function login(event) {
    event.preventDefault();
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!adminUsername || !adminPassword) {
      setError("Acceso no configurado. Revisa las instrucciones del README.");
      return;
    }
    if (credentials.username.trim().toUpperCase() !== adminUsername.trim().toUpperCase() || credentials.password !== adminPassword) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    sessionStorage.setItem(KEYS.admin, "1");
    setAuthenticated(true);
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    const price = Number(form.precio);
    if (!form.nombre.trim() || !form.tipo.trim() || !form.atributo.trim() || !form.descripcion.trim() || !Number.isSafeInteger(price) || price < 1 || !validImage(form.imagen.trim())) {
      setMessage("Completa los campos y usa un precio entero mayor que cero. La imagen debe ser HTTPS o una ruta local.");
      return;
    }
    const product = { ...form, id: editing || `carta-${Date.now().toString(36)}`, nombre: form.nombre.trim(), tipo: form.tipo.trim(), atributo: form.atributo.trim(), descripcion: form.descripcion.trim(), precio: price, imagen: form.imagen.trim() };
    onSave(product);
    setForm(EMPTY);
    setEditing(null);
    setMessage(editing ? "Carta actualizada." : "Carta agregada al catálogo.");
  }

  function edit(product) {
    setEditing(product.id);
    setForm({ nombre: product.nombre, tipo: product.tipo, atributo: product.atributo, descripcion: product.descripcion, precio: String(product.precio), imagen: product.imagen });
    setMessage("");
    document.getElementById("product-name")?.focus();
  }

  if (!authenticated) return (
    <section className="container py-5">
      <div className="auth-card auth-card-small p-4 p-md-5 mx-auto">
        <BrandLogo className="brand-logo-auth mb-4" />
        <p className="eyebrow">ACCESO RESTRINGIDO</p>
        <h1 className="h2">Administración</h1>
        <p className="text-secondary">Ingresa con las credenciales de administrador.</p>
        <form onSubmit={login}>
          <label className="form-label" htmlFor="admin-user">Usuario</label>
          <input className="form-control mb-3" id="admin-user" autoComplete="username" required value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
          <label className="form-label" htmlFor="admin-password">Contraseña</label>
          <input className="form-control mb-3" id="admin-password" type="password" autoComplete="current-password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
          {error && <p className="text-danger" role="alert">{error}</p>}
          <button className="btn btn-dark w-100">Entrar al panel</button>
        </form>
      </div>
    </section>
  );

  return <section className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div><p className="eyebrow mb-1">GESTIÓN DE LA TIENDA</p><h1 className="mb-0">Panel de administración</h1></div>
      <button className="btn btn-outline-dark" onClick={onLogout}>Cerrar sesión</button>
    </div>
    <div className="row g-4">
      <div className="col-lg-5">
        <form className="summary p-4" onSubmit={submit}>
          <h2 className="h4">{editing ? "Editar carta" : "Agregar carta"}</h2>
          <label className="form-label" htmlFor="product-name">Nombre</label><input className="form-control mb-3" id="product-name" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <label className="form-label" htmlFor="product-type">Tipo</label><input className="form-control mb-3" id="product-type" required value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
          <label className="form-label" htmlFor="product-attribute">Atributo</label><input className="form-control mb-3" id="product-attribute" placeholder="Carta ex - HP 310" required value={form.atributo} onChange={(e) => setForm({ ...form, atributo: e.target.value })} />
          <label className="form-label" htmlFor="product-description">Descripción</label><textarea className="form-control mb-3" id="product-description" rows="3" required value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <label className="form-label" htmlFor="product-price">Precio (CLP)</label><input className="form-control mb-3" id="product-price" type="number" min="1" step="1" required value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} />
          <label className="form-label" htmlFor="product-image">Imagen (URL HTTPS o ruta local)</label><input className="form-control mb-3" id="product-image" type="text" placeholder="https://…" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} />
          {message && <p role="status" className="small">{message}</p>}
          <div className="d-flex gap-2"><button className="btn btn-brand flex-grow-1">{editing ? "Guardar cambios" : "Agregar al catálogo"}</button>{editing && <button type="button" className="btn btn-outline-dark" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancelar</button>}</div>
        </form>
      </div>
      <div className="col-lg-7">
        <div className="summary p-4"><div className="d-flex justify-content-between align-items-center mb-3"><h2 className="h4 mb-0">Catálogo</h2><span className="badge text-bg-light">{products.length} cartas</span></div>
          {products.length === 0 ? <p className="text-secondary">No hay cartas en el catálogo.</p> : <div className="d-grid gap-3">{products.map((product) => <article className="admin-product" key={product.id}><div className="flex-grow-1"><strong>{product.nombre}</strong><div className="small text-secondary">{product.tipo} · {money(product.precio)}</div></div><button className="btn btn-sm btn-outline-dark" onClick={() => edit(product)}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => { onDelete(product.id); if (editing === product.id) { setEditing(null); setForm(EMPTY); } setMessage(`${product.nombre} eliminado del catálogo.`); }}>Eliminar</button></article>)}</div>}
        </div>
      </div>
    </div>
    <Link className="d-inline-block mt-4" to="/">← Volver a la tienda</Link>
  </section>;
}
