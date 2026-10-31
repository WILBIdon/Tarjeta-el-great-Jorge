# 🎓 The Great Jorge Eduardo — Invitación de Grados

Invitación virtual estilo **Gran Gatsby / Art Déco** para los grados de
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
| Mensaje | *Acompáñame a celebrar mis grados* |
| Frase | *"Para ver un amanecer inolvidable."* |
| Fecha | Sábado, 5 de diciembre · **6:00 PM** |
| Lugar | Bárbaro Cocina Primitiva — Rionegro, Antioquia |
| Ubicación | QR + enlace https://linktr.ee/UbicacionRionegro |
| Vestimenta | Caballeros: traje, corbata negra · Damas: vestido largo |
| Regalo | Lluvia de sobres |
| RSVP | Nombre + ¿asistirás? + **mensaje para Jorge** → WhatsApp y Google Sheets |

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
    whatsapp:  '573002436120',  // ⚠️ MODO PRUEBA · el de Jorge es 573208218053
    sheetsUrl: '',              // URL /exec del Apps Script → apps-script/README.md
    music:     'song.m4a?v=3',  // null para quitar la música
    evento:    'Grados de Jorge Eduardo · 5 de Diciembre'
};
```

Los videos se cambian directo en su `<video src="...">` dentro del HTML.

### Pendiente antes de enviarla

- [ ] ⚠️ **Devolver el número de Jorge** — ahora está el de pruebas
      (`573002436120`). Antes de repartir la invitación, en `CONFIG.whatsapp`:
      `573002436120` → **`573208218053`**. Si no, las confirmaciones de los
      invitados no le llegan a Jorge.
- [x] **Google Sheets** — publicado y conectado. Comprobado de punta a punta:
      la invitación escribe en la hoja. Si algún día hay que rehacerlo, los
      pasos están en [`apps-script/README.md`](apps-script/README.md).

## 📊 Las confirmaciones

Cada confirmación sale por dos caminos a la vez, independientes:

1. **WhatsApp** — se abre el chat con el mensaje ya escrito. Funciona
   siempre, sin configurar nada. Ahora va al número de **pruebas**
   (`573002436120`); el de Jorge es `573208218053`.
2. **La hoja de cálculo** — en segundo plano, sin que el invitado note nada.
   Solo si `CONFIG.sheetsUrl` tiene la URL del Apps Script.

| Fecha | Nombre | Asistencia | Mensaje para Jorge |
|---|---|---|---|
| 30/10/2026 19:42 | Ana Pérez | Sí, asistirá | Felicitaciones, allá nos vemos |

El **mensaje para Jorge** es un campo de texto opcional (máximo 300 caracteres,
con contador). Si el invitado no escribe nada, la confirmación se guarda igual.

El envío a la hoja intenta tres caminos en cascada, porque Apps Script no manda
cabeceras CORS y no se puede leer la respuesta: `navigator.sendBeacon` →
`fetch` con `no-cors` y `keepalive` → un GET por `<img>`. Importa que sea
`sendBeacon`: justo después se abre WhatsApp, y el beacon sobrevive al cambio
de pestaña.

> **El enlace de la hoja no está en el repositorio, a propósito.** Esto es
> público y el identificador de una hoja es la llave para abrirla. El script se
> pega desde el menú de la propia hoja y queda atado a ella sin tener que
> nombrarla.

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

## 🖼️ La vista previa de WhatsApp

Antes el enlace salía sin imagen. La causa no era la caché: era que
`og:image` apuntaba a `/og-image.jpg`, **una ruta relativa**. El robot de
WhatsApp exige una URL completa (`https://dominio/og-image.jpg`) y con una
ruta relativa no descarga nada.

Como el dominio cambia (local, el de Railway, uno propio), el HTML lleva el
marcador `__BASE__` y [`server.js`](server.js) lo reemplaza por el dominio real
de cada petición, leyendo `X-Forwarded-Host`. El `Host` lo manda el cliente y
puede venir envenenado, así que se valida contra un patrón de dominio antes de
meterlo en el HTML; si no cuadra, se cae a rutas relativas en vez de inyectar.

Se puede forzar un dominio fijo con la variable de entorno `PUBLIC_URL`.

```html
<meta property="og:image" content="__BASE__/preview.jpg">
       ↓  lo que recibe WhatsApp
<meta property="og:image" content="https://the-great-jorge.up.railway.app/preview.jpg">
```

La imagen se sirve como `preview.jpg`, **sin `?v=` detrás**. El truco del
número de versión vale para lo que pide el navegador, pero en una etiqueta
`og:image` conviene una ruta limpia: hay clientes que tropiezan con la cadena
de consulta. Para cambiar la imagen, se sube el nombre: `preview-2.jpg`.
`og-image.jpg` se queda por si algún enlace viejo lo pide.

Y lo tercero: la imagen era **vertical** (560×1003). WhatsApp recorta al centro
para la miniatura, y el centro de esa imagen es el hueco negro del marco — salía
un cuadro vacío. Ahora `og-image.jpg` es **1200×630**, recortada de
`fondo-gatsby.webp` (el original en 1080×1935, no del JPEG ya reducido), con el
título completo dentro del encuadre.

El `?v=2` es lo segundo: WhatsApp guarda la vista previa de cada enlace durante
días. Comprobarlo:

```bash
curl -s https://TU-DOMINIO/ | grep 'og:image'
```

> ⚠️ **La vista previa de WhatsApp la arma el teléfono que envía, no un
> servidor.** Es la diferencia que importa: la caché está **en el aparato de
> cada quien**, no en Google ni en Meta. Por eso el depurador de Facebook no
> sirve de nada aquí — ese refresca la caché de Facebook, que WhatsApp no usa.
>
> Consecuencia práctica: si pegaste el enlace cuando la imagen estaba rota, tu
> teléfono se quedó con ese "aquí no hay nada" y te lo va a seguir enseñando
> por mucho que el servidor esté bien. La salida es darle un enlace que no haya
> visto nunca: `https://the-great-jorge.up.railway.app/?i=2`. Para WhatsApp es
> otro enlace; para el servidor es la misma página, porque la parte de después
> del `?` se ignora.
>
> A quien **nunca** lo haya recibido le sale bien a la primera.

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
├── og-image.jpg    218 KB  Vista previa de WhatsApp · 1200×630
├── favicon.ico     4.8 KB  Icono de pestaña · 16/32/48
├── apple-touch-icon.png 13 KB  Pantalla de inicio de iPhone · 180×180
└── icono-512.png    33 KB  Android y atajos · 512×512

apps-script/                El puente con la hoja de cálculo
├── Codigo.gs               Pegar en Extensiones → Apps Script de la hoja
└── README.md               Los 5 pasos para publicarlo

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

## 🔱 El icono

La **J** de Jorge en Cinzel, con el mismo degradado de oro de la tarjeta, dentro
de un marco art déco con muescas en chevron.

Hay **dos dibujos, no uno escalado**: el grande (180 y 512 px) lleva doble filete
y halo; por debajo de 48 px eso se convierte en papilla, así que el `.ico`
—16, 32 y 48— usa una versión de un solo filete fino con la J mucho mayor. Es
la diferencia entre que se lea una J y que se vea una mancha dorada.

## Notas técnicas

- Sin build ni dependencias de frontend: un solo HTML autocontenido.
- Fuentes: Cinzel (art déco), Cormorant Garamond, Montserrat.
- Responsive de 320 px a escritorio, con ajustes para notch y horizontal.
- Respeta `prefers-reduced-motion` con un criterio concreto: **se va lo que se
  desplaza o gira, se queda lo que solo brilla.** Fuera los barridos, los giros
  y la flotación de los botones; dentro el halo que respira, el degradado que
  recorre el texto dorado, el aura del nombre, los filetes de la cita y los
  fundidos entre pantallas. La pirotecnia **se serena, no se apaga**: el cohete
  sigue subiendo, solo que más despacio.
  Esto importa de verdad: en iPhone el **modo de bajo consumo activa esa
  preferencia solo**, y en Android la activa "Quitar animaciones". Ahí cae
  mucha gente que nunca la pidió, y antes se quedaba sin la mitad del diseño.
- Respaldo para navegadores sin `backdrop-filter`: los paneles se opacan en vez
  de quedar transparentes e ilegibles sobre el fondo art déco.
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
- Los cuatro botones de la tarjeta respiran como el de "abrir sobre": un halo
  que late y un destello que los cruza, **escalonados** para que sea una ola y
  no un parpadeo al unísono.
- El primer video arranca **mudo en móvil**: ningún navegador deja sonar audio
  sin un toque previo del usuario. Cuando pasa, aparece *"Toca para el sonido"*
  y basta tocar en cualquier punto del video. Ese toque además desbloquea el
  audio del segundo video y de la música.
