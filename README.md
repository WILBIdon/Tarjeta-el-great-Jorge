# 🥂 The Great Jorge Eduardo — Invitación de Cumpleaños

Invitación virtual estilo **Gran Gatsby / Art Déco** para el cumpleaños de
**Jorge Eduardo Lopreto Botero** — Sábado 5 de diciembre.

## El recorrido

```
⏳ Reloj de arena  →  🎬 Video 1  →  ✉️ El sobre  →  🎬 Video 2  →  ⬛ Negro  →  💌 Tarjeta
   (precarga)         (10 s)       (espera clic)     (23 s)       (0.9 s)
```

1. **Reloj de arena** — mientras se descarga el primer video. La barra dorada
   muestra el progreso real de carga; si todavía no se sabe, hace un vaivén.
   Mínimo 1.1 s en pantalla para que no parpadee; si la red va muy lenta,
   a los 12 s arranca igual y el video sigue cargando mientras corre.
2. **Video 1** (`intro-1.mp4`) — arranca solo, con sonido. Si el navegador
   bloquea el audio, se reproduce en silencio en vez de quedarse trabado.
   Mientras se ve, se precargan el sobre, el video 2, la música y el fondo.
3. **El sobre** (`sobre.webp`) — queda esperando con el botón **ABRIR SOBRE**.
   Sin prisa: le da tiempo al video 2 de terminar de cargar.
4. **Video 2** (`intro-2.mp4`) — el clic del invitado desbloquea el audio del
   navegador, así que este va con sonido seguro. Si aún no cargó, el botón
   pasa a "Abriendo" y espera.
5. **Fundido a negro** y aparece la tarjeta. *Sing, Sing, Sing* entra justo en
   el golpe de la banda (el archivo ya viene recortado ahí) y arranca la
   pirotecnia dorada.

Los dos videos tienen botón discreto de **Saltar**.

## Contenido de la tarjeta

| Sección | Detalle |
|---|---|
| Mensaje | *Acompáñame a celebrar mi cumpleaños* |
| Frase | *"Para ver un amanecer inolvidable."* |
| Fecha | Sábado, 5 de diciembre · **6:00 PM** |
| Lugar | Bárbaro Cocina Primitiva — Rionegro, Antioquia |
| Ubicación | QR + enlace https://linktr.ee/UbicacionRionegro |
| Vestimenta | Caballeros: traje, corbata negra · Damas: vestido largo |
| Regalo | Lluvia de sobres |
| RSVP | Formulario → WhatsApp (+ Google Sheets opcional) |

## Desarrollo local

```bash
npm install
npm start
```

Abre `http://localhost:3000`

## ⚙️ Configuración

Todo lo editable está en un solo bloque, al inicio del `<script>` de
[`public/index.html`](public/index.html):

```js
const CONFIG = {
    whatsapp:  '573008724559',  // ⚠️ CAMBIAR por el número que recibe las confirmaciones
    sheetsUrl: '',              // URL del Google Apps Script (opcional)
    music:     'song.m4a?v=3',  // null para quitar la música
    evento:    'Cumpleaños de Jorge Eduardo · 5 de Diciembre'
};
```

Los videos se cambian directo en su `<video src="...">` dentro del HTML.

### Pendiente antes de enviarla

- [ ] **Número de WhatsApp** — hoy está el de la invitación anterior (`573008724559`).
- [ ] **Google Sheets** (opcional) — si quieres registrar las confirmaciones en
      una hoja, pega la URL del Apps Script en `CONFIG.sheetsUrl`.

## ⚠️ Caché: el `?v=N`

Los videos, las imágenes y la música se sirven con `Cache-Control: immutable`
por un año, así que el teléfono de cada invitado los descarga **una sola vez**.
El precio es que si reemplazas un archivo después de repartir el link, quien ya
abrió la invitación seguiría viendo/oyendo el viejo.

Por eso cada archivo pesado se pide con un número de versión:

```
intro-1.mp4?v=1 · intro-2.mp4?v=1 · sobre.webp?v=1
fondo-gatsby.webp?v=1 · qr-ubicacion.png?v=1 · song.m4a?v=3
```

**Si cambias uno de esos archivos, sube su número** (`?v=1` → `?v=2`) donde
aparezca en `public/index.html`. El HTML nunca se cachea, así que el cambio
llega de inmediato.

## Archivos

```
public/                     16 MB en total
├── index.html              La invitación completa (HTML + CSS + JS, sin build)
├── intro-1.mp4     3.2 MB  Primer video · 10 s · 720×1280
├── intro-2.mp4     8.6 MB  Segundo video · 23 s · 720×1280
├── sobre.webp       44 KB  El sobre dorado que espera el clic
├── fondo-gatsby.webp 284 KB Fondo art déco con el título
├── qr-ubicacion.png  67 KB QR de la ubicación
├── song.m4a        3.5 MB  Sing, Sing, Sing — Benny Goodman (AAC 96 kbps, 5:23)
└── og-image.jpg    109 KB  Vista previa al compartir por WhatsApp

originales/                 Fuera de git: los archivos pesados sin optimizar
                            (ahí está el MP3 entero, con la intro de batería)
```

## 🎺 La canción

`song.m4a` **no es la canción completa**: está recortada a propósito para que
entre justo donde cambia el ritmo.

El original dura 5:23 y empieza con 2.2 s de silencio y 17 s de la intro de
tom-toms de Gene Krupa. La banda entra de golpe en el **segundo 19.671**, en un
tiempo fuerte. El archivo publicado arranca 30 ms antes de ese golpe (19.640 s)
para no cortarle el ataque.

También se le quitaron los **19.75 s de silencio del final** (la canción termina
en 3:23 pero el archivo seguía hasta 5:23): en bucle eso era un hueco mudo.

```
original   0 ─── 2.2s silencio ─── 19.6s batería ─┤BANDA├─── 303s ─── 323s silencio
publicado                                          ├─────────────────┤   4:44
```

Por eso el fundido de volumen al entrar la tarjeta es corto (0.16 → 0.35 en
0.2 s): uno largo se comería justo el golpe.

El MP3 entero sigue en `originales/` por si algún día se quiere la intro.

## 🔎 Diagnóstico en un móvil

A un teléfono ajeno no se le puede enchufar un depurador. Para eso, añadir
`?diag=1` a la URL enciende un panel con el estado real del aparato:

```
https://<la-url>/?diag=1
```

```
pantalla   390x844  dpr 3
capa fx    existe
encendida  sí
display    block
elementos  27  (chispas y cohetes vivos)
anima CSS  sí
menos mov. no
fps        60
arrancada  sí
video1     mudo
tarjeta    visible
```

Sin `?diag=1` el panel no existe, así que los invitados nunca lo ven.

Qué mirar si la pirotecnia no aparece:
- `anima CSS NO` → el navegador no sabe animar; no es culpa de la pirotecnia.
- `capa fx NO EXISTE` o `encendida NO` → la capa no llegó a montarse.
- `elementos 0` siempre → no se están creando chispas; es un fallo real.
- `elementos` sube y baja pero no se ve nada → se crean pero no se pintan:
  mirar `display` y `z-index`.
- `fps 0` → el navegador congeló las animaciones (pestaña en segundo plano o
  ahorro de batería).
- `menos mov. SÍ` → versión serena a propósito (en iPhone **el modo de bajo
  consumo activa esa preferencia solo**).

## Despliegue en Railway

Repositorio: https://github.com/WILBIdon/Tarjeta-el-great-Jorge

1. En [Railway](https://railway.app) → **New Project** → *Deploy from GitHub repo*
2. Elige `WILBIdon/Tarjeta-el-great-Jorge`
3. No hay que configurar nada más: Railway lee `railway.json` y despliega.
   **No hay variables de entorno que poner** — `PORT` la inyecta Railway sola.
4. En *Settings → Networking* → **Generate Domain** para obtener la URL pública.

Lo que ya está resuelto en el repo:

| | |
|---|---|
| `railway.json` | Nixpacks, `node server.js`, healthcheck en `/` con 120 s |
| `.nvmrc` | Node 20 LTS, para que cada build use la misma versión |
| `server.js` | Escucha en `process.env.PORT` (Railway la asigna) |
| Compresión | Brotli/gzip: el HTML viaja de 71.9 KB a **16.4 KB** |
| Caché | HTML sin caché; videos, imágenes y música un año (`immutable`) |

### Dominio propio

En *Settings → Networking → Custom Domain*, y apuntar un CNAME del dominio al
host que da Railway.

## Notas técnicas

- Sin build ni dependencias de frontend: un solo HTML autocontenido.
- Fuentes: Cinzel (art déco), Cormorant Garamond, Montserrat.
- Responsive de 320 px a escritorio, con ajustes para notch y horizontal.
- Respeta `prefers-reduced-motion`, pero **sin dejar la invitación muda**:
  se apagan los bucles decorativos (pulsos, destellos, brillos, el reloj) y la
  pirotecnia **se serena en vez de apagarse** — estallidos lentos y cortos, sin
  cohetes cruzando la pantalla.
  Los **fundidos de opacidad se conservan a propósito**: un fundido es el
  reemplazo recomendado del movimiento, no movimiento del que protegerse.
  Importante: en iPhone, el **modo de bajo consumo activa esa preferencia solo**,
  así que ahí cae mucha gente sin haberlo pedido.
- **Pirotecnia con animación CSS sobre el DOM, no `<canvas>`.** Cada chispa es
  un `<span>` con su propia animación. Es deliberado: la versión en canvas se
  veía preciosa en escritorio y no aparecía en Chrome de Android, sin dar un
  solo error. Las animaciones CSS corren en el **hilo compositor**, siguen
  fluidas aunque el teléfono esté ocupado decodificando video, y no dependen de
  `getContext`, ni de modos de composición, ni de límites de tamaño de lienzo,
  ni de `devicePixelRatio`. Si esto no se ve, es que el navegador no sabe
  animar nada. Tocar la tarjeta lanza un cohete extra.
- El primer video arranca **mudo en móvil**: ningún navegador deja sonar audio
  sin un toque previo del usuario. Cuando pasa, aparece *"Toca para el sonido"*
  y basta tocar en cualquier punto del video. Ese toque además desbloquea el
  audio del segundo video y de la música.
