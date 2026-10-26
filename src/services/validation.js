import { regiones } from "../data.js";
export const emailValid = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export function validateRegistration(values, users = []) {
  const errors = {};
  const email = values.email.trim().toLowerCase();
  if (!/^[\p{L} ]{2,50}$/u.test(values.fullName.trim()))
    errors.fullName = "Ingresa un nombre de 2 a 50 letras y espacios.";
  if (!emailValid(email)) errors.email = "Ingresa un correo válido.";
  else if (users.some((user) => user.email === email))
    errors.email = "Este correo ya está registrado.";
  if (
    email !== values.emailConfirm.trim().toLowerCase() ||
    !values.emailConfirm
  )
    errors.emailConfirm = "Los correos deben coincidir.";
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,128}$/.test(
      values.password,
    )
  )
    errors.password =
      "Usa de 8 a 128 caracteres, mayúscula, minúscula, número y símbolo.";
  if (values.password !== values.passwordConfirm || !values.passwordConfirm)
    errors.passwordConfirm = "Las contraseñas deben coincidir.";
  if (
    values.phone.trim() &&
    !/^(\+56\s?9\s?\d{4}\s?\d{4}|9\d{8})$/.test(values.phone.trim())
  )
    errors.phone = "Usa un móvil chileno: +56 9 1234 5678.";
  if (!Object.hasOwn(regiones, values.region))
    errors.region = "Selecciona una región disponible.";
  if (!regiones[values.region]?.includes(values.commune))
    errors.commune = "Selecciona una comuna de la región.";
  return errors;
}
