# Documento de cobertura de testing

Proyecto Culto Chamán TCG Store, DSY1104 EP2. Ejecución local: 16 de octubre de 2026. Resultado: **22 pruebas ejecutadas, 22 aprobadas, 0 fallidas**, Jasmine 5.12.0 / Karma 6.4.4 / Chrome Headless 155 en Windows. No se ha ejecutado todavía el workflow en GitHub.

## Objetivo y proceso

Validar lógica, estados, eventos, validación de formularios y DOM de los componentes reales. Se sigue el ciclo: requisito → caso válido/erróneo → preparación/acción/aserción → ejecución → análisis de cobertura → corrección → nueva ejecución. Se separan servicios puros de componentes para aislar fallos y facilitar su diagnóstico.

Ejecutar `npm ci`, `npm test` y `npm run build`. El script de pruebas transforma JSX con esbuild e instrumenta cada módulo de `src` importado por la suite con Istanbul. Karma sirve el bundle y Jasmine ejecuta las aserciones en Chrome Headless real. `karma-coverage` genera HTML, JSON y resumen textual en `coverage/`. Un umbral global del 90% en cada métrica hace fallar el proceso si se incumple. El workflow de CI repite pruebas y compilación y guarda reportes como artifact.

## Aislamiento y mocks

- `beforeEach` limpia localStorage/sessionStorage y crea un contenedor y una raíz React nuevos.
- `afterEach` desmonta con `act` y retira el contenedor para evitar estado residual.
- `MemoryRouter` aísla la navegación durante pruebas de componentes.
- `jasmine.createSpy` verifica callbacks y simula promesas de registro/login, tanto resueltas como rechazadas.
- `spyOn(Storage.prototype, 'setItem')` provoca un fallo de escritura para verificar el mensaje y que el estado no cambie.
- La prueba de autenticación usa PBKDF2 real; los mocks de UI no sustituyen esa comprobación de servicio.
- `act` espera actualizaciones de React antes de consultar el DOM. Los inputs disparan eventos nativos y los formularios eventos submit.

## Matriz de casos ejecutados

| Caso | Alcance y aserción principal                                               | Resultado |
| ---- | -------------------------------------------------------------------------- | --------- |
| 01   | JSON corrupto, clave ausente y almacenamiento bloqueado devuelven fallback | Aprobado  |
| 02   | Ignora entradas inválidas, agrupa duplicados y limita 99 unidades          | Aprobado  |
| 03   | Agrega, incrementa, elimina y conserva inmutabilidad del estado previo     | Aprobado  |
| 04   | Subtotal, descuento, normalización de cupón, carrito vacío y precios CLP   | Aprobado  |
| 05   | Registro válido, ocho campos inválidos, duplicado y teléfono opcional      | Aprobado  |
| 06   | Props de ProductCard se muestran y callback recibe id correcto             | Aprobado  |
| 07   | Fallo de imagen usa SVG local                                              | Aprobado  |
| 08   | Búsqueda y tipo combinados cambian DOM y muestran estado vacío             | Aprobado  |
| 09   | Formulario inválido impide servicio y enfoca primer campo erróneo          | Aprobado  |
| 10   | Región habilita y actualiza comuna; cambio limpia selección previa         | Aprobado  |
| 11   | Registro mediante mock muestra éxito y limpia campos                       | Aprobado  |
| 12   | Error del servicio de registro se comunica sin perder datos                | Aprobado  |
| 13   | Login vacío, rechazo de credenciales y posterior éxito con mock            | Aprobado  |
| 14   | Botones de cantidad/eliminar envían id y variación correctos               | Aprobado  |
| 15   | Cupón válido reduce el total del DOM e inválido revoca descuento           | Aprobado  |
| 16   | Recibo sigue visible al vaciar carrito                                     | Aprobado  |
| 17   | Compra fallida comunica error y conserva contenido                         | Aprobado  |
| 18   | Flujo catálogo/carrito/compra sincroniza contador y persistencia           | Aprobado  |
| 19   | Menú abre y cierre de sesión elimina datos y cambia cabecera               | Aprobado  |
| 20   | Error de escritura al agregar mantiene contador y avisa                    | Aprobado  |
| 21   | PBKDF2 real, sal, rechazo de duplicado y credenciales, sesión sin secretos | Aprobado  |
| 22   | Formato inválido de lista de usuarios se recupera                          | Aprobado  |

## Cobertura medida de la ejecución final

| Métrica       | Cubiertos / total | Porcentaje |
| ------------- | ----------------- | ---------- |
| Instrucciones | 214 / 223         | 95,96%     |
| Ramas         | 121 / 125         | 96,80%     |
| Funciones     | 71 / 74           | 95,94%     |
| Líneas        | 184 / 191         | 96,33%     |

Los reportes HTML/JSON incluidos son la evidencia de estos valores. El porcentaje corresponde a módulos instrumentados de App, components, pages, services y data importados por las pruebas; **no equivale a cobertura del repositorio entero**. Se excluyen dependencias, CSS, recursos, HTML, scripts de herramientas y el montaje de `main.jsx`. La función envolvente HashRouter de App no se invoca desde la suite; los flujos montan StoreApp con MemoryRouter. El montaje real sí se comprobó en el navegador.

El núcleo de carrito y validación tiene cobertura de líneas completa en esta ejecución; App es el módulo con mayor margen de mejora (rutas auxiliares y callbacks no recorridos). Permanecen caminos defensivos y de concurrencia asíncrona sin ejecutar. Una cobertura alta no prueba ausencia de errores, seguridad de producción ni calidad semántica del catálogo.

## Revisión complementaria de navegador

Se comprobó la compilación servida por HTTP en Chrome, a 1440 × 1000 y 390 × 844: sin desbordamiento horizontal ni errores JavaScript. Se recorrieron catálogo → agregar → carrito → cupón → compra y registro → login con el servicio local real. Se inspeccionaron visualmente capturas de catálogo en escritorio/móvil y carrito. Se corrigieron enlaces de imágenes inconsistentes heredados del catálogo. Esta revisión complementa las pruebas unitarias y no está incluida en los 22 casos ni certifica compatibilidad con todos los navegadores.

## Dependencias y límites

`npm audit --omit=dev` reportó **0 vulnerabilidades de producción** en la verificación local. La auditoría completa reportó cuatro avisos altos relacionados con Karma, karma-jasmine, chokidar y braces. Karma se mantiene para cumplir el stack solicitado por la evaluación; la sugerencia automática de bajar versiones mayores no se aplicó. Los avisos pertenecen al entorno de desarrollo/pruebas y no se incluyen en el bundle de tienda. No se declara una auditoría completa limpia.

Fuera del alcance: pruebas contra backend/pagos reales, concurrencia de múltiples pestañas, inventario, Safari/Firefox, auditoría WCAG completa y carga. Antes de ampliar el alcance, agregar escenarios para esas integraciones y revisar los riesgos del almacenamiento local.
