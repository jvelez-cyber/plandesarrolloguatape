# 🏛️ Dashboard de Compromisos - Alcaldía de Guatapé

## #JuntosConstruimos

Sistema de gestión y seguimiento de compromisos del Consejo de Gobierno de la Alcaldía de Guatapé, Antioquia.

![Dashboard Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+de+Compromisos)

---

## 🎯 Características

### ✨ Dashboard Interactivo
- 📊 Visualización de estadísticas en tiempo real
- 📈 Gráficos de cumplimiento (barras y torta)
- 🔍 Filtros avanzados por responsable, estado y año
- 🎨 Diseño moderno y responsive

### 📋 Gestión de Compromisos
- ✅ Lista completa de compromisos
- 🔎 Búsqueda por descripción
- 👥 Asignación múltiple de responsables
- 📅 Seguimiento de fechas y estados
- 🏷️ Clasificación por cumplimiento:
  - **Si** - Cumplido (Verde)
  - **En proceso** - En desarrollo (Amarillo)
  - **No** - No cumplido (Rojo)
  - **En término** - Plazo vigente (Gris)

### 🚀 Tecnologías
- **Frontend:** React 18
- **Backend:** Firebase (Firestore + Storage)
- **Gráficos:** Recharts
- **Iconos:** Lucide Icons
- **Estilos:** CSS moderno con gradientes

---

## 📁 Estructura del Proyecto

```
dashboard-guatape/
│
├── dashboard-guatape.html          # Aplicación principal (standalone)
├── dashboard-compromisos.jsx       # Componente React
├── firebaseConfig.js               # Configuración de Firebase
├── datos_para_firebase.json        # Datos para migración
├── GUIA_IMPLEMENTACION.md          # Guía detallada
└── README.md                       # Este archivo
```

---

## 🚀 Inicio Rápido

### Prerequisitos
- Cuenta de Firebase (gratuita)
- Navegador web moderno
- Editor de texto (opcional)

### Instalación en 3 Pasos

#### 1️⃣ Configurar Firebase

```bash
# Crear proyecto en Firebase Console
https://console.firebase.google.com

# Habilitar Firestore Database y Storage
# Copiar credenciales de configuración
```

#### 2️⃣ Configurar Credenciales

Abre `dashboard-guatape.html` y actualiza:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

#### 3️⃣ Abrir Dashboard

```bash
# Simplemente abre el archivo HTML en tu navegador
open dashboard-guatape.html
```

---

## 📊 Estructura de Datos

### Compromisos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| no | Number | Número del compromiso |
| fechaReunion | String | Fecha de reunión (YYYY-MM-DD) |
| descripcion | String | Descripción del compromiso |
| responsable1-3 | String | Códigos de responsables |
| fechaCumplimiento | String | Fecha de cumplimiento |
| cumplimiento | String | Estado (Si/No/En proceso/En término) |
| valoracion | String | Valoración (Oportuno/Extemporáneo) |

### Responsables

| Campo | Tipo | Descripción |
|-------|------|-------------|
| codigo | String | Código único (C-001) |
| cargo | String | Nombre del cargo |

### Secretarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre completo |
| codigo | String | Código del responsable |
| cargo | String | Cargo que desempeña |
| fotoUrl | String | URL de la foto |

---

## 📖 Documentación

### Archivos Incluidos

1. **dashboard-guatape.html** 
   - Aplicación completa y lista para usar
   - No requiere instalación de dependencias
   - Funciona directamente en el navegador

2. **firebaseConfig.js**
   - Funciones de Firebase para CRUD
   - Operaciones de Storage
   - Gestión de estadísticas

3. **datos_para_firebase.json**
   - Estructura de datos de ejemplo
   - Lista para importar a Firebase

4. **GUIA_IMPLEMENTACION.md**
   - Guía paso a paso completa
   - Configuración detallada
   - Solución de problemas

---

## 🎨 Diseño

### Paleta de Colores

```css
/* Gradiente Principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Estados */
--cumplido: #10b981      /* Verde */
--proceso: #f59e0b        /* Amarillo */
--no-cumplido: #ef4444    /* Rojo */
--en-termino: #6b7280     /* Gris */
```

### Responsive Design
- ✅ Desktop (1400px+)
- ✅ Tablet (768px - 1400px)
- ✅ Mobile (< 768px)

---

## 🔐 Seguridad

### Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

⚠️ **Importante:** 
- Lectura pública para visualización
- Escritura solo con autenticación
- Considera implementar roles para producción

---

## 📈 Funcionalidades Futuras

- [ ] Autenticación de usuarios (Firebase Auth)
- [ ] Exportación a Excel/PDF
- [ ] Notificaciones por email
- [ ] Sistema de comentarios
- [ ] Historial de cambios
- [ ] Dashboard por responsable
- [ ] Reportes automatizados
- [ ] App móvil (React Native)
- [ ] Integración con Power BI

---

## 🤝 Contribuir

Este proyecto fue desarrollado para la Alcaldía de Guatapé. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📞 Soporte

### Contacto
- 📧 Email: soporte@municipioguatape.gov.co
- 📱 Teléfono: +57 XXX XXX XXXX
- 🌐 Web: www.guatape-antioquia.gov.co

### Recursos
- [Documentación Firebase](https://firebase.google.com/docs)
- [Guía de Implementación](GUIA_IMPLEMENTACION.md)
- [React Docs](https://react.dev)
- [Recharts](https://recharts.org)

---

## 📝 Licencia

Copyright © 2025 Alcaldía de Guatapé, Antioquia

Este proyecto fue desarrollado para uso interno de la Alcaldía de Guatapé.

---

## 🙏 Agradecimientos

- **Alcaldía de Guatapé** - Por confiar en este proyecto
- **Consejo de Gobierno** - Por su colaboración
- **Equipo de Desarrollo** - Por hacer esto posible

---

## 📸 Capturas de Pantalla

### Dashboard Principal
![Dashboard](https://via.placeholder.com/800x500/667eea/ffffff?text=Vista+Dashboard)

### Tabla de Compromisos
![Tabla](https://via.placeholder.com/800x500/764ba2/ffffff?text=Tabla+de+Compromisos)

---

## 🔄 Actualizaciones

### Versión 1.0.0 (30/01/2025)
- ✅ Lanzamiento inicial
- ✅ Dashboard con estadísticas
- ✅ Tabla de compromisos
- ✅ Filtros y búsqueda
- ✅ Gráficos interactivos
- ✅ Diseño responsive

---

**Hecho con ❤️ para Guatapé, Antioquia**

#JuntosConstruimos 🏛️
