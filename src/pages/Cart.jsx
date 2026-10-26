import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, money, totals } from "../services/store.js";
import { CardImage } from "../components/ProductCard.jsx";
export function Cart({ cart, onChange }) {
  const [coupon, setCoupon] = useState(""),
    [applied, setApplied] = useState(""),
    [message, setMessage] = useState("");
  const amounts = totals(cart, applied);
  function apply(event) {
    event.preventDefault();
    const valid = coupon.trim().toUpperCase() === "POKEMON10";
    setApplied(valid ? "POKEMON10" : "");
    setMessage(
      valid
        ? "Cupón aplicado: 10% de descuento."
        : "Cupón inválido. Verifica el código.",
    );
  }
  return (
    <section className="container py-5">
      <p className="eyebrow">A UN PASO DE TU COLECCIÓN</p>
      <h1 className="mb-4">Tu carrito</h1>
      {!cart.length ? (
        <div className="empty-state">
          <h2 className="h4">Tu carrito está vacío</h2>
          <p className="text-secondary">
            Hay una carta esperando ser parte de tu colección.
          </p>
          <Link className="btn btn-brand" to="/">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-grid gap-3">
              {cart.map((item) => {
                const product = getProducts().find((p) => p.id === item.id);
                if (!product) return null;
                return (
                  <article className="cart-item p-3" key={item.id}>
                    <CardImage product={product} />
                    <div className="flex-grow-1">
                      <h2 className="h5">{product.nombre}</h2>
                      <p className="small text-secondary">
                        {money(product.precio)} por unidad
                      </p>
                      <strong>{money(product.precio * item.cantidad)}</strong>
                      <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                        <div
                          className="quantity"
                          role="group"
                          aria-label={`Cantidad de ${product.nombre}`}
                        >
                          <button
                            className="btn"
                            aria-label={`Disminuir ${product.nombre}`}
                            onClick={() => onChange(item.id, -1)}
                          >
                            −
                          </button>
                          <span aria-live="polite">{item.cantidad}</span>
                          <button
                            className="btn"
                            aria-label={`Aumentar ${product.nombre}`}
                            disabled={item.cantidad >= 99}
                            onClick={() => onChange(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-sm text-danger"
                          aria-label={`Eliminar ${product.nombre}`}
                          onClick={() => onChange(item.id, -item.cantidad)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link to="/" className="d-inline-block mt-4">
              ← Seguir explorando
            </Link>
          </div>
          <aside className="col-lg-4">
            <div className="summary p-4">
              <h2 className="h4 mb-3">Resumen de compra</h2>
              <div className="summary-line">
                <span>Subtotal</span>
                <strong>{money(amounts.subtotal)}</strong>
              </div>
              <div className="summary-line">
                <span>Descuento</span>
                <strong>−{money(amounts.discount)}</strong>
              </div>
              <div className="summary-line fs-5">
                <span>Total</span>
                <strong data-testid="total">{money(amounts.total)}</strong>
              </div>
              <form className="my-4" onSubmit={apply}>
                <label htmlFor="coupon" className="form-label">
                  ¿Tienes un cupón?
                </label>
                <div className="input-group">
                  <input
                    className="form-control"
                    id="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="POKEMON10"
                  />
                  <button className="btn btn-dark">Aplicar</button>
                </div>
              </form>
              <p className="small" role="status">
                {message}
              </p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
