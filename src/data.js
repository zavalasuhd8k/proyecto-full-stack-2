const storeProduct = (id, nombre, precio, imagen) => ({
  id,
  nombre,
  tipo: "Pokémon TCG",
  atributo: "Carta individual · Pokémon TCG",
  descripcion: "Single Pokémon TCG de la colección de Culto Chamán.",
  precio,
  imagen: `./products/${imagen}.webp`,
});

export const productos = [
  storeProduct("meowth-ex", "Meowth ex - 062/088", 10000, "meowth-ex"),
  storeProduct("team-rockets-petrel", "Team Rocket's Petrel - 176/182", 1000, "team-rockets-petrel"),
  storeProduct("jamming-tower", "Jamming Tower", 500, "jamming-tower"),
  storeProduct("hyper-aroma", "Hyper Aroma (español)", 1000, "hyper-aroma"),
  storeProduct("ultra-ball", "Ultra Ball", 500, "ultra-ball"),
  storeProduct("glass-trumpet", "Glass Trumpet", 300, "glass-trumpet"),
  storeProduct("judge", "Judge - 167/182", 500, "judge"),
  storeProduct("crispin", "Crispin - 105/131", 500, "crispin"),
  storeProduct("cyrano", "Cyrano - 170/191", 1200, "cyrano"),
  storeProduct("mega-lucario-ex", "Mega Lucario ex - 077/132 (español)", 4000, "mega-lucario-ex"),
  storeProduct("latias-ex", "Latias ex - 076/191", 8000, "latias-ex"),
  storeProduct("raging-bolt-ex", "Raging Bolt ex - 123/162", 4000, "raging-bolt-ex"),
  storeProduct("fezandipiti-ex", "Fezandipiti ex - 038/064 (español)", 7000, "fezandipiti-ex"),
  storeProduct("teal-mask-ogerpon-ex", "Teal Mask Ogerpon ex - 012/131", 6000, "teal-mask-ogerpon-ex"),
  storeProduct("wellspring-mask-ogerpon-ex", "Wellspring Mask Ogerpon ex - 027/131", 2500, "wellspring-mask-ogerpon-ex"),
];

export const regiones = {
  Metropolitana: ["Santiago", "Providencia", "Maipu"],
  Valparaiso: ["Valparaiso", "Vina del Mar", "Quilpue"],
  Biobio: ["Concepcion", "Talcahuano", "Los Angeles"],
};
