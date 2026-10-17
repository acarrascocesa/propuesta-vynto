# VYNTO · Prototipo interactivo

Demostración visual en Next.js, TypeScript y Tailwind CSS, inspirada en la referencia del proyecto. Incluye 24 proveedores ficticios, diez categorías y cuatro ciudades dominicanas.

## Ejecución local

Requiere Node.js 22.9 o posterior y npm.

```bash
npm install
npm run dev
```

Abre http://127.0.0.1:3000. Si el puerto está ocupado, consulta el puerto que imprime Next.js.

```bash
npm run build
npm start
npm test
npm run typecheck
```

`build` genera la compilación de producción, incluido el formato standalone. `start` sirve la compilación local. No se ha provisionado ni desplegado un VPS.

## Recorrido

- `/`: portada, categorías, buscador y explicación del servicio.
- `/explorar`: resultados, filtros, orden y solicitudes desbloqueadas. Activa la búsqueda inteligente para probar reglas locales como «necesito un electricista en Santiago».
- `/proveedor/p01`: perfil de ejemplo y contactos ficticios.
- `/panel`: edición y suscripción. El selector de cuenta permite probar proveedores sin inscripción, inscritos o con renovación cancelada.
- `/admin`: moderación, indicadores y movimientos derivados del estado de la demo.
- `/precios`: inscripción de US$4 con primer mes incluido, renovación de US$2 y acceso a contactos por US$2 por solicitud.

«Acceso demo» permite cambiar entre cliente, proveedor y administrador sin credenciales. Los pagos aprobados o rechazados son simulaciones y no solicitan tarjetas. Los correos usan `example.test` y los teléfonos son marcadores no contactables.

## Persistencia y solicitudes

Los cambios se guardan en `localStorage`, clave `vynto-demo-v1`. El pie de página permite restablecer la demostración. En navegadores que bloquean almacenamiento los cambios duran durante la sesión.

Cada búsqueda tiene un identificador `solicitud` en la URL. Cambiar sus filtros crea una solicitud nueva; volver mediante el historial, el perfil o «Mis solicitudes desbloqueadas» conserva el acceso adquirido. Antes de pagar, los resultados se actualizan ante cambios de perfiles y moderación; después de pagar, los identificadores incluidos quedan fijados. Los proveedores suspendidos o sin suscripción no se muestran como disponibles.

No existe autenticación real, backend Express, base de datos ni pasarela. Los datos están en el navegador: ocultar los contactos en esta demo representa una interacción visual, no una barrera de seguridad. En una fase posterior, la API Express verificará permisos y pagos en el servidor y almacenará los datos en PostgreSQL.

## Diseño y validación

`tokens.css` centraliza colores, tipografía y valores compartidos. Space Grotesk e IBM Plex Sans se sirven localmente desde los paquetes instalados, sin llamadas a servicios de fuentes. Las pruebas verifican reglas de negocio, recuperación de solicitudes, validación de perfiles y contraste de los tokens usados en superficies claras y oscuras.

Hallmark está instalado en `.agents/skills/hallmark`. La revisión visual en navegador sigue siendo necesaria para validar composición y adaptación final a dispositivos.
