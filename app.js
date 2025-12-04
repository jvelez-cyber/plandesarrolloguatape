// ==================== VARIABLES GLOBALES ====================
let vistaActual = 'resumen';
let secretariaActual = null;

// ==================== FUNCIONES DE NAVEGACIÓN ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

function cambiarVista(vista) {
    vistaActual = vista;
    secretariaActual = null;
    
    // Actualizar menú activo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-vista="${vista}"]`).classList.add('active');
    
    // Renderizar contenido
    if (vista === 'resumen') {
        mostrarResumen();
    }
}

function verSecretaria(nombreSecretaria) {
    vistaActual = 'secretaria';
    secretariaActual = nombreSecretaria;
    
    // Actualizar menú activo
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-secretaria="${nombreSecretaria}"]`).classList.add('active');
    
    // Renderizar secretaría
    mostrarSecretaria(nombreSecretaria);
    
    // Cerrar sidebar en móvil
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
}

// ==================== FUNCIONES DE CÁLCULO ====================
function formatearMoneda(valor) {
    if (!valor || valor === 0) return '$0';
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

function formatearNumero(valor) {
    if (!valor) return '0';
    return new Intl.NumberFormat('es-CO').format(valor);
}

function obtenerColorAvance(porcentaje) {
    if (porcentaje >= 0.7) return 'success';
    if (porcentaje >= 0.4) return 'warning';
    return 'danger';
}

function calcularEstadisticasGenerales() {
    const totalProgramas = DATOS_PROGRAMAS.length;
    
    let sumaAvances = 0;
    let sumaPresupuestoProgramado = 0;
    let sumaEjecutado = 0;
    
    DATOS_PROGRAMAS.forEach(prog => {
        sumaAvances += prog['PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)'] || 0;
        sumaPresupuestoProgramado += prog['VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES'] || 0;
        sumaEjecutado += prog['VALOR EJECUTADO'] || 0;
    });
    
    const avancePromedio = (sumaAvances / totalProgramas) * 100;
    
    return {
        totalProgramas,
        avancePromedio: avancePromedio.toFixed(1),
        presupuestoTotal: sumaPresupuestoProgramado,
        ejecutadoTotal: sumaEjecutado
    };
}

function calcularEstadisticasSecretaria(nombreSecretaria) {
    const programas = DATOS_PROGRAMAS.filter(p => p.SECRETARIA === nombreSecretaria);
    
    let sumaAvances = 0;
    let programasCompletados = 0;
    let programasEnRiesgo = 0;
    let sumaPresupuesto = 0;
    let sumaEjecutado = 0;
    
    programas.forEach(prog => {
        const avance = prog['PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)'] || 0;
        sumaAvances += avance;
        if (avance >= 1) programasCompletados++;
        if (avance < 0.4) programasEnRiesgo++;
        sumaPresupuesto += prog['VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES'] || 0;
        sumaEjecutado += prog['VALOR EJECUTADO'] || 0;
    });
    
    return {
        totalProgramas: programas.length,
        avancePromedio: ((sumaAvances / programas.length) * 100).toFixed(1),
        programasCompletados,
        programasEnRiesgo,
        presupuestoTotal: sumaPresupuesto,
        ejecutadoTotal: sumaEjecutado
    };
}

function agruparPorSecretaria() {
    const secretarias = {};
    
    DATOS_PROGRAMAS.forEach(prog => {
        const sec = prog.SECRETARIA;
        if (!secretarias[sec]) {
            secretarias[sec] = [];
        }
        secretarias[sec].push(prog);
    });
    
    return secretarias;
}

// ==================== FUNCIONES DE RENDERIZADO ====================
function mostrarResumen() {
    const stats = calcularEstadisticasGenerales();
    const agrupados = agruparPorSecretaria();
    
    let html = `
        <div class="fade-in">
            <h2 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 24px;">
                📊 Resumen Ejecutivo
            </h2>
            
            <!-- Estadísticas Generales -->
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Total Programas</div>
                    <div class="stat-value">${stats.totalProgramas}</div>
                    <div class="stat-description">En ejecución</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Avance General</div>
                    <div class="stat-value">${stats.avancePromedio}%</div>
                    <div class="stat-description">Promedio de ejecución</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Presupuesto Total</div>
                    <div class="stat-value" style="font-size: 24px;">${formatearMoneda(stats.presupuestoTotal)}</div>
                    <div class="stat-description">Programado</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Ejecutado Total</div>
                    <div class="stat-value" style="font-size: 24px;">${formatearMoneda(stats.ejecutadoTotal)}</div>
                    <div class="stat-description">A la fecha</div>
                </div>
            </div>
            
            <h3 style="font-size: 22px; font-weight: 700; color: #1e3a8a; margin: 32px 0 20px;">
                🏢 Secretarías
            </h3>
    `;
    
    // Tarjetas de secretarías
    Object.keys(agrupados).forEach(secretaria => {
        const statsSecretaria = calcularEstadisticasSecretaria(secretaria);
        const avance = parseFloat(statsSecretaria.avancePromedio);
        
        html += `
            <div class="secretaria-card" onclick="verSecretaria('${secretaria}')">
                <h3>${secretaria}</h3>
                <div class="secretaria-info">
                    <div class="info-item">
                        <div class="info-value">${statsSecretaria.totalProgramas}</div>
                        <div class="info-label">Programas</div>
                    </div>
                    <div class="info-item">
                        <div class="info-value">${avance.toFixed(1)}%</div>
                        <div class="info-label">Avance</div>
                    </div>
                    <div class="info-item">
                        <div class="info-value">${statsSecretaria.programasCompletados}</div>
                        <div class="info-label">Completados</div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${avance}%">
                        ${avance.toFixed(0)}%
                    </div>
                </div>
                <div style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 13px; color: #6b7280;">
                    <span><strong>Presupuesto:</strong> ${formatearMoneda(statsSecretaria.presupuestoTotal)}</span>
                    <span><strong>Ejecutado:</strong> ${formatearMoneda(statsSecretaria.ejecutadoTotal)}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    document.getElementById('contentArea').innerHTML = html;
}

function mostrarSecretaria(nombreSecretaria) {
    const programas = DATOS_PROGRAMAS.filter(p => p.SECRETARIA === nombreSecretaria);
    const stats = calcularEstadisticasSecretaria(nombreSecretaria);
    
    let html = `
        <div class="fade-in">
            <h2 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 24px;">
                🏢 ${nombreSecretaria}
            </h2>
            
            <!-- Estadísticas de la Secretaría -->
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Total Programas</div>
                    <div class="stat-value">${stats.totalProgramas}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Avance Promedio</div>
                    <div class="stat-value">${stats.avancePromedio}%</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Completados</div>
                    <div class="stat-value">${stats.programasCompletados}</div>
                    <div class="stat-description">≥100%</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">En Riesgo</div>
                    <div class="stat-value">${stats.programasEnRiesgo}</div>
                    <div class="stat-description">&lt;40%</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Presupuesto</div>
                    <div class="stat-value" style="font-size: 22px;">${formatearMoneda(stats.presupuestoTotal)}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Ejecutado</div>
                    <div class="stat-value" style="font-size: 22px;">${formatearMoneda(stats.ejecutadoTotal)}</div>
                </div>
            </div>
            
            <h3 style="font-size: 22px; font-weight: 700; color: #1e3a8a; margin: 32px 0 20px;">
                📋 Programas (${programas.length})
            </h3>
    `;
    
    // Renderizar cada programa
    programas.forEach((prog, index) => {
        html += renderizarPrograma(prog, index + 1);
    });
    
    html += '</div>';
    
    document.getElementById('contentArea').innerHTML = html;
}

function renderizarPrograma(prog, numero) {
    const avance = (prog['PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)'] || 0) * 100;
    const colorEstado = obtenerColorAvance(avance / 100);
    const componente = prog.COMPONENTE || 'Sin componente';
    const programa = prog.PROGRAMA || 'Sin nombre';
    const codigoProducto = prog['CÓDIGO DE PRODUCTO'] || 'N/A';
    const indicador = prog['INDICADOR DE PRODUCTO'] || 'N/A';
    const unidadMedida = prog['UNIDAD DE MEDIDA'] || 'N/A';
    const tendencia = prog['TENDENCIA'] || 'N/A';
    const meta2025 = prog['META 2025'] || 0;
    const cantidadEjecutada = prog['CANTIDAD DE EJECUCION DEL PROGRAMA (HASTA LA FECHA)'] || 0;
    const cantidadFaltante = prog['CANTIDAD DE EJECUCION  FALTANTE   APORTE AL PDM (HASTA LA FECHA)'] || 0;
    const presupuestoProgramado = prog['VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES'] || 0;
    const presupuestoAprobado = prog['VALOR PRESUPUESTO APROBADO'] || 0;
    const valorEjecutado = prog['VALOR EJECUTADO'] || 0;
    const aporteEjecutado = (prog['PORCENTAJE DE EJECUCIÓN APORTE AL PDM (HASTA LA FECHA)'] || 0) * 100;
    const aporteFaltante = (prog['PORCENTAJE DE EJECUCION FALTANTE  APORTE AL PDM (HASTA LA FECHA)'] || 0) * 100;
    const ejecucionPresupuestal = (prog['PORCENTAJE DE EJECUCIÓN PRESUPUESTAL'] || 0) * 100;
    const evidencia = prog['EVIDENCIA FINAL'];
    
    return `
        <div class="card-programa">
            <!-- Header del Programa -->
            <div class="programa-header">
                <div class="programa-titulo">
                    <div class="programa-componente">
                        <strong>Componente:</strong> ${componente}
                    </div>
                    <h3>${numero}. ${programa}</h3>
                </div>
                <span class="badge badge-${colorEstado}">
                    ${avance.toFixed(0)}% Avance
                </span>
            </div>
            
            <!-- Tabla de Información -->
            <table class="info-table">
                <tr>
                    <td>Código de Producto</td>
                    <td>${codigoProducto}</td>
                </tr>
                <tr>
                    <td>Indicador de Producto</td>
                    <td>${indicador}</td>
                </tr>
                <tr>
                    <td>Unidad de Medida</td>
                    <td>${unidadMedida}</td>
                </tr>
                <tr>
                    <td>Tendencia</td>
                    <td>${tendencia}</td>
                </tr>
                <tr>
                    <td>Meta 2025</td>
                    <td><strong>${formatearNumero(meta2025)}</strong></td>
                </tr>
                <tr>
                    <td>Cantidad Ejecutada</td>
                    <td><strong style="color: #10b981;">${formatearNumero(cantidadEjecutada)}</strong></td>
                </tr>
                <tr>
                    <td>Cantidad Faltante</td>
                    <td><strong style="color: #ef4444;">${formatearNumero(cantidadFaltante)}</strong></td>
                </tr>
            </table>
            
            <!-- Barra de Progreso -->
            <div class="progress-container">
                <div class="progress-label">
                    <span>Progreso del Programa</span>
                    <span>${avance.toFixed(1)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${avance}%">
                        ${avance >= 15 ? avance.toFixed(0) + '%' : ''}
                    </div>
                </div>
            </div>
            
            <!-- Información Presupuestal -->
            <div class="presupuesto-grid">
                <div class="presupuesto-card">
                    <div class="presupuesto-label">Presupuesto Programado</div>
                    <div class="presupuesto-valor">${formatearMoneda(presupuestoProgramado)}</div>
                </div>
                <div class="presupuesto-card aprobado">
                    <div class="presupuesto-label">Presupuesto Aprobado</div>
                    <div class="presupuesto-valor">${formatearMoneda(presupuestoAprobado)}</div>
                </div>
                <div class="presupuesto-card ejecutado">
                    <div class="presupuesto-label">Valor Ejecutado</div>
                    <div class="presupuesto-valor">${formatearMoneda(valorEjecutado)}</div>
                </div>
            </div>
            
            <!-- Aportes al PDM -->
            <div class="aportes-grid">
                <div class="aporte-item">
                    <div class="aporte-valor">${aporteEjecutado.toFixed(2)}%</div>
                    <div class="aporte-label">Aporte al PDM Ejecutado</div>
                </div>
                <div class="aporte-item">
                    <div class="aporte-valor">${aporteFaltante.toFixed(2)}%</div>
                    <div class="aporte-label">Aporte al PDM Faltante</div>
                </div>
                <div class="aporte-item">
                    <div class="aporte-valor">${ejecucionPresupuestal.toFixed(1)}%</div>
                    <div class="aporte-label">Ejecución Presupuestal</div>
                </div>
            </div>
            
            <!-- Evidencia -->
            ${evidencia ? `
                <div class="evidencia-box">
                    <strong>📄 Evidencia Final Requerida:</strong>
                    <p>${evidencia}</p>
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard cargado - Total de programas:', DATOS_PROGRAMAS.length);
    mostrarResumen();
});
