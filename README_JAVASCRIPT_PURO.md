# 🎯 Dashboard Plan de Desarrollo - Guatapé (JavaScript Puro)

## 📦 Archivos del Proyecto

Esta versión del dashboard está creada con **HTML, CSS y JavaScript puros** (sin frameworks ni dependencias externas).

```
dashboard-guatape/
│
├── 📄 index.html          # HTML principal (3.6 KB)
├── 🎨 styles.css          # Estilos CSS (9.9 KB)
├── ⚙️  app.js              # Lógica JavaScript (16 KB)
└── 📊 datos.js            # Datos de programas (95 KB)
```

**Total: ~125 KB** (todo el dashboard funcional)

---

## 🚀 Inicio Rápido (3 pasos)

### **1. Descarga los 4 archivos**
Asegúrate de tener estos archivos en la misma carpeta:
- `index.html`
- `styles.css`
- `app.js`
- `datos.js`

### **2. Abre index.html**
- **Opción A:** Doble clic en `index.html`
- **Opción B:** Arrastra `index.html` a tu navegador
- **Opción C:** Clic derecho → Abrir con → Chrome/Firefox/Edge

### **3. ¡Listo!**
El dashboard se abrirá y funcionará completamente.

---

## ✨ Características

### ✅ **Sin Dependencias Externas**
- ❌ No usa React
- ❌ No usa jQuery
- ❌ No usa Bootstrap
- ❌ No necesita npm install
- ✅ **100% HTML, CSS y JavaScript vanilla**

### ✅ **Funcional Completo**
- 93 programas del Plan de Desarrollo
- 5 secretarías con navegación
- Cálculo automático de estadísticas
- Barras de progreso animadas
- Diseño responsive (móvil, tablet, desktop)
- Menú lateral con navegación
- Código de colores por avance

### ✅ **Rápido y Ligero**
- Carga instantánea
- No requiere compilación
- Funciona offline después de la primera carga
- Peso total: ~125 KB

---

## 📝 Descripción de Cada Archivo

### 1️⃣ **index.html** (Estructura)

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Sidebar con menú de navegación -->
    <aside class="sidebar">...</aside>
    
    <!-- Contenido principal dinámico -->
    <main class="main-content">
        <div id="contentArea"></div>
    </main>
    
    <!-- Scripts -->
    <script src="datos.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

**¿Qué hace?**
- Define la estructura HTML del dashboard
- Incluye el sidebar con menú de navegación
- Tiene un div `#contentArea` donde se carga el contenido dinámicamente
- Carga los scripts de datos y la aplicación

**¿Cuándo editarlo?**
- Para cambiar el título de la página
- Para agregar meta tags
- Para modificar el logo o escudo
- Para cambiar los nombres de las secretarías en el menú

---

### 2️⃣ **styles.css** (Estilos)

```css
@import url('https://fonts.googleapis.com/.../Montserrat...');

/* Estilos del sidebar */
.sidebar { ... }

/* Estilos de las tarjetas */
.card-programa { ... }

/* Responsive para móviles */
@media (max-width: 768px) { ... }
```

**¿Qué hace?**
- Define todos los estilos visuales del dashboard
- Colores institucionales de Guatapé
- Animaciones y efectos hover
- Diseño responsive para diferentes dispositivos

**¿Cuándo editarlo?**
- Para cambiar colores institucionales
- Para modificar tamaños de fuente
- Para ajustar el diseño del menú
- Para personalizar las animaciones

**Ejemplo de edición:**
```css
/* Cambiar color del sidebar */
.sidebar {
    background: linear-gradient(180deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
}

/* Cambiar colores de las barras de progreso */
.progress-fill {
    background: linear-gradient(90deg, #COLOR1 0%, #COLOR2 50%, #COLOR3 100%);
}
```

---

### 3️⃣ **app.js** (Lógica JavaScript)

```javascript
// Variables globales
let vistaActual = 'resumen';
let secretariaActual = null;

// Funciones de navegación
function cambiarVista(vista) { ... }
function verSecretaria(nombreSecretaria) { ... }

// Funciones de cálculo
function calcularEstadisticasGenerales() { ... }
function formatearMoneda(valor) { ... }

// Funciones de renderizado
function mostrarResumen() { ... }
function mostrarSecretaria(nombreSecretaria) { ... }
function renderizarPrograma(prog, numero) { ... }

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    mostrarResumen();
});
```

**¿Qué hace?**
- Maneja toda la lógica del dashboard
- Calcula estadísticas y porcentajes
- Renderiza el contenido dinámicamente
- Formatea números y monedas
- Gestiona la navegación entre vistas

**Funciones principales:**
- `cambiarVista()` - Cambia entre resumen y secretarías
- `verSecretaria()` - Muestra el detalle de una secretaría
- `mostrarResumen()` - Genera el HTML del resumen ejecutivo
- `mostrarSecretaria()` - Genera el HTML de una secretaría
- `renderizarPrograma()` - Crea el HTML de cada programa
- `formatearMoneda()` - Formatea valores en pesos colombianos
- `calcularEstadisticasGenerales()` - Calcula stats del resumen
- `calcularEstadisticasSecretaria()` - Calcula stats por secretaría

**¿Cuándo editarlo?**
- Para agregar nuevas funcionalidades
- Para modificar cómo se calculan las estadísticas
- Para cambiar el formato de los números
- Para agregar nuevas secciones o vistas

---

### 4️⃣ **datos.js** (Datos de Programas)

```javascript
const DATOS_PROGRAMAS = [
  {
    "COMPONENTE": "0101\nJuntos por la Seguridad...",
    "PROGRAMA": "010101\nImplementación de un plan...",
    "CÓDIGO DE PRODUCTO": 450104800,
    "META 2025": 0.25,
    "PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)": 0.75,
    "VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES": 450000000,
    "VALOR EJECUTADO": 810590875,
    "SECRETARIA": "Secretaria de Gobierno"
  },
  // ... 92 programas más
];
```

**¿Qué contiene?**
- Array con 93 objetos (uno por programa)
- Todos los campos del Excel original
- Datos presupuestales completos
- Indicadores y metas

**Campos principales:**
- `COMPONENTE` - Componente al que pertenece
- `PROGRAMA` - Nombre del programa
- `META 2025` - Meta establecida
- `PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)` - Avance (0-1)
- `VALOR PROGRAMADO` - Presupuesto programado
- `VALOR EJECUTADO` - Presupuesto ejecutado
- `SECRETARIA` - Secretaría responsable

**¿Cuándo editarlo?**
- Para actualizar datos de avance
- Para modificar presupuestos
- Para agregar nuevos programas
- Para corregir información

**Ejemplo de actualización:**
```javascript
// Buscar el programa que quieres actualizar
{
  "PROGRAMA": "010101\nImplementación...",
  "PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)": 0.85,  // Cambiar de 75% a 85%
  "VALOR EJECUTADO": 900000000  // Actualizar valor
}
```

---

## 🛠️ Ediciones Comunes

### ✏️ **Actualizar el avance de un programa**

1. Abre `datos.js`
2. Busca el programa por su código (Ctrl+F)
3. Modifica el campo:
```javascript
"PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)": 0.85,  // 85%
```
4. Guarda el archivo
5. Recarga el navegador (F5)

---

### 🎨 **Cambiar colores institucionales**

Abre `styles.css` y busca:

```css
/* Línea ~30 - Color del menú lateral */
.sidebar {
    background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
}

/* Línea ~120 - Color del menú activo */
.menu-item.active {
    border-left-color: #fbbf24;  /* Dorado */
}

/* Línea ~400 - Color de barras de progreso */
.progress-fill {
    background: linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
}
```

Reemplaza los valores hexadecimales (#1e3a8a) con tus colores.

**Colores actuales de Guatapé:**
- Azul oscuro: `#1e3a8a`
- Azul medio: `#3b82f6`
- Azul claro: `#60a5fa`
- Dorado: `#fbbf24`

---

### 📊 **Agregar un nuevo programa**

1. Abre `datos.js`
2. Copia un programa existente completo
3. Modifica todos sus valores
4. Pégalo antes del `];` final
5. No olvides la coma al final del objeto anterior

```javascript
const DATOS_PROGRAMAS = [
  { /* programa existente */ },
  { /* otro programa */ },
  { /* NUEVO PROGRAMA */
    "COMPONENTE": "0601\nNuevo Componente",
    "PROGRAMA": "060101\nMi nuevo programa",
    "CÓDIGO DE PRODUCTO": 999999999,
    "META 2025": 10,
    "PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)": 0,
    "VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES": 100000000,
    "VALOR EJECUTADO": 0,
    "SECRETARIA": "Secretaria de Gobierno"
  }  // ← No olvidar la coma si hay más programas después
];
```

---

### 🖼️ **Cambiar el escudo de Guatapé**

En `index.html`, busca (línea ~20):

```html
<img 
    src="https://upload.wikimedia.org/.../Escudo_de_Guatapé.svg/120px..."
    alt="Escudo de Guatapé"
    class="logo-img"
/>
```

Reemplaza la URL por la de tu nueva imagen.

---

### 📱 **Agregar una nueva secretaría al menú**

En `index.html`, dentro de `<nav class="sidebar-nav">`, agrega:

```html
<button class="menu-item" onclick="verSecretaria('Tu Nueva Secretaria')" data-secretaria="Tu Nueva Secretaria">
    <span class="menu-icon">🏢</span>
    <span>Tu Nueva Secretaría</span>
</button>
```

Y asegúrate de que en `datos.js` existan programas con:
```javascript
"SECRETARIA": "Tu Nueva Secretaria"
```

---

## 🌐 Uso en Producción

### **Subir a un servidor web:**

```
tu-servidor/
├── index.html
├── styles.css
├── app.js
└── datos.js
```

1. Sube los 4 archivos a tu servidor (FTP, cPanel, etc.)
2. Accede a través de tu dominio: `https://tudominio.com/index.html`
3. ¡Funciona inmediatamente!

### **No necesitas:**
- ❌ Node.js
- ❌ npm install
- ❌ Build process
- ❌ Servidor especial

### **Solo necesitas:**
- ✅ Un servidor web básico (Apache, Nginx, etc.)
- ✅ Los 4 archivos en la misma carpeta

---

## 📱 Diseño Responsive

El dashboard se adapta automáticamente a:

- 📱 **Móviles** (< 768px): Menú hamburguesa, layout vertical
- 💻 **Tablets** (768px - 1024px): Menú lateral compacto
- 🖥️ **Desktop** (> 1024px): Menú lateral completo, múltiples columnas

---

## 🔧 Compatibilidad

### ✅ Navegadores Soportados:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ❌ No Compatible con:
- Internet Explorer (cualquier versión)
- Navegadores muy antiguos (anteriores a 2020)

---

## 🆘 Solución de Problemas

### ❌ **El dashboard no carga / pantalla en blanco**

**Problema:** Los archivos no están en la misma carpeta

**Solución:**
```
✅ CORRECTO:
carpeta/
├── index.html
├── styles.css
├── app.js
└── datos.js

❌ INCORRECTO:
carpeta/
├── html/
│   └── index.html
└── scripts/
    ├── app.js
    └── datos.js
```

---

### ❌ **Error: "DATOS_PROGRAMAS is not defined"**

**Problema:** El archivo `datos.js` no se está cargando

**Solución:**
1. Verifica que `datos.js` esté en la misma carpeta que `index.html`
2. Abre la consola del navegador (F12)
3. Ve a la pestaña "Network" y verifica si `datos.js` se cargó
4. Si dice "404", el archivo no está en la ubicación correcta

---

### ❌ **Los estilos no se aplican**

**Problema:** El archivo CSS no se carga

**Solución:**
1. Verifica que `styles.css` esté en la misma carpeta
2. Abre el HTML y verifica que diga: `<link rel="stylesheet" href="styles.css">`
3. No debe decir `href="./styles.css"` o `href="../styles.css"`

---

### ❌ **Los cambios no se reflejan**

**Solución:**
1. Guarda todos los archivos (Ctrl+S)
2. Limpia la caché del navegador (Ctrl+Shift+R o Ctrl+F5)
3. O abre en modo incógnito (Ctrl+Shift+N)

---

## 📊 Datos Incluidos

### Por cada programa:
- ✅ Componente y código
- ✅ Indicador y unidad de medida
- ✅ Meta 2025
- ✅ Cantidad ejecutada y faltante
- ✅ Porcentaje de ejecución
- ✅ Presupuesto (programado/aprobado/ejecutado)
- ✅ Aportes al PDM
- ✅ Evidencia final requerida

### Estadísticas calculadas automáticamente:
- ✅ Total de programas
- ✅ Avance promedio general y por secretaría
- ✅ Programas completados
- ✅ Programas en riesgo
- ✅ Presupuesto total y ejecutado

---

## 🎨 Personalización Avanzada

### Agregar una nueva vista/sección:

1. En `app.js`, crea una nueva función:
```javascript
function mostrarMiNuevaVista() {
    let html = `
        <div class="fade-in">
            <h2>Mi Nueva Vista</h2>
            <!-- Tu contenido aquí -->
        </div>
    `;
    document.getElementById('contentArea').innerHTML = html;
}
```

2. En `index.html`, agrega un botón en el menú:
```html
<button class="menu-item" onclick="mostrarMiNuevaVista()">
    <span class="menu-icon">📈</span>
    <span>Mi Nueva Vista</span>
</button>
```

---

## 📞 Información del Proyecto

**Proyecto:** Dashboard Plan de Desarrollo Municipal 2025  
**Municipio:** Guatapé, Antioquia  
**Período:** 2024-2027  
**Programas:** 93 programas en 5 secretarías  
**Tecnologías:** HTML5, CSS3, JavaScript ES6+  
**Sin dependencias:** 100% código vanilla  

---

## ✨ Ventajas de esta Versión

✅ **Simple:** Solo 4 archivos, fácil de mantener  
✅ **Rápido:** Carga instantánea, sin compilación  
✅ **Portable:** Funciona en cualquier servidor web  
✅ **Editable:** Fácil de modificar sin conocimientos avanzados  
✅ **Sin dependencias:** No necesita npm, webpack, etc.  
✅ **Offline:** Funciona sin internet después de la primera carga  
✅ **Ligero:** Solo 125 KB en total  

---

## 🎉 ¡Listo para usar!

El dashboard está completamente funcional y listo para producción. Solo descarga los archivos, ábrelos en tu navegador, y comienza a usar el dashboard del Plan de Desarrollo Municipal de Guatapé.

Para cualquier duda o personalización adicional, consulta este README o los comentarios en el código.
