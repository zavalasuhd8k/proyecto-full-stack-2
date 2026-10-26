import { productos } from "../data.js";
export const KEYS = {
  cart: "pikacart_cart",
  users: "cultochaman_users_v2",
  session: "cultochaman_session_v2",
  products: "cultochaman_products_v2",
  admin: "cultochaman_admin_session_v1",
};
export function getProducts() {
  const saved = read(KEYS.products, null);
  return Array.isArray(saved) ? saved : productos;
}
export const money = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
export function read(key, fallback, storage = localStorage) {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
export function save(key, value, storage = localStorage) {
  storage.setItem(key, JSON.stringify(value));
}
export function normalizeCart(cart) {
  if (!Array.isArray(cart)) return [];
  const result = [];
  for (const item of cart) {
    if (
      !item ||
      !getProducts().some((p) => p.id === item.id) ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad <= 0
    )
      continue;
    const previous = result.find((p) => p.id === item.id);
    if (previous)
      previous.cantidad = Math.min(99, previous.cantidad + item.cantidad);
    else result.push({ id: item.id, cantidad: Math.min(99, item.cantidad) });
  }
  return result;
}
export function changeCart(cart, id, delta) {
  if (!getProducts().some((p) => p.id === id) || !Number.isInteger(delta))
    return cart;
  const current = cart.find((item) => item.id === id);
  if (!current)
    return delta > 0 ? [...cart, { id, cantidad: Math.min(99, delta) }] : cart;
  return cart
    .map((item) =>
      item.id === id
        ? { ...item, cantidad: Math.min(99, item.cantidad + delta) }
        : item,
    )
    .filter((item) => item.cantidad > 0);
}
export function totals(cart, code = "") {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (getProducts().find((p) => p.id === item.id)?.precio || 0) * item.cantidad,
    0,
  );
  const discount =
    code.trim().toUpperCase() === "POKEMON10" ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount };
}
