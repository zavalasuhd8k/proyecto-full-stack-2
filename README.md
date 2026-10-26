# Culto Chamán TCG Store

Frontend de cartas Pokémon TCG actualizado para DSY1104, Evaluación Parcial 2: React, React Router, Bootstrap, Jasmine y Karma.

## Ejecutar

Requiere Node.js 20+ (recomendado 22), npm y Chrome para pruebas. En Windows se detecta Chrome o Edge; en otros entornos define CHROME_BIN si hace falta.

```sh
npm ci
npm run dev
```

Abre http://127.0.0.1:5173. Para verificar y generar la entrega:

```sh
npm test
npm run build
```

Publica el contenido de dist/ en un servidor estático. Las rutas hash funcionan sin reescritura y en subdirectorios. La compilación conserva redirecciones para login.html, registro.html y carrito.html. El index.html raíz es una plantilla: no se abre directamente sin compilar.

## Funcionalidades

- Quince singles Pokémon TCG tomados de la colección pública de Culto Chamán; búsqueda por nombre y orden por precio o nombre.
- Carrito compartido y persistente, contador, cantidades de 1 a 99 y eliminación.
- Cupón POKEMON10, importes CLP y recibo visible después de comprar.
- Registro validado, correo único, confirmaciones, teléfono opcional y región/comuna dependientes.
- Inicio/cierre de sesión, errores accesibles y formularios controlados por React.
- Panel local de administración en `/#/admin` (también disponible como `admin.html`): permite crear, editar y eliminar cartas del catálogo. Para habilitarlo localmente, copia `.env.example` a `.env.local` y configura `VITE_ADMIN_USERNAME` y `VITE_ADMIN_PASSWORD`.
- Cuadrícula Bootstrap de una, dos o cuatro columnas y menú móvil controlado por estado.
- Logo Culto Chamán con fondo transparente en navegación, pie de página e inicio de sesión/registro; estilo inspirado en la tienda en vivo con Inter, Bebas Neue, azul oscuro y verde.

## Estructura

- src/App.jsx: navegación, Header, footer, carrito y sesión compartidos.
- src/components/: Field, ProductCard y CardImage reutilizables mediante props.
- src/pages/: Catalog, Register, Login y Cart; estado local de formularios y filtros.
- src/services/: validación, almacenamiento, carrito y autenticación de demostración.
- tests/store.spec.jsx: 22 pruebas de lógica, DOM y flujos.
- scripts/: compilación e instrumentación de cobertura con esbuild e Istanbul.
- docs/: ERS, informe de testing y guía de defensa.
- .github/workflows/ci.yml: build y pruebas por push/PR; entrega reporte como artifact.

StoreApp mantiene el estado compartido con useState y entrega datos/callbacks mediante props. Los servicios de validación y carrito son independientes del DOM. Las pruebas montan los componentes reales con createRoot y act, usan spies de Jasmine y servicios inyectables. El reporte HTML y JSON se genera en coverage/. Se exige un 90% global por métrica.

## Alcance

Demostración académica frontend, sin backend, cobros ni despachos. PBKDF2 con sal evita guardar las contraseñas de clientes en texto plano, pero la información local es manipulable y no constituye autenticación segura de producción. Las variables `VITE_ADMIN_USERNAME` y `VITE_ADMIN_PASSWORD` se incorporan al JavaScript que recibe el navegador cuando se compila; sirven solo para una demostración local y no protegen un sitio publicado. Para producción, mueve autenticación y autorización a un servidor. No publiques `.env.local`. Web Crypto requiere localhost o HTTPS. El catálogo, las cuentas y el carrito permanecen en el navegador. La sesión dura en la pestaña. El cupón solo dura mientras la vista del carrito permanece montada.

Las regiones son una muestra: Metropolitana, Valparaíso y Biobío con tres comunas cada una. Las imágenes requieren conexión y disponen de un reemplazo SVG local. JS y CSS se sirven localmente. Los precios son ficticios y no hay control real de stock.

## Documentación

- [ERS y trazabilidad](docs/ERS.md)
- [Cobertura, resultados y límites](docs/COBERTURA_TESTING.md)
- [Guía de defensa individual](docs/GUIA_PRESENTACION.md)

Origen: https://github.com/ExorM42/CultoChamanTCGFullStack. Los cambios de esta copia son locales; el enlace público reflejará la actualización cuando su propietario los suba. Completa autoría, sección y docente antes de entregar. CI está configurado; no se afirma una ejecución remota previa a publicar.

Referencias: [React](https://react.dev/learn), [Bootstrap](https://getbootstrap.com/docs/5.3/layout/grid/), [Jasmine](https://jasmine.github.io/), [Karma](https://karma-runner.github.io/6.4/config/configuration-file.html). Datos e imágenes: [Pokémon TCG Developers](https://github.com/PokemonTCG/pokemon-tcg-data). Pokémon pertenece a sus titulares.
