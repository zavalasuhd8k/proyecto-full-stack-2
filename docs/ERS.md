# Especificación de Requisitos de Software

Proyecto: Culto Chamán TCG Store. Versión 2.0. Fecha: 16 de octubre de 2026. Asignatura: DSY1104, Desarrollo Fullstack II. Evaluación Parcial 2.

Autoría académica: completar integrantes, sección y docente antes de entregar. Este documento describe la propuesta implementada; la defensa individual debe realizarla cada estudiante.

## Propósito y propuesta personalizada

Tienda para jugadores y coleccionistas de cartas individuales Pokémon TCG, con identidad visual propia, precios CLP, filtros y compra de demostración. Conserva la temática y ocho productos del proyecto inicial. Reemplaza las páginas y script global por componentes React, incorpora Bootstrap y un proceso de pruebas verificable.

Actores: visitante (catálogo, carrito y registro), usuario registrado (inicio/cierre de sesión local) y estudiante/evaluador (ejecución y verificación). No se exige sesión para la compra simulada. Quedan fuera backend, pagos, stock real, logística y administración.

## Requisitos funcionales

| ID   | Requisito y aceptación                                                                                | Evidencia                                       |
| ---- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| RF01 | Mostrar quince singles Pokémon TCG con nombre, imagen, tipo, atributo y precio CLP; reemplazo local si falla imagen | Catalog, ProductCard; pruebas 06-08 |
| RF02 | Combinar búsqueda por nombre sin distinguir mayúsculas y filtro de tipo; avisar sin resultados        | Prueba 08                                       |
| RF03 | Agregar aumenta unidades, actualiza contador y persiste carrito                                       | Pruebas 03, 06, 18                              |
| RF04 | Cambiar cantidades de 1 a 99; eliminar explícitamente o al llegar a cero                              | Pruebas 02, 03, 14                              |
| RF05 | Calcular precio por cantidad y 10% con POKEMON10; redondear al peso; código inválido revoca descuento | Pruebas 04, 15                                  |
| RF06 | Vaciar carrito tras compra y mantener recibo; fallo de guardado conserva carrito                      | Pruebas 16-18                                   |
| RF07 | Registrar datos válidos, rechazar duplicados y mostrar confirmación                                   | Pruebas 05, 09, 11, 12, 21                      |
| RF08 | Comuna pertenece a región; cambiar región reinicia comuna; sin región se deshabilita                  | Pruebas 05, 10                                  |
| RF09 | Rechazar credenciales inválidas, mostrar nombre al ingresar y eliminar sesión al salir                | Pruebas 13, 19, 21                              |
| RF10 | Tolerar JSON inválido, normalizar entradas y comunicar errores de escritura                           | Pruebas 01, 02, 20, 22                          |
| RF11 | Navegar entre inicio, registro, login, carrito y página inexistente                                   | StoreApp; pruebas 18-19 y revisión de navegador |

## Reglas de negocio

Nombre de 2 a 50 letras Unicode y espacios. Correo válido, único y normalizado a minúsculas; confirmación coincidente. Contraseña de 8 a 128 caracteres, mayúscula, minúscula, número y símbolo; confirmación exacta. Teléfono opcional en formato chileno `912345678` o `+56 9 1234 5678`. Región/comuna deben pertenecer a la muestra disponible: tres regiones y nueve comunas, heredadas de la propuesta inicial.

El carrito descarta ids desconocidos y cantidades negativas, fraccionarias o inválidas, combina duplicados y limita 99 unidades por producto. El cupón dura mientras se mantiene la vista montada. Importes y precios se derivan del catálogo; no se confía en precios almacenados.

## Requisitos no funcionales

| ID    | Criterio                | Implementación                                                                                                                |
| ----- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| RNF01 | Modularidad React       | Páginas, componentes y servicios separados; estado y callbacks explícitos                                                     |
| RNF02 | Responsividad Bootstrap | container/row, col-12 col-sm-6 col-lg-3, col-lg-8/4 y menú expandible; revisión a 390 y 1440 px                               |
| RNF03 | Accesibilidad básica    | Labels, aria-invalid, errores asociados, foco al primer error, teclado y salto al contenido; no equivale a certificación WCAG |
| RNF04 | Testing repetible       | Jasmine/Karma/Chrome Headless con mocks, aislamiento de DOM y almacenamiento                                                  |
| RNF05 | Cobertura medible       | HTML/JSON/texto y umbral global de 90% por métrica en módulos instrumentados                                                  |
| RNF06 | Distribución estática   | esbuild y HashRouter; JS/CSS locales, sin CDN para React o Bootstrap                                                          |
| RNF07 | Datos locales           | PBKDF2 SHA-256, 100 000 iteraciones, sal aleatoria de 16 bytes; sesión solo con correo y nombre                               |

## Arquitectura y datos

main monta App; HashRouter contiene StoreApp, que mantiene carrito, sesión y avisos. ProductCard recibe product y onAdd; Cart recibe cart, onChange y onCheckout. Field unifica etiqueta, pista y error. Register/Login mantienen inputs controlados y aceptan servicios inyectables para pruebas. React escapa el texto del usuario; no se usa dangerouslySetInnerHTML.

Producto: id, nombre, tipo, atributo, descripción, precio e imagen. Carrito: id y cantidad. Cuenta: nombre, correo, teléfono, región, comuna, sal y hash. Sesión: nombre/correo en sessionStorage. El carrito inicial se conserva; las cuentas antiguas con contraseñas en texto plano no se migran y deben registrarse de nuevo.

## Riesgos y límites

Almacenamiento borrable, bloqueable y manipulable por el usuario; sin sincronización entre dispositivos. PBKDF2 local no sustituye autenticación/autorización en servidor. Web Crypto requiere localhost/HTTPS. Imágenes de tercero con fallback local; regiones de muestra y precios ficticios. Sin pruebas completas en Safari/Firefox ni auditoría con tecnologías de asistencia. Producción requiere backend, inventario y pagos verificados.

## Trazabilidad de la rúbrica

| Indicador | Peso | Evidencia                                                             |
| --------- | ---- | --------------------------------------------------------------------- |
| IE2.1.1   | 10%  | React modular, navegación y flujos del alcance                        |
| IE2.1.2   | 10%  | Componentes/props/estado, Bootstrap y capturas                        |
| IE2.2.1   | 12%  | 22 pruebas Jasmine/Karma de lógica y DOM                              |
| IE2.3.1   | 8%   | Configuración, mocks, cobertura, análisis y CI                        |
| IE2.1.3   | 15%  | Guía para explicar diseño; exposición del estudiante pendiente        |
| IE2.1.4   | 20%  | Guía de componentes y responsividad; exposición pendiente             |
| IE2.2.2   | 15%  | Diez pruebas seleccionadas para demostración; exposición pendiente    |
| IE2.3.2   | 10%  | Guía del proceso de testing, mocks y resultados; exposición pendiente |

La matriz identifica evidencias; no garantiza calificación. El 60% corresponde a la defensa individual. La publicación en GitHub y carga en AVA son pasos de entrega pendientes del propietario/equipo.
