import React from "react";
import { money } from "../services/store.js";
export function CardImage({ product, ...props }) {
  return (
    <img
      {...props}
      src={product.imagen}
      alt={`Carta Pokémon ${product.nombre}`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "./card-placeholder.svg";
      }}
    />
  );
}
export function ProductCard({ product, onAdd }) {
  return (
    <article className="card product-card h-100">
      <div className="card-art">
        <CardImage product={product} />
      </div>
      <div className="card-body d-flex flex-column">
        <span className="type-badge align-self-start">{product.tipo}</span>
        <h3 className="h5 mt-3">{product.nombre}</h3>
        <p className="small text-secondary">{product.atributo}</p>
        <p className="small text-secondary flex-grow-1">
          {product.descripcion}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong className="fs-5">{money(product.precio)}</strong>
          <span className="small text-secondary">CLP</span>
        </div>
        <button
          className="btn btn-brand w-100"
          onClick={() => onAdd(product.id)}
          aria-label={`Añadir ${product.nombre} al carrito`}
        >
          + Añadir
        </button>
      </div>
    </article>
  );
}
