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

function formatearMonedaAbreviada(valor) {
    if (!valor || valor === 0) return '$0';
 
    // Miles de millones (Billones en español latino)
    if (valor >= 1000000000000) {
        const millones = valor / 1000000000000;
        return `$${millones.toFixed(3).replace('.', ',')} B`;
    }



    // Miles de millones (Billones en español latino)
    if (valor >= 1000000000) {
        const millones = valor / 1000000000;
        return `$${millones.toFixed(3).replace('.', ',')} MM`;
    }
    // Millones
    else if (valor >= 1000000) {
        const millones = valor / 1000000;
        return `$${millones.toFixed(3).replace('.', ',')} M`;
    }
    // Miles
    else if (valor >= 1000) {
        const miles = valor / 1000;
        return `$${miles.toFixed(1).replace('.', ',')} K`;
    }
    
    return `$${valor.toFixed(0)}`;
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

    const avancePromedio = sumaAvances;
    
    



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
        const avance = prog['PORCENTAJE DE EJECUCIÓN APORTE AL PDM (HASTA LA FECHA)'] || 0;
        sumaAvances += avance;
        if (avance >= 1) programasCompletados++;
        if (avance < 0.4) programasEnRiesgo++;
        sumaPresupuesto += prog['VALOR PROGRAMADO EN PLAN PLURIANUAL DE INVERSIONES'] || 0;
        sumaEjecutado += prog['VALOR EJECUTADO'] || 0;
    });
    
    return {
        totalProgramas: programas.length,
        avancePromedio: (sumaAvances*100).toFixed(1),
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
    const semaforoData = calcularSemaforo();
    
    let html = `
        <div class="fade-in">
            <!-- Header del Dashboard -->
            <div class="dashboard-header">
                <h2>📊 Resumen Ejecutivo</h2>
                <div class="dashboard-subtitle">
                    Plan de Desarrollo Municipal "Juntos Construimos 2024-2027"
                </div>
            </div>
            
            <!-- Estadísticas Generales Mejoradas -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">📋</div>
                    <div class="kpi-value">${stats.totalProgramas}</div>
                    <div class="kpi-label">Total Programas</div>
                </div>
                <div class="kpi-card kpi-card-wide">
                    <div class="kpi-icon">📈</div>
                    <div class="kpi-value">${stats.avancePromedio}%</div>
                    <div class="kpi-label">Avance General</div>
                    <div class="kpi-progress-mini">
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: ${stats.avancePromedio}%; background-color: ${stats.avancePromedio >= 70 ? '#10b981' : stats.avancePromedio >= 40 ? '#f59e0b' : '#ef4444'};">
                            </div>
                        </div>
                        <div class="kpi-progress-labels">
                            <span class="label-avance">✓ ${stats.avancePromedio}%</span>
                            <span class="label-faltante">⏳ ${(100 - stats.avancePromedio).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">✅</div>
                    <div class="kpi-value">${semaforoData.excelente}</div>
                    <div class="kpi-label">Completados</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">⚠️</div>
                    <div class="kpi-value">${semaforoData.critico}</div>
                    <div class="kpi-label">En Riesgo</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">💰</div>
                    <div class="kpi-value" style="font-size: 22px;">${formatearMonedaAbreviada(stats.presupuestoTotal)}</div>
                    <div class="kpi-label">Presupuesto Total</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">💵</div>
                    <div class="kpi-value" style="font-size: 22px;">${formatearMonedaAbreviada(stats.ejecutadoTotal)}</div>
                    <div class="kpi-label">Ejecutado</div>
                </div>
            </div>
            
            <!-- Semáforo de Estado -->
            <div class="semaforo-container">
                <h3>🚦 Semáforo de Estado de Programas</h3>
                <div class="semaforo-grid">
                    <div class="semaforo-item excelente">
                        <div class="semaforo-icon">🟢</div>
                        <div class="semaforo-label">Excelente</div>
                        <div class="semaforo-count">${semaforoData.excelente}</div>
                        <div class="semaforo-percentage">${semaforoData.excelentePorc}% del total</div>
                        <div style="font-size: 12px; color: #059669; margin-top: 8px;">≥ 80% de avance</div>
                    </div>
                    <div class="semaforo-item bueno">
                        <div class="semaforo-icon">🟡</div>
                        <div class="semaforo-label">Bueno</div>
                        <div class="semaforo-count">${semaforoData.bueno}</div>
                        <div class="semaforo-percentage">${semaforoData.buenoPorc}% del total</div>
                        <div style="font-size: 12px; color: #65a30d; margin-top: 8px;">60% - 79% de avance</div>
                    </div>
                    <div class="semaforo-item regular">
                        <div class="semaforo-icon">🟠</div>
                        <div class="semaforo-label">Regular</div>
                        <div class="semaforo-count">${semaforoData.regular}</div>
                        <div class="semaforo-percentage">${semaforoData.regularPorc}% del total</div>
                        <div style="font-size: 12px; color: #d97706; margin-top: 8px;">40% - 59% de avance</div>
                    </div>
                    <div class="semaforo-item critico">
                        <div class="semaforo-icon">🔴</div>
                        <div class="semaforo-label">Crítico</div>
                        <div class="semaforo-count">${semaforoData.critico}</div>
                        <div class="semaforo-percentage">${semaforoData.criticoPorc}% del total</div>
                        <div style="font-size: 12px; color: #dc2626; margin-top: 8px;">&lt; 40% de avance</div>
                    </div>
                </div>
            </div>
            
            <!-- Gráficos -->
            <div class="charts-container">
                <div class="chart-card">
                    <h3>📊 Distribución por Estado</h3>
                    <div class="chart-wrapper">
                        <canvas id="chartEstado"></canvas>
                    </div>
                </div>
                <div class="chart-card">
                    <h3>🏢 Programas por Secretaría</h3>
                    <div class="chart-wrapper">
                        <canvas id="chartSecretarias"></canvas>
                    </div>
                </div>
                <div class="chart-card">
                    <h3>💰 Presupuesto vs Ejecutado</h3>
                    <div class="chart-wrapper">
                        <canvas id="chartPresupuesto"></canvas>
                    </div>
                </div>
                <div class="chart-card">
                    <h3>📈 Avance por Secretaría</h3>
                    <div class="chart-wrapper">
                        <canvas id="chartAvances"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Análisis Inteligente -->
            <div class="analysis-section">
                <h3>💡 Análisis Rápido</h3>
                ${generarAnalisisInteligente(stats, semaforoData, agrupados)}
            </div>
            
            <h3 style="font-size: 22px; font-weight: 700; color: #1e3a8a; margin: 32px 0 20px;">
                🏢 Secretarías (${Object.keys(agrupados).length})
            </h3>
    `;
    
    // Tarjetas de secretarías
    Object.keys(agrupados).forEach(secretaria => {
        const statsSecretaria = calcularEstadisticasSecretaria(secretaria);
        const avance = parseFloat(statsSecretaria.avancePromedio);
        const colorBorde = obtenerColorBordeSecretaria(avance);
        
        // Obtener icono según la secretaría
        let icono = '🏢';
        if (secretaria.includes('Gobierno')) icono = '🏛️';
        else if (secretaria.includes('Bienestar') || secretaria.includes('Social')) icono = '👥';
        else if (secretaria.includes('Turismo')) icono = '🏖️';
        else if (secretaria.includes('Planeacion') || secretaria.includes('Obras')) icono = '🏗️';
        else if (secretaria.includes('Medio Ambiente') || secretaria.includes('Rural')) icono = '🌿';
        
        html += `
            <div class="secretaria-card-mejorada" onclick="verSecretaria('${secretaria}')" style="border-top-color: ${colorBorde}">
                <div class="secretaria-header-mejorada">
                    <span class="secretaria-icono">${icono}</span>
                    <h3 class="secretaria-titulo">${secretaria}</h3>
                </div>
                
                <div class="secretaria-stats-grid">
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">TOTAL PROGRAMAS</div>
                        <div class="stat-item-value">${statsSecretaria.totalProgramas}</div>
                    </div>
                        <div class="stat-item-secretaria stat-item-with-bar">
                            <div class="stat-item-label">AVANCE PROMEDIO</div>
                            <div class="stat-item-value" style="color: ${colorBorde}">${avance.toFixed(1)}%</div>
                            <div class="mini-progress-bar-secretaria">
                                <div class="mini-progress-fill" style="width: ${avance}%; background-color: ${colorBorde};"></div>
                            </div>
                            <div class="mini-progress-labels-secretaria">
                                <span class="mini-label-avance">✓ ${avance.toFixed(1)}%</span>
                                <span class="mini-label-faltante">⏳ ${(100 - avance).toFixed(1)}%</span>
                            </div>
                        </div>
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">COMPLETADOS</div>
                        <div class="stat-item-value">${statsSecretaria.programasCompletados}</div>
                        <div class="stat-item-sublabel">≥100%</div>
                    </div>
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">EN RIESGO</div>
                        <div class="stat-item-value">${statsSecretaria.programasEnRiesgo}</div>
                        <div class="stat-item-sublabel"><40%</div>
                    </div>
                </div>
                
                <div class="secretaria-stats-grid" style="margin-top: 16px;">
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">PRESUPUESTO</div>
                        <div class="stat-item-value" style="font-size: 18px;">${formatearMonedaAbreviada(statsSecretaria.presupuestoTotal)}</div>
                    </div>
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">EJECUTADO</div>
                        <div class="stat-item-value" style="font-size: 18px; color: #10b981;">${formatearMonedaAbreviada(statsSecretaria.ejecutadoTotal)}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    document.getElementById('contentArea').innerHTML = html;
    
    // Renderizar gráficos después de que el HTML esté en el DOM
    setTimeout(() => {
        renderizarGraficos(semaforoData, agrupados, stats);
    }, 100);
}

// Función para calcular datos del semáforo
function calcularSemaforo() {
    let excelente = 0;  // >= 80%
    let bueno = 0;      // 60-79%
    let regular = 0;    // 40-59%
    let critico = 0;    // < 40%
    
    DATOS_PROGRAMAS.forEach(prog => {
        const avance = (prog['PORCENTAJE DE EJECUCION DEL  PROGRAMA (HASTA LA FECHA)'] || 0) * 100;
        if (avance >= 80) excelente++;
        else if (avance >= 60) bueno++;
        else if (avance >= 40) regular++;
        else critico++;
    });
    
    const total = DATOS_PROGRAMAS.length;
    
    return {
        excelente,
        bueno,
        regular,
        critico,
        excelentePorc: ((excelente / total) * 100).toFixed(1),
        buenoPorc: ((bueno / total) * 100).toFixed(1),
        regularPorc: ((regular / total) * 100).toFixed(1),
        criticoPorc: ((critico / total) * 100).toFixed(1)
    };
}

// Función para generar análisis inteligente
function generarAnalisisInteligente(stats, semaforo, agrupados) {
    let html = '';
    
    // Análisis de avance general
    const avanceGeneral = parseFloat(stats.avancePromedio);
    if (avanceGeneral >= 70) {
        html += `
            <div class="insight-box">
                <p>✅ <strong>Excelente progreso:</strong> El plan presenta un avance del ${stats.avancePromedio}%, superando las expectativas para esta etapa del período 2024-2027.</p>
            </div>
        `;
    } else if (avanceGeneral >= 50) {
        html += `
            <div class="insight-box">
                <p>📊 <strong>Avance satisfactorio:</strong> Con un ${stats.avancePromedio}% de ejecución, el plan muestra un progreso adecuado que requiere seguimiento continuo.</p>
            </div>
        `;
    } else {
        html += `
            <div class="insight-box">
                <p>⚠️ <strong>Atención requerida:</strong> El avance del ${stats.avancePromedio}% indica la necesidad de acelerar la ejecución de programas para cumplir las metas del cuatrienio.</p>
            </div>
        `;
    }
    
    // Análisis de programas en riesgo
    if (semaforo.critico > 0) {
        html += `
            <div class="insight-box">
                <p>🔴 <strong>Programas críticos:</strong> ${semaforo.critico} programas (${semaforo.criticoPorc}%) están en estado crítico con menos del 40% de avance. Se recomienda priorizar estos programas.</p>
            </div>
        `;
    }
    
    // Análisis de secretaría con mejor desempeño
    let mejorSecretaria = '';
    let mejorAvance = 0;
    Object.keys(agrupados).forEach(sec => {
        const stats = calcularEstadisticasSecretaria(sec);
        const avance = parseFloat(stats.avancePromedio);
        if (avance > mejorAvance) {
            mejorAvance = avance;
            mejorSecretaria = sec;
        }
    });
    
    html += `
        <div class="insight-box">
            <p>🏆 <strong>Mejor desempeño:</strong> ${mejorSecretaria} lidera con un ${mejorAvance.toFixed(1)}% de avance promedio en sus programas.</p>
        </div>
    `;
    
    // Análisis presupuestal
    const ejecucionPresupuestal = (stats.ejecutadoTotal / stats.presupuestoTotal) * 100;
    html += `
        <div class="insight-box">
            <p>💰 <strong>Ejecución presupuestal:</strong> Se ha ejecutado el ${ejecucionPresupuestal.toFixed(1)}% del presupuesto total programado (${formatearMoneda(stats.ejecutadoTotal)} de ${formatearMoneda(stats.presupuestoTotal)}).</p>
        </div>
    `;
    
    return html;
}

// Función para obtener color de borde según avance
function obtenerColorBordeSecretaria(avance) {
    if (avance >= 80) return '#10b981';  // Verde
    if (avance >= 60) return '#84cc16';  // Amarillo-verde
    if (avance >= 40) return '#f59e0b';  // Naranja
    return '#ef4444';  // Rojo
}

// Función para obtener gradiente de progreso según avance
function obtenerGradienteProgreso(avance) {
    if (avance >= 80) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
    if (avance >= 60) return 'linear-gradient(90deg, #84cc16 0%, #65a30d 100%)';
    if (avance >= 40) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
    return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
}

// Función para renderizar todos los gráficos
function renderizarGraficos(semaforoData, agrupados, stats) {
    // Gráfico de estado (dona)
    const ctxEstado = document.getElementById('chartEstado');
    if (ctxEstado) {
        new Chart(ctxEstado, {
            type: 'doughnut',
            data: {
                labels: ['Excelente (≥80%)', 'Bueno (60-79%)', 'Regular (40-59%)', 'Crítico (<40%)'],
                datasets: [{
                    data: [semaforoData.excelente, semaforoData.bueno, semaforoData.regular, semaforoData.critico],
                    backgroundColor: ['#10b981', '#84cc16', '#f59e0b', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    datalabels: {
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: (value, ctx) => {
                            if (value === 0) return '';
                            const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${value}\n(${percentage}%)`;
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
    
    // Gráfico de secretarías (barras horizontales)
    const secretariasNombres = Object.keys(agrupados);
    const secretariasCantidades = secretariasNombres.map(s => agrupados[s].length);
    
    const ctxSecretarias = document.getElementById('chartSecretarias');
    if (ctxSecretarias) {
        new Chart(ctxSecretarias, {
            type: 'bar',
            data: {
                labels: secretariasNombres.map(s => s.replace('Secretaria de ', '').replace('Sec de ', '').replace('Sec ', '')),
                datasets: [{
                    label: 'Programas',
                    data: secretariasCantidades,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        color: '#1e3a8a',
                        font: {
                            weight: 'bold',
                            size: 12
                        },
                        formatter: (value) => value
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { stepSize: 5 }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
    
    // Gráfico de presupuesto (barras)
    const secretariasPresupuesto = secretariasNombres.map(s => {
        const statsS = calcularEstadisticasSecretaria(s);
        return statsS.presupuestoTotal / 1000000; // Millones
    });
    
    const secretariasEjecutado = secretariasNombres.map(s => {
        const statsS = calcularEstadisticasSecretaria(s);
        return statsS.ejecutadoTotal / 1000000; // Millones
    });
    
    const ctxPresupuesto = document.getElementById('chartPresupuesto');
    if (ctxPresupuesto) {
        new Chart(ctxPresupuesto, {
            type: 'bar',
            data: {
                labels: secretariasNombres.map(s => s.replace('Secretaria de ', '').replace('Sec de ', '').replace('Sec ', '')),
                datasets: [
                    {
                        label: 'Programado',
                        data: secretariasPresupuesto,
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Ejecutado',
                        data: secretariasEjecutado,
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { padding: 10 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toFixed(0) + 'M';
                            }
                        }
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: function(context) {
                            return context.datasetIndex === 0 ? '#1e40af' : '#059669';
                        },
                        font: {
                            weight: 'bold',
                            size: 10
                        },
                        formatter: (value) => {
                            if (value === 0) return '';
                            return '$' + value.toFixed(0) + 'M';
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
    
    // Gráfico de avances (radar)
    const secretariasAvances = secretariasNombres.map(s => {
        const statsS = calcularEstadisticasSecretaria(s);
        return parseFloat(statsS.avancePromedio);
    });
    
    const ctxAvances = document.getElementById('chartAvances');
    if (ctxAvances) {
        new Chart(ctxAvances, {
            type: 'radar',
            data: {
                labels: secretariasNombres.map(s => s.replace('Secretaria de ', '').replace('Sec de ', '').replace('Sec ', '')),
                datasets: [{
                    label: 'Avance (%)',
                    data: secretariasAvances,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        backgroundColor: function(context) {
                            return 'rgba(59, 130, 246, 0.8)';
                        },
                        borderRadius: 4,
                        color: 'white',
                        font: {
                            weight: 'bold',
                            size: 10
                        },
                        padding: 4,
                        formatter: (value) => value.toFixed(1) + '%'
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }
}

function mostrarSecretaria(nombreSecretaria) {
    const programas = DATOS_PROGRAMAS.filter(p => p.SECRETARIA === nombreSecretaria);
    const stats = calcularEstadisticasSecretaria(nombreSecretaria);
    
    // Obtener icono según la secretaría
    let icono = '🏢';
    if (nombreSecretaria.includes('Gobierno')) icono = '🏛️';
    else if (nombreSecretaria.includes('Bienestar') || nombreSecretaria.includes('Social')) icono = '👥';
    else if (nombreSecretaria.includes('Turismo')) icono = '🏖️';
    else if (nombreSecretaria.includes('Planeacion') || nombreSecretaria.includes('Obras')) icono = '🏗️';
    else if (nombreSecretaria.includes('Medio Ambiente') || nombreSecretaria.includes('Rural')) icono = '🌿';
    
    let html = `
        <div class="fade-in">
            <!-- Header de la Secretaría -->
            <div class="secretaria-detalle-header">
                <span class="secretaria-detalle-icono">${icono}</span>
                <h2>${nombreSecretaria}</h2>
            </div>
            
            <!-- KPIs de la Secretaría -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">📋</div>
                    <div class="kpi-value">${stats.totalProgramas}</div>
                    <div class="kpi-label">Total Programas</div>
                </div>
                <div class="kpi-card kpi-card-wide">
                    <div class="kpi-icon">📈</div>
                    <div class="kpi-value">${stats.avancePromedio}%</div>
                    <div class="kpi-label">Avance Promedio</div>
                    <div class="kpi-progress-mini">
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: ${stats.avancePromedio}%; background-color: ${stats.avancePromedio >= 70 ? '#10b981' : stats.avancePromedio >= 40 ? '#f59e0b' : '#ef4444'};">
                            </div>
                        </div>
                        <div class="kpi-progress-labels">
                            <span class="label-avance">✓ ${stats.avancePromedio}%</span>
                            <span class="label-faltante">⏳ ${(100 - parseFloat(stats.avancePromedio)).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">✅</div>
                    <div class="kpi-value">${stats.programasCompletados}</div>
                    <div class="kpi-label">Completados</div>
                    <div class="stat-description">≥100%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">⚠️</div>
                    <div class="kpi-value">${stats.programasEnRiesgo}</div>
                    <div class="kpi-label">En Riesgo</div>
                    <div class="stat-description">&lt;40%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">💰</div>
                    <div class="kpi-value" style="font-size: 22px;">${formatearMonedaAbreviada(stats.presupuestoTotal)}</div>
                    <div class="kpi-label">Presupuesto</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">💵</div>
                    <div class="kpi-value" style="font-size: 22px;">${formatearMonedaAbreviada(stats.ejecutadoTotal)}</div>
                    <div class="kpi-label">Ejecutado</div>
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
    
    const etiquetaEstado =
        avance >= 80 ? 'Excelente' :
        avance >= 60 ? 'Bueno' :
        avance >= 40 ? 'Regular' :
        'Crítico';

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
                        ${avance.toFixed(0)}% Avance - ${etiquetaEstado}
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
