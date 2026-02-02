# GUÍA DE IMPLEMENTACIÓN
# Dashboard de Compromisos - Alcaldía de Guatapé

## 📋 CONTENIDO

1. Configuración de Firebase
2. Estructura de la Base de Datos
3. Migración de Datos
4. Instalación y Despliegue
5. Uso del Dashboard
6. Mantenimiento y Actualización

---

## 1. CONFIGURACIÓN DE FIREBASE

### Paso 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: "guatape-compromisos"
4. Acepta los términos y haz clic en "Crear proyecto"

### Paso 2: Configurar Firestore Database

1. En el menú lateral, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de producción"
4. Elige la ubicación: "us-central1" (o la más cercana)
5. Haz clic en "Habilitar"

### Paso 3: Configurar reglas de seguridad

En Firestore Database > Reglas, reemplaza con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a todos
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Colección de compromisos
    match /compromisos/{compromiso} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Colección de responsables
    match /responsables/{responsable} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Colección de secretarios
    match /secretarios/{secretario} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Paso 4: Configurar Firebase Storage

1. En el menú lateral, ve a "Storage"
2. Haz clic en "Comenzar"
3. Acepta las reglas predeterminadas
4. Haz clic en "Listo"

### Paso 5: Obtener Credenciales

1. Ve a "Configuración del proyecto" (ícono de engranaje)
2. En la pestaña "General", desplázate hasta "Tus aplicaciones"
3. Haz clic en el ícono web "</>"
4. Registra tu app con el nombre "Dashboard Guatapé"
5. Copia las credenciales de configuración

**IMPORTANTE**: Guarda estas credenciales de forma segura. Las necesitarás para configurar el dashboard.

---

## 2. ESTRUCTURA DE LA BASE DE DATOS

### Colección: compromisos

```json
{
  "no": 55,
  "fechaReunion": "2025-02-03",
  "codigoActividad": "act-55",
  "descripcion": "Acto administrativo delegación...",
  "responsable1": "C-001",
  "responsable2": "C-001",
  "responsable3": null,
  "fechaAsignada": "2025-02-03",
  "fechaCumplimiento": "2025-02-10",
  "cumplimiento": "Si",
  "valoracion": "Oportuno",
  "evidencias": "Documento firmado",
  "observaciones": "Completado a tiempo",
  "fechaCreacion": "2025-01-30T10:00:00.000Z",
  "ultimaActualizacion": "2025-01-30T10:00:00.000Z"
}
```

**Campos:**
- `no`: Número del compromiso (Number)
- `fechaReunion`: Fecha de la reunión (String, formato YYYY-MM-DD)
- `codigoActividad`: Código único de actividad (String)
- `descripcion`: Descripción del compromiso (String)
- `responsable1`, `responsable2`, `responsable3`: Códigos de responsables (String)
- `fechaAsignada`: Fecha de asignación (String, formato YYYY-MM-DD)
- `fechaCumplimiento`: Fecha de cumplimiento (String, formato YYYY-MM-DD)
- `cumplimiento`: Estado del compromiso (String: "Si", "No", "En proceso", "En término")
- `valoracion`: Valoración del cumplimiento (String: "Oportuno", "Extemporáneo")
- `evidencias`: Enlaces o descripción de evidencias (String)
- `observaciones`: Observaciones adicionales (String)
- `fechaCreacion`: Timestamp de creación (String ISO)
- `ultimaActualizacion`: Timestamp de última actualización (String ISO)

### Colección: responsables

```json
{
  "codigo": "C-001",
  "cargo": "Alcalde Municipal"
}
```

**Campos:**
- `codigo`: Código único del responsable (String)
- `cargo`: Nombre del cargo (String)

### Colección: secretarios

```json
{
  "nombre": "David Esteban Franco Vallejo",
  "codigo": "C-001",
  "cargo": "Alcalde Municipal",
  "fotoUrl": "https://storage.googleapis.com/..."
}
```

**Campos:**
- `nombre`: Nombre completo del secretario (String)
- `codigo`: Código del responsable asociado (String)
- `cargo`: Cargo que desempeña (String)
- `fotoUrl`: URL de la foto en Firebase Storage (String)

---

## 3. MIGRACIÓN DE DATOS

### Opción A: Importación Manual desde Firebase Console

1. Ve a Firebase Console > Firestore Database
2. Crea las colecciones manualmente:
   - Haz clic en "Iniciar colección"
   - Nombre: "compromisos"
   - Agrega los campos según la estructura
   - Repite para "responsables" y "secretarios"

### Opción B: Importación Programática (Recomendado)

**Archivo: datos_para_firebase.json** (ya generado)

**Script de importación:**

```javascript
// import-data.js
const admin = require('firebase-admin');
const fs = require('fs');

// Inicializar Firebase Admin
const serviceAccount = require('./firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Leer datos
const datos = JSON.parse(fs.readFileSync('datos_para_firebase.json', 'utf8'));

// Importar compromisos
async function importarDatos() {
  console.log('Iniciando importación...');
  
  // Importar compromisos
  const batch1 = db.batch();
  datos.compromisos.forEach(compromiso => {
    const ref = db.collection('compromisos').doc();
    batch1.set(ref, compromiso);
  });
  await batch1.commit();
  console.log(`${datos.compromisos.length} compromisos importados`);
  
  // Importar responsables
  const batch2 = db.batch();
  datos.responsables.forEach(responsable => {
    const ref = db.collection('responsables').doc();
    batch2.set(ref, responsable);
  });
  await batch2.commit();
  console.log(`${datos.responsables.length} responsables importados`);
  
  // Importar secretarios
  const batch3 = db.batch();
  datos.secretarios.forEach(secretario => {
    const ref = db.collection('secretarios').doc();
    batch3.set(ref, secretario);
  });
  await batch3.commit();
  console.log(`${datos.secretarios.length} secretarios importados`);
  
  console.log('Importación completada!');
}

importarDatos().catch(console.error);
```

**Ejecutar:**
```bash
npm install firebase-admin
node import-data.js
```

---

## 4. INSTALACIÓN Y DESPLIEGUE

### Opción 1: Despliegue Local (Desarrollo)

1. **Abrir el archivo HTML:**
   ```bash
   # Abrir dashboard-guatape.html en tu navegador
   open dashboard-guatape.html
   ```

2. **Configurar credenciales de Firebase:**
   - Abre `dashboard-guatape.html` en un editor
   - Busca la sección `firebaseConfig`
   - Reemplaza las credenciales con las tuyas:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### Opción 2: Despliegue en Firebase Hosting

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicializar Firebase:**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Selecciona tu proyecto existente
   - Public directory: `public`
   - Configure as single-page app: No
   - Set up automatic builds: No

3. **Copiar archivos:**
   ```bash
   mkdir public
   cp dashboard-guatape.html public/index.html
   ```

4. **Desplegar:**
   ```bash
   firebase deploy --only hosting
   ```

5. **Acceder:**
   - URL: `https://tu-proyecto.web.app`

### Opción 3: Despliegue en servidor propio

1. **Subir archivos:**
   - Sube `dashboard-guatape.html` a tu servidor
   - Renómbralo a `index.html` si es la página principal

2. **Configurar:**
   - Asegúrate de que el servidor tenga HTTPS habilitado
   - Firebase requiere HTTPS para funcionar correctamente

---

## 5. USO DEL DASHBOARD

### Funcionalidades Principales

#### 📊 Vista Dashboard
- **Estadísticas generales:** Total de compromisos, cumplidos, en proceso, no cumplidos
- **Gráfico de barras:** Distribución por estado de cumplimiento
- **Gráfico de torta:** Porcentajes por estado
- **Filtros:** Por responsable, estado y año

#### 📋 Vista Compromisos
- **Tabla completa:** Lista de todos los compromisos
- **Búsqueda:** Buscar por descripción
- **Filtros:** Responsable, estado, año
- **Información detallada:**
  - Número de compromiso
  - Fecha de reunión
  - Descripción
  - Responsables asignados
  - Fecha de cumplimiento
  - Estado actual
  - Valoración

#### ➕ Crear Compromiso
- **Formulario completo** para agregar nuevos compromisos
- **Asignación múltiple** de responsables (hasta 3)
- **Selección de estado** y valoración
- **Fechas** de reunión y cumplimiento

### Navegación

1. **Cambiar de vista:**
   - Haz clic en las pestañas "Dashboard" o "Compromisos"

2. **Filtrar información:**
   - Usa los selectores en la parte superior
   - Los datos se actualizan automáticamente

3. **Buscar compromiso:**
   - Escribe en el cuadro de búsqueda
   - Busca por descripción

---

## 6. MANTENIMIENTO Y ACTUALIZACIÓN

### Actualizar Compromisos

**Desde Firebase Console:**
1. Ve a Firestore Database
2. Encuentra el documento en la colección "compromisos"
3. Haz clic en editar
4. Actualiza los campos necesarios
5. Guarda los cambios

**Desde el código (futuro):**
```javascript
// Ejemplo de actualización
await updateDoc(doc(db, 'compromisos', compromiso.id), {
  cumplimiento: 'Si',
  fechaCumplimiento: '2025-03-15',
  valoracion: 'Oportuno',
  ultimaActualizacion: new Date().toISOString()
});
```

### Agregar Nuevos Responsables

1. Ve a Firestore Database > responsables
2. Haz clic en "Agregar documento"
3. Agrega los campos:
   - `codigo`: "C-XXX"
   - `cargo`: "Nombre del cargo"

### Subir Fotos de Secretarios

1. Ve a Firebase Storage
2. Crea una carpeta "secretarios"
3. Sube las fotos con el nombre del código (ej: C-001.jpg)
4. Obtén la URL pública
5. Actualiza el campo `fotoUrl` en la colección "secretarios"

### Respaldo de Datos

**Exportar desde Firebase:**
```bash
gcloud firestore export gs://[BUCKET_NAME]
```

**Importar a Firebase:**
```bash
gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

### Monitoreo

**Firebase Console:**
- Uso de Firestore: Console > Firestore Database > Uso
- Analytics: Console > Analytics > Dashboard
- Errores: Console > Crashlytics (si está configurado)

---

## 📞 SOPORTE

### Contacto
- Desarrollador: Claude AI
- Email: soporte@municipioguatape.gov.co
- Teléfono: +57 XXX XXX XXXX

### Recursos Adicionales
- Documentación Firebase: https://firebase.google.com/docs
- Documentación React: https://react.dev
- Recharts (gráficos): https://recharts.org

---

## 🔒 SEGURIDAD

### Recomendaciones:

1. **No compartas las credenciales de Firebase** públicamente
2. **Configura reglas de seguridad** apropiadas en Firestore
3. **Habilita autenticación** para operaciones de escritura
4. **Usa HTTPS** siempre
5. **Realiza respaldos periódicos** de la base de datos
6. **Monitorea el uso** regularmente para detectar anomalías

---

## 📊 PRÓXIMAS FUNCIONALIDADES

### En desarrollo:
- [ ] Autenticación de usuarios
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones por email
- [ ] Sistema de comentarios
- [ ] Historial de cambios
- [ ] Dashboard por responsable
- [ ] Reportes automatizados
- [ ] Integración con Power BI

---

## 📝 CHANGELOG

### Versión 1.0.0 (2025-01-30)
- ✅ Dashboard inicial con estadísticas
- ✅ Vista de tabla de compromisos
- ✅ Filtros por responsable, estado y año
- ✅ Búsqueda por descripción
- ✅ Gráficos interactivos
- ✅ Diseño responsive
- ✅ Integración con Firebase

---

**Última actualización:** 30 de enero de 2025
**Versión del documento:** 1.0.0
