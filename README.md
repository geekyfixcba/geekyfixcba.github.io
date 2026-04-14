# GeekyFix - Digital Business Card

Este repositorio contiene la tarjeta de presentación digital (Digital Business Card) de **GeekyFix**. Es una página web estática de un solo archivo (`index.html`) optimizada para cargar rápido y ser fácil de mantener.

## 🚀 Despliegue en GitHub Pages

Para publicar esta página web en internet de forma gratuita usando GitHub Pages, sigue estos pasos:

1. Sube este repositorio a tu cuenta de GitHub.
2. Ve a la pestaña **Settings** (Configuración) de tu repositorio.
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**, bajo **Source**, selecciona **Deploy from a branch**.
5. En **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
6. Haz clic en **Save**.
7. ¡Listo! En unos minutos tu página estará disponible en `https://tu-usuario.github.io/tu-repositorio`.

## 📝 Configuración del Sistema de Reseñas (Google Apps Script)

El sistema de reseñas envía los datos a un Google Sheet sin necesidad de un backend complejo. Para que funcione, debes configurar un Google Apps Script:

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo en blanco.
2. Nombra la hoja de cálculo (ej. "Reseñas GeekyFix").
3. En la primera fila, pon los siguientes encabezados en las columnas A, B, C y D:
   - `Fecha` | `Nombre` | `Calificación` | `Opinión`
4. Ve al menú **Extensiones** > **Apps Script**.
5. Borra el código que aparece y pega el siguiente:

```javascript
const SHEET_NAME = 'Hoja 1'; // Cambia esto si tu hoja tiene otro nombre

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    const date = new Date();
    const rowData = [
      date,
      data.name,
      data.rating,
      data.review
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

6. Haz clic en el ícono de **Guardar** (disquete).
7. Haz clic en el botón azul **Implementar** (Deploy) > **Nueva implementación**.
8. Haz clic en el ícono de engranaje junto a "Seleccionar tipo" y elige **Aplicación web**.
9. Configura lo siguiente:
   - **Descripción:** API de Reseñas
   - **Ejecutar como:** Yo (tu correo)
   - **Quién tiene acceso:** Cualquier persona (Anyone)
10. Haz clic en **Implementar**. (Te pedirá autorizar permisos, acepta y avanza aunque salga una advertencia de seguridad haciendo clic en "Configuración avanzada" > "Ir a Proyecto").
11. Copia la **URL de la aplicación web** que te proporciona al final.
12. Abre el archivo `index.html` de este proyecto, busca la variable `GOOGLE_SCRIPT_URL` (cerca de la línea 250) y reemplaza `'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI'` por la URL que copiaste.

¡Eso es todo! Ahora las reseñas llegarán directamente a tu Google Sheet.
