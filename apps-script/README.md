# Conectar la hoja de cálculo

Las confirmaciones ya llegan por WhatsApp. Esto añade que además queden
guardadas en una hoja, con el mensaje que cada invitado le escriba a Jorge.

Son 5 pasos. Hay que hacerlos desde la cuenta de Google **dueña de la hoja**.

> El script **no lleva escrito a qué hoja escribe**, y es a propósito: este
> repositorio es público, y el identificador de una hoja es la llave para
> abrirla. Al crearlo desde el menú de la propia hoja queda atado a ella y la
> encuentra solo. Por eso el paso 1 importa: tiene que ser desde **dentro** de
> la hoja, no como proyecto suelto en script.google.com.

---

### 1. Abrir el editor de scripts

En la hoja → menú **Extensiones** → **Apps Script**.

Se abre una pestaña con un archivo `Código.gs` que trae un `function myFunction() {}`
vacío.

### 2. Pegar el código

Borra todo lo que haya en ese archivo y pega el contenido completo de
[`Codigo.gs`](Codigo.gs). Guarda con **Ctrl/Cmd + S**.

### 3. Probarlo una vez

Arriba hay un desplegable de funciones: elige **`probar`** y dale al botón **▶ Ejecutar**.

La primera vez Google pide permiso:

- *"Esta app no está verificada"* → **Configuración avanzada** → **Ir a (nombre del proyecto)**
- → **Permitir**

Es normal: la app no verificada es la tuya propia. Al terminar, en la hoja
debe haber aparecido una pestaña **Confirmaciones** con una fila de prueba.
Bórrala cuando quieras.

### 4. Publicarla como aplicación web

Botón azul **Implementar** (arriba a la derecha) → **Nueva implementación**.

- El engranaje ⚙️ junto a *"Seleccionar tipo"* → **Aplicación web**
- **Descripción:** `Confirmaciones invitación`
- **Ejecutar como:** `Yo (tu correo)`
- **Quién tiene acceso:** **`Cualquier usuario`** ← esto es lo importante

  > Tiene que ser "Cualquier usuario", no "Cualquier usuario con cuenta de Google".
  > Los invitados abren la invitación desde WhatsApp, sin estar logueados.

- **Implementar** → copia la **URL de la aplicación web**.

Es una URL larga que termina en **`/exec`**:

```
https://script.google.com/macros/s/AKfycb................/exec
```

### 5. Pegarla en la invitación

En [`public/index.html`](../public/index.html), dentro del bloque `CONFIG`:

```js
sheetsUrl: 'https://script.google.com/macros/s/AKfycb.../exec',
```

Guarda, sube el cambio y listo. La siguiente confirmación aparece en la hoja.

---

## Comprobar que quedó bien

Abre la invitación, confirma con un nombre de prueba y mira la hoja: la fila
debe aparecer en un par de segundos.

Si no aparece:

| Síntoma | Causa casi siempre |
|---|---|
| No llega nada | La URL no termina en `/exec` (pegaste la de `/dev` o la de la hoja) |
| No llega nada | En el paso 4 quedó "Cualquier usuario **con cuenta de Google**" |
| Llegaba y dejó de llegar | Editaste el script y no hiciste **Implementar → Administrar implementaciones → ✏️ → Versión: Nueva**. Sin eso la URL sigue sirviendo el código viejo |
| Filas duplicadas | Alguien le dio dos veces a enviar; no es un fallo del script |

> **Cada vez que cambies `Codigo.gs`** tienes que volver a implementar con
> *Versión: Nueva*. La URL `/exec` no cambia, pero el código que corre sí.

## Qué se guarda

| Fecha | Nombre | Asistencia | Mensaje para Jorge |
|---|---|---|---|
| 30/10/2026 19:42 | Ana Pérez | Sí, asistirá | Felicitaciones, allá nos vemos |

El mensaje es **opcional**: si el invitado no escribe nada, la celda queda vacía
y la confirmación se guarda igual.

## Privacidad

La aplicación web es pública (tiene que serlo), pero **solo acepta escrituras**:
no devuelve nada de la hoja. Quien dé con la URL puede meter una fila falsa,
no puede leer las confirmaciones de los demás.
