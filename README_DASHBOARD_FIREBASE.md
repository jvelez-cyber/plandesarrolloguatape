# 🔥 Dashboard con Firebase - Plan de Desarrollo Guatapé

## 📦 Archivos Actualizados

```
dashboard-firebase/
│
├── 📄 index-firebase.html     # HTML principal (con Firebase)
├── 🎨 styles.css              # Estilos CSS (sin cambios)
└── ⚙️  app-firebase.js         # JavaScript con conexión a Firebase
```

---

## 🎯 ¿Qué Cambió?

### ✅ **Antes (Versión Anterior):**
- Los datos estaban en un archivo `datos.js` local
- Total: ~95 KB de datos embebidos
- Para actualizar: Regenerar archivo datos.js

### ✅ **Ahora (Nueva Versión con Firebase):**
- Los datos se cargan en tiempo real desde Firebase
- Total: Solo 3 archivos pequeños
- Para actualizar: Modificar directamente en Firebase Console

---

## 🚀 Cómo Usar

### **Paso 1: Descargar los Archivos**

Descarga estos 3 archivos en la misma carpeta:
1. `index-firebase.html`
2. `styles.css`
3. `app-firebase.js`

### **Paso 2: Abrir el Dashboard**

**Opción A - Live Server (Recomendado):**
1. Abre la carpeta en VS Code
2. Clic derecho en `index-firebase.html`
3. Selecciona "Open with Live Server"

**Opción B - Servidor Local:**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Luego abre: `http://localhost:8000/index-firebase.html`

**⚠️ IMPORTANTE:** Por las restricciones de CORS de Firebase, **NO puedes** simplemente hacer doble clic en el HTML. Necesitas un servidor local.

---

## 🔥 Configuración de Firebase

Tu proyecto ya está configurado:

```javascript
Proyecto: plan-de-desarrollo-49495
Colección: plandesarrollo
Total Documentos: 93 programas
```

La configuración está embebida en `app-firebase.js`:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBzP_NnuPmewAeOJ7IkJxkiSrHgpObz4cQ",
    authDomain: "plan-de-desarrollo-49495.firebaseapp.com",
    projectId: "plan-de-desarrollo-49495",
    storageBucket: "plan-de-desarrollo-49495.firebasestorage.app",
    messagingSenderId: "374569479398",
    appId: "1:374569479398:web:f718e47ee0ae0d8a439f27"
};
```

---

## ✨ Características Nuevas

### 📊 **Datos en Tiempo Real**
- Se cargan automáticamente desde Firebase al abrir
- Indicador visual: "🔥 Datos en tiempo real desde Firebase"
- Actualizaciones instantáneas cuando modifiques Firebase

### ⚡ **Carga Inteligente**
- Pantalla de carga mientras se obtienen datos
- Mensajes de error claros si algo falla
- Ordenamiento automático de programas

### 🔄 **Sincronización Automática**
- Ya no necesitas regenerar archivos
- Modifica datos en Firebase Console
- Recarga la página para ver cambios

---

## 📝 Cómo Actualizar Datos

### **Opción 1: Desde Firebase Console** (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/project/plan-de-desarrollo-49495/firestore)
2. Selecciona la colección `plandesarrollo`
3. Haz clic en cualquier documento
4. Edita los campos que necesites
5. Guarda los cambios
6. Recarga el dashboard

### **Opción 2: Usando el Aplicativo**

Si necesitas actualizar muchos programas:
1. Usa el aplicativo `subir-excel-firebase-configurado.html`
2. Primero **elimina** la colección actual en Firebase
3. Sube el Excel actualizado
4. Los nuevos datos aparecerán automáticamente

### **Opción 3: Programáticamente**

Puedes usar el Firebase SDK para actualizar datos:
```javascript
import { doc, updateDoc } from 'firebase/firestore';

// Actualizar un programa
const docRef = doc(db, 'plandesarrollo', 'ID_DEL_DOCUMENTO');
await updateDoc(docRef, {
  'PORCENTAJE DE EJECUCION DEL PROGRAMA (HASTA LA FECHA)': 0.85,
  'VALOR EJECUTADO': 900000000
});
```

---

## 🔐 Seguridad

### **Reglas Actuales de Firestore:**

Tu proyecto debe tener estas reglas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /plandesarrollo/{document=**} {
      allow read: if true;  // Lectura pública
      allow write: if true; // Escritura pública (temporal)
    }
  }
}
```

### **⚠️ Para Producción:**

Cambia las reglas para mayor seguridad:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /plandesarrollo/{document=**} {
      allow read: if true;  // Lectura pública (para el dashboard)
      allow write: if request.auth != null;  // Solo usuarios autenticados
    }
  }
}
```

---

## 🆘 Solución de Problemas

### ❌ **"Error al cargar datos desde Firebase"**

**Posibles causas:**
1. Firestore no está habilitado
2. Las reglas bloquean el acceso
3. No hay conexión a internet

**Solución:**
1. Ve a Firebase Console
2. Verifica que Firestore esté habilitado
3. Revisa las reglas (deben permitir lectura)
4. Verifica tu conexión a internet

---

### ❌ **"CORS policy: No 'Access-Control-Allow-Origin'"**

**Causa:** Estás abriendo el HTML directamente (file://)

**Solución:** Usa un servidor local:
```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: VS Code Live Server
Instala extensión "Live Server" y úsala

# Opción 3: Node.js
npx http-server
```

---

### ❌ **La página se queda cargando infinitamente**

**Posibles causas:**
1. Colección vacía en Firebase
2. Nombre de colección incorrecto
3. Problemas de red

**Solución:**
1. Verifica en Firebase Console que existan documentos en `plandesarrollo`
2. Abre la consola del navegador (F12) para ver errores
3. Revisa que el nombre de la colección sea exactamente `plandesarrollo`

---

### ❌ **Los datos se ven pero están desactualizados**

**Causa:** Caché del navegador

**Solución:**
1. Recarga con caché limpio: `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
2. O abre en modo incógnito

---

## 📊 Estructura de Datos en Firebase

Cada documento en la colección `plandesarrollo` tiene:

```javascript
{
  SECRETARIA: "Secretaria de Gobierno",
  COMPONENTE: "0101\nJuntos por la Seguridad...",
  PROGRAMA: "010101\nImplementación de un plan...",
  "CÓDIGO DE PRODUCTO": 450104800,
  "INDICADOR DE PRODUCTO": "Estrategias implementadas",
  "UNIDAD DE MEDIDA": "Número",
  TENDENCIA: "Incremento",
  "META 2025": 0.25,
  "CANTIDAD DE EJECUCION DEL PROGRAMA (HASTA LA FECHA)": 0.1875,
  "PORCENTAJE DE EJECUCION DEL PROGRAMA (HASTA LA FECHA)": 0.75,
  "PORCENTAJE DE EJECUCIÓN APORTE AL PDM (HASTA LA FECHA)": 0.0105,
  "CANTIDAD DE EJECUCION FALTANTE APORTE AL PDM (HASTA LA FECHA)": 0.0625,
  "PORCENTAJE DE EJECUCION FALTANTE APORTE AL PDM (HASTA LA FECHA)": 0.0035,
  "EVIDENCIA FINAL": "Se debe entregar estrategia...",
  "VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES": 450000000,
  "VALOR PRESUPUESTO APROBADO": 0,
  "VALOR EJECUTADO": 810590875,
  "PORCENTAJE DE EJECUCIÓN PRESUPUESTAL": 0,
  fechaSubida: "2024-12-01T22:06:16.622Z"
}
```

---

## 💡 Ventajas de Usar Firebase

### ✅ **Para Desarrolladores:**
- No necesitas servidor backend
- Datos siempre actualizados
- Fácil de mantener
- Escalable automáticamente

### ✅ **Para Usuarios:**
- Dashboard más rápido (datos en la nube)
- Actualizaciones sin regenerar archivos
- Accesible desde cualquier lugar
- Siempre sincronizado

### ✅ **Para el Municipio:**
- Datos centralizados
- Múltiples dashboards pueden leer los mismos datos
- Fácil de actualizar
- Respaldo automático en la nube

---

## 🔄 Migración de la Versión Anterior

Si ya tenías el dashboard con `datos.js`:

### **Mantener Ambas Versiones:**

**Versión Local (datos.js):**
- Funciona offline
- No requiere servidor
- Datos estáticos

**Versión Firebase:**
- Datos en tiempo real
- Requiere servidor local
- Siempre actualizada

### **Usar Solo Firebase:**

1. Reemplaza `index.html` con `index-firebase.html`
2. Reemplaza `app.js` con `app-firebase.js`
3. Elimina `datos.js` (ya no se necesita)
4. Usa un servidor local

---

## 📱 Compatibilidad

### ✅ **Navegadores Soportados:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ✅ **Dispositivos:**
- Desktop (Windows, Mac, Linux)
- Tablets
- Móviles (responsive)

---

## 🎯 Próximos Pasos

### **Mejoras Opcionales:**

1. **Autenticación:**
   - Agregar login para administradores
   - Restringir escritura solo a usuarios autenticados

2. **Búsqueda:**
   - Agregar barra de búsqueda de programas
   - Filtros por avance, presupuesto, etc.

3. **Gráficos:**
   - Agregar Chart.js para visualizaciones
   - Gráficos de barras, pastel, etc.

4. **Notificaciones:**
   - Email cuando un programa se actualice
   - Alertas de programas en riesgo

5. **Exportar:**
   - Botón para exportar a Excel
   - Generar PDF del reporte

---

## 📞 Información del Proyecto

**Dashboard:** Plan de Desarrollo Municipal 2025  
**Municipio:** Guatapé, Antioquia  
**Período:** 2024-2027  
**Firebase:** plan-de-desarrollo-49495  
**Colección:** plandesarrollo  
**Programas:** 93 en 5 secretarías  

---

## ✨ ¡Listo para Usar!

El dashboard ya está conectado a Firebase y listo para mostrar datos en tiempo real. Solo necesitas:

1. ✅ Abrir con un servidor local
2. ✅ Verificar que Firebase tenga datos
3. ✅ ¡Disfrutar del dashboard actualizado!

Para cualquier duda o mejora, consulta este README o la documentación de Firebase.
