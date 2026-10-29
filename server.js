const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Compresión GZIP/Brotli para todas las respuestas
app.use(compression());

// Archivos estáticos con políticas de caché
app.use(express.static(path.join(__dirname, 'public'), {
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🥂 The Great Jorge Eduardo corriendo en el puerto ${PORT}`);
});
