/**
 * Confirmaciones → Google Sheets
 * Invitación de grados · The Great Jorge Eduardo
 *
 * Pega este archivo completo en Extensiones → Apps Script de la hoja,
 * y publícalo como aplicación web. Los pasos están en README.md.
 */

// Pestaña dentro del archivo. Si no existe, el script la crea.
var PESTANA = 'Confirmaciones';

var CABECERA = ['Fecha', 'Nombre', 'Asistencia', 'Mensaje para Jorge'];


/** La invitación manda un POST (sendBeacon o fetch). */
function doPost(e) {
  return guardar(datos(e));
}

/**
 * Plan C de la invitación: un GET con los datos en la URL.
 *
 * Abrir la URL /exec en el navegador también es un GET, pero sin datos.
 * Sin esta comprobación cada visita dejaría una fila en blanco: la tuya
 * al comprobar que quedó publicada, y la de cualquier robot que dé con
 * la URL, que es pública por obligación.
 */
function doGet(e) {
  var p = datos(e);
  if (!p.nombre) {
    return ContentService
      .createTextOutput('Puente de confirmaciones activo. ' +
                        'Esta dirección no se abre a mano: la usa la invitación.')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  return guardar(p);
}

function datos(e) {
  return (e && e.parameter) ? e.parameter : {};
}


function guardar(p) {
  // Una confirmación sin nombre no es una confirmación.
  if (!p.nombre) return respuesta({ ok: false, error: 'sin nombre' });

  // Dos invitados confirmando a la vez escribirían en la misma fila.
  // El candado los pone en fila india.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return respuesta({ ok: false, error: 'ocupado' });
  }

  try {
    var hoja = obtenerHoja();

    hoja.appendRow([
      new Date(),
      limpiar(p.nombre),
      limpiar(p.asistencia),
      limpiar(p.mensaje)
    ]);

    return respuesta({ ok: true });
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}


function obtenerHoja() {
  // Sin ID a propósito: este archivo vive en un repositorio público y el ID
  // de la hoja es la llave para abrirla. Pegándolo desde la propia hoja
  // (Extensiones → Apps Script) el script queda atado a ella y la encuentra
  // solo. Si esto devuelve null, lo creaste como proyecto suelto: vuelve a
  // empezar desde el menú de la hoja.
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) {
    throw new Error('El script no está atado a ninguna hoja. ' +
                    'Créalo desde Extensiones → Apps Script dentro de la hoja.');
  }

  var hoja = libro.getSheetByName(PESTANA);

  if (!hoja) {
    hoja = libro.insertSheet(PESTANA);
  }

  // Primera vez: cabecera con el mismo dorado de la invitación.
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(CABECERA);
    hoja.getRange(1, 1, 1, CABECERA.length)
        .setFontWeight('bold')
        .setBackground('#1a1510')
        .setFontColor('#d4af37');
    hoja.setFrozenRows(1);
    hoja.setColumnWidth(1, 160);  // Fecha
    hoja.setColumnWidth(2, 220);  // Nombre
    hoja.setColumnWidth(3, 130);  // Asistencia
    hoja.setColumnWidth(4, 420);  // Mensaje
    hoja.getRange('D:D').setWrap(true);
    hoja.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  }

  return hoja;
}


/**
 * Un texto que empieza por = + - @ lo interpreta la hoja como fórmula.
 * Se le antepone un apóstrofo para que entre como texto plano.
 * También se recorta: nadie necesita mandar una novela.
 */
function limpiar(valor) {
  var txt = String(valor == null ? '' : valor).slice(0, 500);
  return /^[=+\-@]/.test(txt) ? "'" + txt : txt;
}


function respuesta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Prueba manual: ejecútala desde el editor (botón ▶ con "probar" elegido).
 * Debe aparecer una fila con "Invitado de prueba" en la hoja.
 */
function probar() {
  guardar({
    nombre: 'Invitado de prueba',
    asistencia: 'Sí, asistirá',
    mensaje: 'Felicitaciones Jorge, allá nos vemos.'
  });
}
