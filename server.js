const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'public', 'index.html');

// Compresión GZIP/Brotli para todas las respuestas
app.use(compression());

/* ────────────────────────────────────────────────────────────
   URL ABSOLUTA PARA LA VISTA PREVIA DE WHATSAPP

   WhatsApp (y Facebook, e iMessage) exigen que og:image sea una
   URL completa. Con una ruta relativa el robot no descarga nada
   y el enlace sale sin imagen.

   Como el dominio cambia (localhost, el que da Railway, uno
   propio), el HTML lleva el marcador __BASE__ y aquí se cambia
   por el dominio real de cada petición.

   El Host lo manda el cliente, así que puede venir envenenado:
   se valida contra un patrón de dominio y, si no cuadra, se usa
   PUBLIC_URL o se cae a rutas relativas. Nunca se interpola a
   ciegas dentro del HTML.
──────────────────────────────────────────────────────────── */
const HOST_VALIDO = /^[a-zA-Z0-9.-]+(:\d{1,5})?$/;

function baseUrl(req) {
    if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '');

    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
        .split(',')[0].trim();
    if (!HOST_VALIDO.test(host)) return '';

    const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'https')
        .split(',')[0].trim();
    return `${proto === 'http' ? 'http' : 'https'}://${host}`;
}

function servirIndex(req, res) {
    // Se lee en cada petición (el HTML ya va sin caché, y así los
    // cambios se ven sin reiniciar el servidor).
    fs.readFile(INDEX, 'utf8', (err, html) => {
        if (err) return res.status(500).send('No se pudo leer la invitación');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        res.send(html.split('__BASE__').join(baseUrl(req)));
    });
}

// Tiene que ir ANTES de express.static: si no, static sirve el
// index.html crudo y __BASE__ llegaría sin reemplazar.
app.get('/', servirIndex);
app.get('/index.html', servirIndex);

// Archivos estáticos con políticas de caché
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    maxAge: '1y',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            // El HTML nunca se cachea: siempre se ve la última versión
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (/\.(mp4|m4v|m4a|mp3|webp|png|jpg|jpeg)$/.test(filePath)) {
            // Multimedia cacheado un año: el móvil no lo vuelve a pedir
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

app.listen(PORT, () => {
    console.log(`🎓 The Great Jorge Eduardo corriendo en el puerto ${PORT}`);
});
