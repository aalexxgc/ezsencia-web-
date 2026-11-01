# ezsencia.com

Web estática (HTML + CSS + JS, sin framework) desplegada en Vercel.

- **`/`** es la web de **Ezsencia Distribución**: trufa negra fresca para restaurantes.
- **`/club`** es **El Club Ezsencia** (Truffle Society). Su contenido no cambia; solo se ha movido de sitio.

## Estructura

```
/                         Portada de distribución          index.html
/clientes                 Acceso clientes (Próximamente)   clientes/index.html
/alta                     Solicitar alta (Próximamente)    alta/index.html
/aviso-legal, /privacidad, /cookies   Legales de toda la web

/club                     Portada del club                 club/index.html
/club/nosotros
/club/acceso              Solicitud de invitación (Formspree)
/club/experiencia/{caja-fundadora,ritual,origen,mesa}
/club/socios, /club/socios/login         Área de socios (Supabase)
/club/recetario, /club/recetario/login   Recetario (Supabase)
```

Archivos compartidos:

| Archivo | Uso |
|---|---|
| `styles.css` | Identidad visual común (colores, tipografías, cabecera, menú, pie). Lo usan el club y la distribución |
| `distribucion.css` | Estilos propios de la distribución (clases `d-…`). Solo afecta a páginas con `<body class="d-page">` |
| `distribucion.js` | Cursor, cabecera, menú, animaciones y huecos de foto de la distribución |
| `nav-active.js`, `cookies.js` | Marca el enlace activo del club y gestiona el aviso de cookies |
| `vercel.json` | Redirecciones 301 y cabecera `X-Robots-Tag` del club |

La cabecera y el pie están copiados en cada página, porque no hay plantillas. Si cambias el menú de distribución, cámbialo en `index.html`, `clientes/`, `alta/` y las tres páginas legales.

## Redirecciones (301)

Están definidas en `vercel.json`:

| Antigua | Nueva |
|---|---|
| `/nosotros` | `/club/nosotros` |
| `/acceso` | `/club/acceso` |
| `/socios`, `/socios/login` | `/club/socios`, `/club/socios/login` |
| `/recetario`, `/recetario/login` | `/club/recetario`, `/club/recetario/login` |
| `/experiencia` | `/club#experiencia` |
| `/experiencia/<x>` | `/club/experiencia/<x>` |
| `/home.html`, `/experiencia.html`, `/eventos.html`, `/evento-origen.html`, `/tarjeta-fundador.html` | `/club` |

`/` no redirige: es la portada de distribución. Los enlaces antiguos `ezsencia.com/#experiencia` no se pueden redirigir desde el servidor, porque el `#` no llega al servidor. Por eso la portada los reenvía a `/club#experiencia` con un pequeño script.

## Ocultar el club de los buscadores (`noindex`)

Ahora el club es indexable. Para ocultarlo del todo, en `vercel.json` cambia:

```json
{ "key": "X-Robots-Tag", "value": "index, follow" }
```

por:

```json
{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }
```

Después, quita las URLs `/club…` de `sitemap.xml` y vuelve a desplegar. No añadas `Disallow: /club` en `robots.txt`: si Google no puede entrar en la página, tampoco puede ver el `noindex`.

## Fotos de distribución (pendientes)

Cada hueco muestra un marcador "FOTO: …". En cuanto subas un archivo con el nombre exacto a `assets/distribucion/`, la página lo muestra sola, sin tocar el código.

| Archivo | Qué debe mostrar | Proporción | Tamaño recomendado |
|---|---|---|---|
| `trufa-entera.jpg` | Trufa entera (hero de la portada) | 4:5 vertical | 1600 × 2000 px |
| `trufa-cortada.jpg` | Una trufa cortada | 4:5 vertical | 1200 × 1500 px |
| `recipiente-lote.jpg` | Recipiente cerrado con su pegatina de lote | 4:5 vertical | 1200 × 1500 px |
| `nevera-termometro.jpg` | Nevera portátil con termómetro | 3:2 horizontal | 1800 × 1200 px |
| `entrega-recepcion.jpg` | Entrega en la recepción de un restaurante | 3:2 horizontal | 1800 × 1200 px |
| `albaran.jpg` | Albarán (sin datos reales) | 4:5 vertical | 1600 × 2000 px |
| `explotacion-alcotas.jpg` | La explotación en Alcotas (franja ancha bajo "El producto") | 21:9 panorámica | 2400 × 1030 px |
| `og-distribucion.jpg` | Imagen al compartir el enlace (WhatsApp, redes) | 1,91:1 | 1200 × 630 px |

- Usa JPG y, a ser posible, menos de 400 KB por foto. Las fotos actuales de `assets/` pesan entre 5 y 10 MB y ralentizan la web.
- No uses fotos de stock que sugieran que la trufa se limpia, se lava o se clasifica.
- Las fotos del club no cambian.

## Textos de distribución: lista de prohibidos

En la parte de distribución, incluidos los metadatos y los `alt` de las imágenes, **no** se usa:

- "Trufa negra de Teruel", "Trufa de Teruel", "IGP", "certificada", "con garantía de origen", ni "trufa negra" junto a "Teruel" en un titular.
- "limpia", "cepillada", "lavada", "clasificada", "seleccionada a mano", "calibrada", "extra", "primera".
- "de nuestra finca", "producción propia", "cultivamos".
- "24 h desde la finca", "recolectada ayer", "fecha de caducidad".
- "la mejor", "premium garantizada", "ecológica", "100 % natural".
- Márgenes, fórmulas de precio, precio de compra al productor ni datos fiscales o laborales del responsable.

Los textos del club no están sujetos a esta lista.

## Siguientes fases (no implementadas)

1. **Formulario "Solicitar alta como cliente profesional"** en `/alta`. Campos: razón social, NIF, dirección de entrega, contacto, teléfono, email, horario de recepción, tipo de negocio y aceptación de privacidad. Propuesta: una función en `api/` (como `api/submit.js`) que guarde en Supabase y avise por email (Resend).
2. **Área de clientes** en `/clientes`:
   - login con Supabase Auth, en una tabla de clientes separada de los socios del club;
   - tarifa semanal visible solo para clientes aprobados;
   - pedidos validados **en el servidor**: mínimo 100 g, cierre a las 11:00 de la víspera (hora de Madrid, `Europe/Madrid`) y solo de lunes a viernes.
3. **Panel de administración** (`/admin`): aprobar clientes, publicar la tarifa, ver la ruta del día, exportar a CSV y generar el albarán en PDF.
4. **Ajuste `REGISTRO_SANITARIO`**: una variable de entorno en Vercel. Mientras esté vacía, la API rechaza los pedidos y la web muestra "Abriremos pedidos en cuanto tengamos el registro sanitario". Cuando exista el registro, descomenta también en `index.html` (sección Trazabilidad) la frase del «canal autorizado (RD 30/2009, art. 6)».

Las rutas `/clientes` y `/alta` ya existen y ya están enlazadas desde el menú. Las fases siguientes solo tienen que sustituir su contenido.

## Notas

- `api/submit.js` y `supabase-setup.sql` no se usan ahora mismo. El formulario de `/club/acceso` envía a Formspree.
- `assets/og-image.jpg`, que usan las páginas del club al compartirse, no existe en el repositorio.
- El estado "Próximamente" anterior está guardado en la rama `proximamente`.
