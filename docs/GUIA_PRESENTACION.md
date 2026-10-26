# Guía de defensa individual

Guion sugerido de 8 a 10 minutos, ajustable al tiempo del docente. Cada estudiante debe comprender y ejecutar la demostración.

## Diseño y arquitectura (2 minutos)

Explica el paso desde cuatro páginas HTML y un script global a páginas, componentes y servicios. Sigue main → App → HashRouter → StoreApp. Justifica HashRouter para hosting estático y esbuild para transformar JSX y empaquetar dependencias. Muestra las cuatro vistas y el flujo de compra de demostración.

## Props y estado (2 minutos)

Abre ProductCard: product personaliza contenido y onAdd comunica una acción al padre. Agrega dos cartas: el contador y carrito provienen de un mismo estado. Abre changeCart y explica por qué genera nuevas estructuras sin mutar las anteriores.

Abre Register: value/onChange hacen inputs controlados y cambiar región limpia comuna. Diferencia estado local del formulario y estado compartido de StoreApp. Muestra Field y sus etiquetas, pistas y errores asociados.

## Responsividad (1 minuto)

Compara 390 y 1440 px. Explica col-12 col-sm-6 col-lg-3: una, dos o cuatro columnas. Abre menú móvil y muestra expanded/aria-expanded. El carrito cambia de dos columnas a una con col-lg-8/4. Bootstrap controla grilla y utilidades; CSS propio aporta identidad visual.

## Diez pruebas para demostrar (2 minutos)

Ejecuta npm test. Abre los casos 03, 05, 06, 08, 09, 10, 11, 13, 15 y 16: inmutabilidad, validación, props/callback, búsqueda, errores del DOM, comuna dependiente, registro simulado, login, descuento y recibo. La suite completa tiene 22 pruebas.

Identifica preparación, acción y aserción. Explica qué regresión detecta cada caso. La prueba 16 detectaría que el recibo desapareciera junto al resumen al vaciar el carrito, como ocurría en el proyecto inicial.

## Proceso y resultados (1 a 2 minutos)

Muestra karma.conf.cjs y scripts/test.mjs: esbuild transforma JSX, Istanbul instrumenta código de aplicación y Karma ejecuta Jasmine en Chrome Headless. act espera actualizaciones React; beforeEach/afterEach aíslan DOM y almacenamiento. Spies y servicios inyectados reproducen éxito y error sin depender de almacenamiento real. Hay una prueba separada de autenticación local real.

Abre el reporte coverage/. Distingue cobertura de instrucciones, ramas, funciones y líneas. Explica el umbral del 90% y exclusiones del informe. Una cobertura alta no demuestra ausencia de errores. Muestra CI como configuración preparada; no afirmes que ya corrió en GitHub antes de subir la actualización.

## Preguntas para practicar

- ¿Por qué no mutar cart? Una referencia nueva permite a React actualizar el estado de forma predecible y evita alterar valores anteriores.
- ¿Para qué sirve un mock? Aísla un comportamiento y permite reproducir fallos; no sustituye probar la integración real por separado.
- ¿Un hash local protege cuentas reales? No. El usuario controla código y almacenamiento; la autenticación y autorización de producción requieren servidor.
- ¿Qué falta para producción? Backend, inventario, pagos y pruebas adicionales de compatibilidad y accesibilidad.
- ¿Qué falta para la entrega académica? Subir cambios al repositorio, completar autoría, cargar entregables y realizar la exposición individual.
