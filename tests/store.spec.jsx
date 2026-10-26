import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { ProductCard, CardImage } from "../src/components/ProductCard.jsx";
import { Catalog } from "../src/pages/Catalog.jsx";
import { Register } from "../src/pages/Register.jsx";
import { Login } from "../src/pages/Login.jsx";
import { Cart } from "../src/pages/Cart.jsx";
import { StoreApp } from "../src/App.jsx";
import { productos } from "../src/data.js";
import {
  KEYS,
  read,
  normalizeCart,
  changeCart,
  totals,
  money,
  save,
} from "../src/services/store.js";
import { validateRegistration } from "../src/services/validation.js";
import { registerUser, loginUser, getUsers } from "../src/services/auth.js";
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let host, root;
const valid = {
  fullName: "Diego Pérez",
  email: "diego@example.cl",
  emailConfirm: "diego@example.cl",
  password: "Clave123!",
  passwordConfirm: "Clave123!",
  phone: "",
  region: "Metropolitana",
  commune: "Santiago",
};
async function mount(element, path = "/") {
  await act(async () =>
    root.render(<MemoryRouter initialEntries={[path]}>{element}</MemoryRouter>),
  );
}
async function click(element) {
  await act(async () => element.click());
}
async function input(id, value) {
  await act(async () => {
    const node = host.querySelector("#" + id);
    const proto =
      node.tagName === "SELECT"
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(node, value);
    node.dispatchEvent(
      new Event(node.tagName === "SELECT" ? "change" : "input", {
        bubbles: true,
      }),
    );
  });
}
async function submit() {
  await act(async () =>
    host
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
});
describe("Lógica de tienda", () => {
  it("01 recupera JSON corrupto y almacenamiento no disponible", () => {
    localStorage.setItem("broken", "{");
    expect(read("broken", [])).toEqual([]);
    expect(
      read("x", [], {
        getItem() {
          throw Error("blocked");
        },
      }),
    ).toEqual([]);
    expect(read("missing", null)).toBeNull();
  });
  it("02 normaliza cantidades, duplicados y productos desconocidos", () => {
    const id = productos[0].id;
    expect(normalizeCart(null)).toEqual([]);
    expect(
      normalizeCart([
        null,
        { id: "x", cantidad: 1 },
        { id, cantidad: -1 },
        { id, cantidad: 1.5 },
        { id, cantidad: 3 },
        { id, cantidad: 100 },
      ]),
    ).toEqual([{ id, cantidad: 99 }]);
  });
  it("03 agrega, incrementa y elimina sin mutar el carrito anterior", () => {
    const id = productos[0].id;
    const first = changeCart([], id, 1);
    expect(changeCart(first, id, 1)).toEqual([{ id, cantidad: 2 }]);
    expect(first[0].cantidad).toBe(1);
    expect(changeCart(first, id, -1)).toEqual([]);
    expect(changeCart([], id, -1)).toEqual([]);
    expect(changeCart(first, "missing", 1)).toBe(first);
    expect(changeCart(first, id, 0.5)).toBe(first);
    expect(changeCart(first, id, 200)[0].cantidad).toBe(99);
  });
  it("04 calcula precios y descuentos con redondeo en CLP", () => {
    const cart = [{ id: productos[0].id, cantidad: 2 }];
    expect(totals(cart, " pokemon10 ")).toEqual({
      subtotal: 91980,
      discount: 9198,
      total: 82782,
    });
    expect(totals(cart, "bad").total).toBe(91980);
    expect(totals([]).total).toBe(0);
    expect(totals([{ id: "missing", cantidad: 1 }]).total).toBe(0);
    expect(money(1000)).toContain("1.000");
  });
  it("05 valida datos correctos y todos los errores del registro", () => {
    expect(validateRegistration(valid)).toEqual({});
    const invalid = {
      ...valid,
      fullName: "123",
      email: "bad",
      emailConfirm: "",
      password: "weak",
      passwordConfirm: "",
      phone: "123",
      region: "missing",
      commune: "x",
    };
    expect(Object.keys(validateRegistration(invalid)).length).toBe(8);
    expect(
      validateRegistration(valid, [{ email: valid.email }]).email,
    ).toContain("registrado");
    expect(
      validateRegistration({ ...valid, phone: "+56 9 1234 5678" }),
    ).toEqual({});
  });
});
describe("Componentes y DOM", () => {
  it("06 muestra las props de una carta y envía su id al agregar", async () => {
    const add = jasmine.createSpy("add");
    await mount(<ProductCard product={productos[0]} onAdd={add} />);
    expect(host.querySelector("h3").textContent).toBe("Charizard ex");
    await click(host.querySelector("button"));
    expect(add).toHaveBeenCalledOnceWith("charizard-ex");
  });
  it("07 reemplaza una imagen fallida por un recurso local", async () => {
    await mount(<CardImage product={productos[0]} />);
    await act(async () =>
      host.querySelector("img").dispatchEvent(new Event("error")),
    );
    expect(host.querySelector("img").getAttribute("src")).toBe(
      "./card-placeholder.svg",
    );
  });
  it("08 filtra el catálogo por nombre, tipo y muestra estado sin resultados", async () => {
    await mount(<Catalog onAdd={() => {}} />);
    expect(host.querySelectorAll("article").length).toBe(8);
    await input("search", "Charizard");
    expect(host.querySelectorAll("article").length).toBe(1);
    await input("type", "Agua");
    expect(host.querySelectorAll("article").length).toBe(0);
    expect(host.textContent).toContain("No encontramos");
  });
  it("09 impide registrar campos inválidos y enfoca el primer error", async () => {
    const register = jasmine.createSpy("register");
    await mount(<Register onRegister={register} loadUsers={() => []} />);
    await submit();
    expect(register).not.toHaveBeenCalled();
    expect(host.querySelector("#fullName").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(document.activeElement.id).toBe("fullName");
  });
  it("10 reinicia la comuna al cambiar de región", async () => {
    await mount(<Register />);
    expect(host.querySelector("#commune").disabled).toBeTrue();
    await input("region", "Metropolitana");
    await input("commune", "Santiago");
    await input("region", "Biobio");
    expect(host.querySelector("#commune").value).toBe("");
    expect(host.querySelector("#commune").textContent).toContain("Concepcion");
    expect(host.querySelector("#commune").textContent).not.toContain(
      "Santiago",
    );
  });
  it("11 registra con un servicio simulado y muestra confirmación", async () => {
    const register = jasmine.createSpy("register").and.resolveTo();
    await mount(<Register onRegister={register} loadUsers={() => []} />);
    for (const [key, value] of Object.entries(valid)) await input(key, value);
    await submit();
    expect(register).toHaveBeenCalledOnceWith(valid);
    expect(host.textContent).toContain("Cuenta creada");
    expect(host.querySelector("#fullName").value).toBe("");
  });
  it("12 muestra el fallo del servicio de registro sin perder los datos", async () => {
    await mount(
      <Register
        onRegister={() => Promise.reject(Error("No se pudo guardar"))}
        loadUsers={() => []}
      />,
    );
    for (const [key, value] of Object.entries(valid)) await input(key, value);
    await submit();
    expect(host.textContent).toContain("No se pudo guardar");
    expect(host.querySelector("#email").value).toBe(valid.email);
  });
  it("13 valida el login, rechaza credenciales y luego inicia sesión", async () => {
    const session = jasmine.createSpy("session"),
      auth = jasmine
        .createSpy("auth")
        .and.rejectWith(Error("Credenciales incorrectas"));
    await mount(<Login onSession={session} authenticate={auth} />);
    await submit();
    expect(auth).not.toHaveBeenCalled();
    await input("loginEmail", valid.email);
    await input("loginPassword", valid.password);
    await submit();
    expect(host.textContent).toContain("Credenciales incorrectas");
    expect(session).not.toHaveBeenCalled();
    auth.and.resolveTo({ email: valid.email, fullName: valid.fullName });
    await submit();
    expect(session).toHaveBeenCalledOnceWith({
      email: valid.email,
      fullName: valid.fullName,
    });
  });
  it("14 envía las acciones de cantidad y eliminación del carrito", async () => {
    const change = jasmine.createSpy("change");
    await mount(
      <Cart
        cart={[{ id: "charizard-ex", cantidad: 2 }]}
        onChange={change}
        onCheckout={() => {}}
      />,
    );
    const buttons = host.querySelectorAll(".quantity button");
    await click(buttons[0]);
    await click(buttons[1]);
    await click(host.querySelector('[aria-label="Eliminar Charizard ex"]'));
    expect(change.calls.allArgs()).toEqual([
      ["charizard-ex", -1],
      ["charizard-ex", 1],
      ["charizard-ex", -2],
    ]);
  });
  it("15 aplica y revoca el descuento en el total del DOM", async () => {
    await mount(
      <Cart
        cart={[{ id: "charizard-ex", cantidad: 1 }]}
        onChange={() => {}}
        onCheckout={() => {}}
      />,
    );
    await input("coupon", "POKEMON10");
    await submit();
    expect(host.querySelector('[data-testid="total"]').textContent).toBe(
      money(41391),
    );
    await input("coupon", "bad");
    await submit();
    expect(host.querySelector('[data-testid="total"]').textContent).toBe(
      money(45990),
    );
    expect(host.textContent).toContain("Cupón inválido");
  });
  it("16 conserva el recibo visible después de vaciar el carrito", async () => {
    let setter;
    function Harness() {
      const [cart, setCart] = React.useState([
        { id: "charizard-ex", cantidad: 1 },
      ]);
      setter = setCart;
      return (
        <Cart cart={cart} onChange={() => {}} onCheckout={() => setter([])} />
      );
    }
    await mount(<Harness />);
    await click(
      [...host.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Confirmar compra"),
      ),
    );
    expect(host.textContent).toContain("Compra de demostración confirmada");
    expect(host.textContent).toContain("Tu carrito está vacío");
    expect(host.textContent).toContain(money(45990));
  });
  it("17 muestra un error de compra y mantiene el carrito", async () => {
    await mount(
      <Cart
        cart={[{ id: "charizard-ex", cantidad: 1 }]}
        onChange={() => {}}
        onCheckout={() => {
          throw Error("Almacenamiento lleno");
        }}
      />,
    );
    await click(
      [...host.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Confirmar compra"),
      ),
    );
    expect(host.textContent).toContain("Almacenamiento lleno");
    expect(host.querySelectorAll("article").length).toBe(1);
  });
  it("18 actualiza contador, persistencia y navegación al comprar", async () => {
    await mount(<StoreApp />);
    await click(
      host.querySelector('[aria-label="Agregar Charizard ex al carrito"]'),
    );
    expect(read(KEYS.cart, [])).toEqual([{ id: "charizard-ex", cantidad: 1 }]);
    await click(host.querySelector('[aria-label="Carrito, 1 unidades"]'));
    expect(host.querySelector("h1").textContent).toBe("Tu carrito");
    await click(
      [...host.querySelectorAll("button")].find((b) =>
        b.textContent.includes("Confirmar compra"),
      ),
    );
    expect(read(KEYS.cart, [])).toEqual([]);
    expect(
      host.querySelector('[aria-label="Carrito, 0 unidades"]'),
    ).not.toBeNull();
  });
  it("19 permite abrir el menú móvil y cerrar una sesión existente", async () => {
    save(
      KEYS.session,
      { email: valid.email, fullName: valid.fullName },
      sessionStorage,
    );
    await mount(<StoreApp />);
    await click(host.querySelector('[aria-label="Abrir menú"]'));
    expect(
      host.querySelector("#navigation").classList.contains("show"),
    ).toBeTrue();
    await click(
      [...host.querySelectorAll("button")].find(
        (b) => b.textContent === "Cerrar sesión",
      ),
    );
    expect(sessionStorage.getItem(KEYS.session)).toBeNull();
    expect(host.textContent).toContain("Iniciar sesión");
    await click(host.querySelector('[aria-label="Cerrar aviso"]'));
    expect(host.querySelector(".notice").textContent).toBe("");
  });
  it("20 muestra errores de persistencia sin modificar contador ni carrito", async () => {
    spyOn(Storage.prototype, "setItem").and.throwError("blocked");
    await mount(<StoreApp />);
    await click(
      host.querySelector('[aria-label="Agregar Charizard ex al carrito"]'),
    );
    expect(host.textContent).toContain("No se pudo guardar");
    expect(
      host.querySelector('[aria-label="Carrito, 0 unidades"]'),
    ).not.toBeNull();
  });
});
describe("Autenticación local", () => {
  it("21 almacena un hash, rechaza duplicados y comprueba las credenciales", async () => {
    await registerUser(valid);
    const users = getUsers();
    expect(users.length).toBe(1);
    expect(users[0].password).toBeUndefined();
    expect(users[0].passwordHash).not.toContain(valid.password);
    expect(users[0].salt.length).toBe(16);
    await expectAsync(registerUser(valid)).toBeRejectedWithError(
      "Este correo ya está registrado.",
    );
    await expectAsync(loginUser(valid.email, "wrong")).toBeRejected();
    await expectAsync(loginUser("missing@example.cl", "wrong")).toBeRejected();
    const session = await loginUser(valid.email, valid.password);
    expect(session).toEqual({ email: valid.email, fullName: valid.fullName });
    expect(read(KEYS.session, null, sessionStorage)).toEqual(session);
  });
  it("22 ignora un formato inválido del almacenamiento de usuarios", () => {
    save(KEYS.users, {});
    expect(getUsers()).toEqual([]);
  });
});
