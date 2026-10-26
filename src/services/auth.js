import { KEYS, read, save } from "./store.js";
// Demostración local: PBKDF2 evita guardar la contraseña como texto plano.
// La autenticación y autorización reales deben implementarse en un servidor.
async function derive(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
export const getUsers = () => {
  const users = read(KEYS.users, []);
  return Array.isArray(users) ? users : [];
};
export async function registerUser(values) {
  const users = getUsers();
  const email = values.email.trim().toLowerCase();
  if (users.some((user) => user.email === email))
    throw new Error("Este correo ya está registrado.");
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await derive(values.password, salt);
  const user = {
    fullName: values.fullName.trim(),
    email,
    phone: values.phone.trim(),
    region: values.region,
    commune: values.commune,
    salt,
    passwordHash,
  };
  // Se vuelve a leer tras el cálculo asíncrono para conservar altas recientes.
  const latest = getUsers();
  if (latest.some((user) => user.email === email))
    throw new Error("Este correo ya está registrado.");
  save(KEYS.users, [...latest, user]);
}
export async function loginUser(email, password) {
  const user = getUsers().find(
    (user) => user.email === email.trim().toLowerCase(),
  );
  if (!user || (await derive(password, user.salt)) !== user.passwordHash)
    throw new Error("Correo o contraseña incorrectos.");
  const session = { email: user.email, fullName: user.fullName };
  save(KEYS.session, session, sessionStorage);
  return session;
}
