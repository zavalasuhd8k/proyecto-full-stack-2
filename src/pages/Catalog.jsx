import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard.jsx";

export function Catalog({ onAdd, products = [] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const visible = products
    .filter((product) => product.nombre.toLowerCase().includes(query.toLowerCase().trim()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.precio - b.precio;
      if (sort === "price-desc") return b.precio - a.precio;
      if (sort === "name") return a.nombre.localeCompare(b.nombre, "es");
      return products.indexOf(a) - products.indexOf(b);
    });

  return (
    <>
      <section className="collection-heading container pt-4 pb-3">
        <nav aria-label="Migas de pan" className="small text-secondary mb-3">
          <Link to="/">Inicio</Link><span className="mx-2">/</span><span>Pokémon TCG</span>
        </nav>
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
          <div>
            <p className="eyebrow mb-1">CARTAS INDIVIDUALES</p>
            <h1 className="collection-title mb-1">Singles Pokémon TCG</h1>
            <p className="text-secondary mb-0">Cartas seleccionadas para completar tu colección y tus mazos.</p>
          </div>
        </div>
      </section>
      <section id="catalogo" className="container pb-5" aria-label="Catálogo de singles Pokémon TCG">
        <div className="collection-toolbar d-flex flex-wrap justify-content-between align-items-center gap-3 py-3 mb-3">
          <p className="small text-secondary mb-0" aria-live="polite">{visible.length} productos</p>
          <div className="d-flex flex-wrap gap-2 filters">
            <div>
              <label className="visually-hidden" htmlFor="search">Buscar cartas</label>
              <input className="form-control" id="search" type="search" placeholder="Buscar en Pokémon TCG" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <div>
              <label className="visually-hidden" htmlFor="sort">Ordenar productos</label>
              <select className="form-select" id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Ordenar: destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre: A a Z</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row g-3 g-md-4">
          {visible.map((product) => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <ProductCard product={product} onAdd={onAdd} />
            </div>
          ))}
        </div>
        {!visible.length && <p className="empty-state" role="status">No encontramos cartas con esa búsqueda. Prueba con otro nombre.</p>}
      </section>
    </>
  );
}
