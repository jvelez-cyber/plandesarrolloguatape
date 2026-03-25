// ==================== FIREBASE CONFIG ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, writeBatch } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzP_NnuPmewAeOJ7IkJxkiSrHgpObz4cQ",
    authDomain: "plan-de-desarrollo-49495.firebaseapp.com",
    projectId: "plan-de-desarrollo-49495",
    storageBucket: "plan-de-desarrollo-49495.firebasestorage.app",
    messagingSenderId: "374569479398",
    appId: "1:374569479398:web:f718e47ee0ae0d8a439f27"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==================== VARIABLES GLOBALES ====================
let vistaActual = 'resumen';
let secretariaActual = null;
let programasDB = [];
let consolidadoDB = [];
let cargando = false;

// ==================== FIREBASE: CARGAR DATOS ====================
async function cargarDatosFirebase() {
    try {
        mostrarCargando(true);

        // Cargar programas
        const programasSnap = await getDocs(collection(db, 'programas'));
        programasDB = [];
        programasSnap.forEach(docSnap => {
            programasDB.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Cargar consolidado
        const consolidadoSnap = await getDocs(collection(db, 'consolidado'));
        consolidadoDB = [];
        consolidadoSnap.forEach(docSnap => {
            consolidadoDB.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Si Firebase está vacío, subir datos del archivo local
        if (programasDB.length === 0) {
            console.log('Firebase vacío. Subiendo datos iniciales...');
            await subirDatosIniciales();
            await cargarDatosFirebase();
            return;
        }

        mostrarCargando(false);
        mostrarResumen();
    } catch (error) {
        console.error('Error cargando Firebase:', error);
        mostrarCargando(false);
        // Fallback a datos locales
        programasDB = [...DATOS_PROGRAMAS];
        consolidadoDB = [...CONSOLIDADO_LINEAS];
        mostrarResumen();
    }
}

async function subirDatosIniciales() {
    const batch = writeBatch(db);

    // Subir programas
    DATOS_PROGRAMAS.forEach((prog, i) => {
        const ref = doc(db, 'programas', `prog_${String(i).padStart(3,'0')}`);
        batch.set(ref, prog);
    });

    // Subir consolidado
    CONSOLIDADO_LINEAS.forEach((linea, i) => {
        const ref = doc(db, 'consolidado', `linea_${i}`);
        batch.set(ref, linea);
    });

    await batch.commit();
    console.log('Datos subidos a Firebase exitosamente');
}

async function sincronizarConExcel() {
    if (!confirm('¿Está seguro de que desea reemplazar TODOS los datos en Firebase con los datos del archivo Excel?\n\nEsta acción no se puede deshacer.')) return;

    mostrarCargando(true);
    try {
        // Borrar programas existentes
        const programasSnap = await getDocs(collection(db, 'programas'));
        const batch1 = writeBatch(db);
        programasSnap.forEach(d => batch1.delete(d.ref));
        await batch1.commit();

        // Borrar consolidado existente
        const consolidadoSnap = await getDocs(collection(db, 'consolidado'));
        const batch2 = writeBatch(db);
        consolidadoSnap.forEach(d => batch2.delete(d.ref));
        await batch2.commit();

        // Subir nuevos datos
        await subirDatosIniciales();

        alert('✅ Datos sincronizados exitosamente con Firebase.');
        await cargarDatosFirebase();
    } catch (error) {
        console.error('Error sincronizando:', error);
        alert('❌ Error al sincronizar: ' + error.message);
        mostrarCargando(false);
    }
}

function mostrarCargando(show) {
    cargando = show;
    const area = document.getElementById('contentArea');
    if (show) {
        area.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:400px;flex-direction:column;gap:20px;">
                <div class="spinner"></div>
                <p style="color:#1e3a8a;font-size:18px;font-weight:600;">Cargando datos desde Firebase...</p>
            </div>
        `;
    }
}

// ==================== NAVEGACIÓN ====================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('mobile-open');
}

function cambiarVista(vista) {
    vistaActual = vista;
    secretariaActual = null;
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    const el = document.querySelector(`[data-vista="${vista}"]`);
    if (el) el.classList.add('active');
    if (vista === 'resumen') mostrarResumen();
}

function verSecretaria(nombreSecretaria) {
    vistaActual = 'secretaria';
    secretariaActual = nombreSecretaria;
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    const el = document.querySelector(`[data-secretaria="${nombreSecretaria}"]`);
    if (el) el.classList.add('active');
    mostrarSecretaria(nombreSecretaria);
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
}

// ==================== UTILIDADES ====================
function formatearMoneda(valor) {
    if (!valor || valor === 0) return '$0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(valor);
}

function formatearMonedaAbreviada(valor) {
    if (!valor || valor === 0) return '$0';
    if (valor >= 1e12) return `$${(valor / 1e12).toFixed(2).replace('.', ',')} B`;
    if (valor >= 1e9) return `$${(valor / 1e9).toFixed(2).replace('.', ',')} MM`;
    if (valor >= 1e6) return `$${(valor / 1e6).toFixed(1).replace('.', ',')} M`;
    if (valor >= 1e3) return `$${(valor / 1e3).toFixed(0)} K`;
    return `$${Math.round(valor)}`;
}

function formatearNumero(valor) {
    if (!valor) return '0';
    if (typeof valor === 'number' && valor < 10) return valor.toFixed(2);
    return new Intl.NumberFormat('es-CO').format(valor);
}

function formatearPorcentaje(val) {
    if (val === null || val === undefined) return '0.0';
    const n = parseFloat(val);
    if (isNaN(n)) return '0.0';
    // If value is between 0 and 1, multiply by 100
    return n <= 1 ? (n * 100).toFixed(1) : n.toFixed(1);
}

function obtenerColorAvance(pct) {
    // pct between 0 and 1
    if (pct >= 0.8) return 'success';
    if (pct >= 0.6) return 'good';
    if (pct >= 0.4) return 'warning';
    return 'danger';
}

function obtenerColorBorde(pct) {
    if (pct >= 0.8) return '#10b981';
    if (pct >= 0.6) return '#84cc16';
    if (pct >= 0.4) return '#f59e0b';
    return '#ef4444';
}

function obtenerIconoSecretaria(nombre) {
    if (!nombre) return '🏢';
    if (nombre.includes('Gobierno')) return '🏛️';
    if (nombre.includes('Bienestar') || nombre.includes('Social')) return '👥';
    if (nombre.includes('Turismo')) return '🏖️';
    if (nombre.includes('Planeacion') || nombre.includes('Obras')) return '🏗️';
    if (nombre.includes('Medio Ambiente') || nombre.includes('Rural')) return '🌿';
    return '🏢';
}

// ==================== CÁLCULOS ====================
function getProgramasPorSecretaria(nombreSecretaria) {
    return programasDB.filter(p => p.secretaria === nombreSecretaria);
}

function getSecretariasUnicas() {
    const set = new Set();
    programasDB.forEach(p => { if (p.secretaria) set.add(p.secretaria); });
    // Return in defined order
    const order = ['Secretaria de Gobierno','Sec de Bienestar y Dllo Social','Secretaria de Turismo','Sec Planeacion y Obras Pub','Sec Medio Ambiente y Dllo Rural'];
    return order.filter(s => set.has(s));
}

function calcularStatsGenerales() {
    const total = programasDB.length;
    let sumaAvance = 0;
    programasDB.forEach(p => { sumaAvance += parseFloat(p.pct_avance_fecha) || 0; });
    const avancePromedio = total > 0 ? (sumaAvance / total) * 100 : 0;

    // Semaforo
    let excelente = 0, bueno = 0, regular = 0, critico = 0;
    programasDB.forEach(p => {
        const pct = parseFloat(p.pct_avance_fecha) || 0;
        if (pct >= 0.8) excelente++;
        else if (pct >= 0.6) bueno++;
        else if (pct >= 0.4) regular++;
        else critico++;
    });

    return { total, avancePromedio, excelente, bueno, regular, critico };
}

function calcularStatsSecretaria(nombre) {
    const programas = getProgramasPorSecretaria(nombre);
    const total = programas.length;
    if (total === 0) return { total: 0, avancePromedio: 0, completados: 0, enRiesgo: 0 };

    let sumaAvance = 0, completados = 0, enRiesgo = 0;
    programas.forEach(p => {
        const pct = parseFloat(p.pct_avance_fecha) || 0;
        sumaAvance += pct;
        if (pct >= 1) completados++;
        if (pct < 0.4) enRiesgo++;
    });

    return {
        total,
        avancePromedio: (sumaAvance / total) * 100,
        completados,
        enRiesgo
    };
}

// ==================== RESUMEN EJECUTIVO ====================
function mostrarResumen() {
    const stats = calcularStatsGenerales();
    const secretarias = getSecretariasUnicas();
    const avancePct = stats.avancePromedio.toFixed(1);

    // Usar datos del consolidado si están disponibles
    const consolidadoMap = {};
    consolidadoDB.forEach(c => { consolidadoMap[c.linea] = c; });

    let html = `
        <div class="fade-in">
            <div class="dashboard-header">
                <h2>📊 Resumen Ejecutivo</h2>
                <div class="dashboard-subtitle">Plan de Desarrollo Municipal "Juntos Construimos 2024-2027"</div>
                <button class="btn-sync" onclick="sincronizarConExcel()" title="Reemplazar datos en Firebase con datos del archivo Excel">
                    🔄 Sincronizar con Excel
                </button>
            </div>

            <!-- KPIs -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">📋</div>
                    <div class="kpi-value">${stats.total}</div>
                    <div class="kpi-label">Total Programas</div>
                </div>
                <div class="kpi-card kpi-card-wide">
                    <div class="kpi-icon">📈</div>
                    <div class="kpi-value">${avancePct}%</div>
                    <div class="kpi-label">Avance General al Plan</div>
                    <div class="kpi-progress-mini">
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: ${avancePct}%; background-color: ${stats.avancePromedio >= 70 ? '#10b981' : stats.avancePromedio >= 40 ? '#f59e0b' : '#ef4444'};"></div>
                        </div>
                        <div class="kpi-progress-labels">
                            <span class="label-avance">✓ ${avancePct}%</span>
                            <span class="label-faltante">⏳ ${(100 - parseFloat(avancePct)).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">✅</div>
                    <div class="kpi-value">${stats.excelente}</div>
                    <div class="kpi-label">En Excelente Estado</div>
                    <div class="stat-description">≥80%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">⚠️</div>
                    <div class="kpi-value">${stats.critico}</div>
                    <div class="kpi-label">En Estado Crítico</div>
                    <div class="stat-description">&lt;40%</div>
                </div>
            </div>

            <!-- Semáforo -->
            <div class="semaforo-container">
                <h3>🚦 Semáforo de Estado de Programas</h3>
                <div class="semaforo-grid">
                    <div class="semaforo-item excelente">
                        <div class="semaforo-icon">🟢</div>
                        <div class="semaforo-label">Excelente</div>
                        <div class="semaforo-count">${stats.excelente}</div>
                        <div class="semaforo-percentage">${((stats.excelente/stats.total)*100).toFixed(1)}% del total</div>
                        <div style="font-size:12px;color:#059669;margin-top:8px;">≥ 80% de avance</div>
                    </div>
                    <div class="semaforo-item bueno">
                        <div class="semaforo-icon">🟡</div>
                        <div class="semaforo-label">Bueno</div>
                        <div class="semaforo-count">${stats.bueno}</div>
                        <div class="semaforo-percentage">${((stats.bueno/stats.total)*100).toFixed(1)}% del total</div>
                        <div style="font-size:12px;color:#65a30d;margin-top:8px;">60% - 79% de avance</div>
                    </div>
                    <div class="semaforo-item regular">
                        <div class="semaforo-icon">🟠</div>
                        <div class="semaforo-label">Regular</div>
                        <div class="semaforo-count">${stats.regular}</div>
                        <div class="semaforo-percentage">${((stats.regular/stats.total)*100).toFixed(1)}% del total</div>
                        <div style="font-size:12px;color:#d97706;margin-top:8px;">40% - 59% de avance</div>
                    </div>
                    <div class="semaforo-item critico">
                        <div class="semaforo-icon">🔴</div>
                        <div class="semaforo-label">Crítico</div>
                        <div class="semaforo-count">${stats.critico}</div>
                        <div class="semaforo-percentage">${((stats.critico/stats.total)*100).toFixed(1)}% del total</div>
                        <div style="font-size:12px;color:#dc2626;margin-top:8px;">&lt; 40% de avance</div>
                    </div>
                </div>
            </div>

            <!-- Avance por Línea Estratégica -->
            <div class="lineas-container">
                <h3>🎯 Avance por Línea Estratégica</h3>
                <div class="lineas-grid">
    `;

    // Líneas estratégicas desde consolidado
    const lineasOrden = consolidadoDB.filter(c => c.linea !== 'TOTAL');
    const total_linea = consolidadoDB.find(c => c.linea === 'TOTAL');

    lineasOrden.forEach(linea => {
        const pct = parseFloat(linea.pct_avance) || 0;
        const pctDisplay = (pct * 100).toFixed(1);
        const color = obtenerColorBorde(pct);
        html += `
            <div class="linea-card" style="border-left: 5px solid ${color}">
                <div class="linea-nombre">${linea.linea}</div>
                <div class="linea-stats">
                    <span>${linea.num_programas} programas</span>
                    <span style="color:${color};font-weight:700;">${pctDisplay}%</span>
                </div>
                <div class="progress-bar" style="height:8px;margin-top:8px;">
                    <div class="progress-fill" style="width:${Math.min(pctDisplay,100)}%;background:${color};height:8px;border-radius:4px;"></div>
                </div>
            </div>
        `;
    });

    if (total_linea) {
        const pctTotal = (parseFloat(total_linea.pct_avance) || 0) * 100;
        html += `
            <div class="linea-card linea-total" style="border-left:5px solid #1e3a8a">
                <div class="linea-nombre"><strong>TOTAL PLAN DE DESARROLLO</strong></div>
                <div class="linea-stats">
                    <span>${total_linea.num_programas} programas</span>
                    <span style="color:#1e3a8a;font-weight:700;">${pctTotal.toFixed(1)}%</span>
                </div>
                <div class="progress-bar" style="height:10px;margin-top:8px;">
                    <div class="progress-fill" style="width:${Math.min(pctTotal,100)}%;background:#1e3a8a;height:10px;border-radius:5px;"></div>
                </div>
            </div>
        `;
    }

    html += `
                </div>
            </div>

            <!-- Gráficos -->
            <div class="charts-container">
                <div class="chart-card">
                    <h3>📊 Distribución por Estado</h3>
                    <div class="chart-wrapper"><canvas id="chartEstado"></canvas></div>
                </div>
                <div class="chart-card">
                    <h3>📈 Avance por Secretaría</h3>
                    <div class="chart-wrapper"><canvas id="chartAvances"></canvas></div>
                </div>
                <div class="chart-card">
                    <h3>🏢 Programas por Secretaría</h3>
                    <div class="chart-wrapper"><canvas id="chartSecretarias"></canvas></div>
                </div>
                <div class="chart-card">
                    <h3>🎯 Avance por Año - Visión General</h3>
                    <div class="chart-wrapper"><canvas id="chartAnios"></canvas></div>
                </div>
            </div>

            <!-- Tarjetas de Secretarías -->
            <h3 style="font-size:22px;font-weight:700;color:#1e3a8a;margin:32px 0 20px;">
                🏢 Secretarías (${secretarias.length})
            </h3>
    `;

    secretarias.forEach(sec => {
        const statsS = calcularStatsSecretaria(sec);
        const avance = statsS.avancePromedio;
        const color = obtenerColorBorde(avance / 100);
        html += `
            <div class="secretaria-card-mejorada" onclick="verSecretaria('${sec}')" style="border-top-color:${color}">
                <div class="secretaria-header-mejorada">
                    <span class="secretaria-icono">${obtenerIconoSecretaria(sec)}</span>
                    <h3 class="secretaria-titulo">${sec}</h3>
                </div>
                <div class="secretaria-stats-grid">
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">TOTAL PROGRAMAS</div>
                        <div class="stat-item-value">${statsS.total}</div>
                    </div>
                    <div class="stat-item-secretaria stat-item-with-bar">
                        <div class="stat-item-label">AVANCE AL PLAN</div>
                        <div class="stat-item-value" style="color:${color}">${avance.toFixed(1)}%</div>
                        <div class="mini-progress-bar-secretaria">
                            <div class="mini-progress-fill" style="width:${Math.min(avance,100)}%;background-color:${color};"></div>
                        </div>
                        <div class="mini-progress-labels-secretaria">
                            <span class="mini-label-avance">✓ ${avance.toFixed(1)}%</span>
                            <span class="mini-label-faltante">⏳ ${(100-avance).toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">COMPLETADOS</div>
                        <div class="stat-item-value">${statsS.completados}</div>
                        <div class="stat-item-sublabel">≥100%</div>
                    </div>
                    <div class="stat-item-secretaria">
                        <div class="stat-item-label">EN RIESGO</div>
                        <div class="stat-item-value">${statsS.enRiesgo}</div>
                        <div class="stat-item-sublabel">&lt;40%</div>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    document.getElementById('contentArea').innerHTML = html;

    setTimeout(() => renderizarGraficosResumen(stats, secretarias), 100);
}

// ==================== GRÁFICOS ====================
function renderizarGraficosResumen(stats, secretarias) {
    // Destruir charts existentes
    ['chartEstado','chartAvances','chartSecretarias','chartAnios'].forEach(id => {
        const existing = Chart.getChart(id);
        if (existing) existing.destroy();
    });

    // 1. Dona - Estado
    const ctxE = document.getElementById('chartEstado');
    if (ctxE) {
        new Chart(ctxE, {
            type: 'doughnut',
            data: {
                labels: ['Excelente (≥80%)', 'Bueno (60-79%)', 'Regular (40-59%)', 'Crítico (<40%)'],
                datasets: [{ data: [stats.excelente, stats.bueno, stats.regular, stats.critico], backgroundColor: ['#10b981','#84cc16','#f59e0b','#ef4444'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 15, font: { size: 11 } } }, datalabels: { color: '#fff', font: { weight: 'bold', size: 13 }, formatter: (v, ctx) => { if (v === 0) return ''; const t = ctx.chart.data.datasets[0].data.reduce((a,b) => a+b, 0); return `${v}\n(${((v/t)*100).toFixed(1)}%)`; } } } },
            plugins: [ChartDataLabels]
        });
    }

    // 2. Barras horizontales - Avance por secretaría
    const secAvances = secretarias.map(s => calcularStatsSecretaria(s).avancePromedio.toFixed(1));
    const secLabels = secretarias.map(s => s.replace('Secretaria de ','').replace('Sec de ','').replace('Sec ',''));
    const colores = secAvances.map(a => obtenerColorBorde(parseFloat(a)/100));

    const ctxA = document.getElementById('chartAvances');
    if (ctxA) {
        new Chart(ctxA, {
            type: 'bar',
            data: {
                labels: secLabels,
                datasets: [{ label: 'Avance %', data: secAvances, backgroundColor: colores.map(c => c+'99'), borderColor: colores, borderWidth: 2 }]
            },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#1e3a8a', font: { weight: 'bold', size: 12 }, formatter: v => v + '%' } }, scales: { x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } } },
            plugins: [ChartDataLabels]
        });
    }

    // 3. Barras - Cantidad de programas
    const ctxS = document.getElementById('chartSecretarias');
    if (ctxS) {
        new Chart(ctxS, {
            type: 'bar',
            data: {
                labels: secLabels,
                datasets: [{ label: 'Programas', data: secretarias.map(s => getProgramasPorSecretaria(s).length), backgroundColor: 'rgba(59,130,246,0.8)', borderColor: 'rgba(59,130,246,1)', borderWidth: 1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#1e3a8a', font: { weight: 'bold', size: 12 }, formatter: v => v } }, scales: { y: { beginAtZero: true } } },
            plugins: [ChartDataLabels]
        });
    }

    // 4. Barras agrupadas - Avance por año (promedio general)
    const años = ['2024', '2025', '2026', '2027'];
    const promediosPorAnio = años.map(anio => {
        const key = `anio_${anio}`;
        let suma = 0, count = 0;
        programasDB.forEach(p => {
            const val = p[key] ? (parseFloat(p[key].avance) || 0) : 0;
            const meta = p[key] ? (parseFloat(p[key].meta) || 1) : 1;
            if (meta > 0) { suma += (val / meta); count++; }
        });
        return count > 0 ? ((suma/count)*100).toFixed(1) : 0;
    });

    const ctxAnios = document.getElementById('chartAnios');
    if (ctxAnios) {
        new Chart(ctxAnios, {
            type: 'bar',
            data: {
                labels: años,
                datasets: [{ label: '% Cumplimiento Promedio', data: promediosPorAnio, backgroundColor: ['rgba(59,130,246,0.8)','rgba(16,185,129,0.8)','rgba(245,158,11,0.8)','rgba(239,68,68,0.4)'], borderColor: ['rgb(59,130,246)','rgb(16,185,129)','rgb(245,158,11)','rgb(239,68,68)'], borderWidth: 2 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#1e3a8a', font: { weight: 'bold', size: 12 }, formatter: v => v + '%' } }, scales: { y: { beginAtZero: true, max: 120, ticks: { callback: v => v + '%' } } } },
            plugins: [ChartDataLabels]
        });
    }
}

// ==================== VISTA SECRETARÍA ====================
function mostrarSecretaria(nombreSecretaria) {
    const programas = getProgramasPorSecretaria(nombreSecretaria);
    const stats = calcularStatsSecretaria(nombreSecretaria);
    const icono = obtenerIconoSecretaria(nombreSecretaria);
    const avance = stats.avancePromedio.toFixed(1);
    const color = obtenerColorBorde(stats.avancePromedio / 100);

    // Obtener línea estratégica
    const linea = programas.length > 0 ? programas[0].linea_estrategica : '';

    let html = `
        <div class="fade-in">
            <div class="secretaria-detalle-header">
                <span class="secretaria-detalle-icono">${icono}</span>
                <div>
                    <h2>${nombreSecretaria}</h2>
                    <div style="font-size:13px;color:#6b7280;margin-top:4px;">${linea}</div>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">📋</div>
                    <div class="kpi-value">${stats.total}</div>
                    <div class="kpi-label">Total Programas</div>
                </div>
                <div class="kpi-card kpi-card-wide">
                    <div class="kpi-icon">📈</div>
                    <div class="kpi-value">${avance}%</div>
                    <div class="kpi-label">Avance al Plan</div>
                    <div class="kpi-progress-mini">
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width:${Math.min(avance,100)}%;background-color:${color};"></div>
                        </div>
                        <div class="kpi-progress-labels">
                            <span class="label-avance">✓ ${avance}%</span>
                            <span class="label-faltante">⏳ ${(100-parseFloat(avance)).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">✅</div>
                    <div class="kpi-value">${stats.completados}</div>
                    <div class="kpi-label">Completados</div>
                    <div class="stat-description">≥100%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon">⚠️</div>
                    <div class="kpi-value">${stats.enRiesgo}</div>
                    <div class="kpi-label">En Riesgo</div>
                    <div class="stat-description">&lt;40%</div>
                </div>
            </div>

            <!-- Gráfico de avance por año para esta secretaría -->
            <div class="charts-container" style="grid-template-columns:1fr 1fr;">
                <div class="chart-card">
                    <h3>📊 Estado de Programas</h3>
                    <div class="chart-wrapper"><canvas id="chartSecEstado"></canvas></div>
                </div>
                <div class="chart-card">
                    <h3>📅 Avance por Año</h3>
                    <div class="chart-wrapper"><canvas id="chartSecAnios"></canvas></div>
                </div>
            </div>

            <h3 style="font-size:22px;font-weight:700;color:#1e3a8a;margin:32px 0 20px;">
                📋 Programas (${programas.length})
            </h3>
    `;

    programas.forEach((prog, i) => { html += renderizarPrograma(prog, i + 1); });
    html += '</div>';

    document.getElementById('contentArea').innerHTML = html;

    setTimeout(() => renderizarGraficosSecretaria(programas), 100);
}

function renderizarGraficosSecretaria(programas) {
    ['chartSecEstado','chartSecAnios'].forEach(id => {
        const ex = Chart.getChart(id);
        if (ex) ex.destroy();
    });

    // Estado
    let ex=0, bu=0, re=0, cr=0;
    programas.forEach(p => {
        const pct = parseFloat(p.pct_avance_fecha) || 0;
        if (pct >= 0.8) ex++;
        else if (pct >= 0.6) bu++;
        else if (pct >= 0.4) re++;
        else cr++;
    });

    const ctxE = document.getElementById('chartSecEstado');
    if (ctxE) {
        new Chart(ctxE, {
            type: 'doughnut',
            data: {
                labels: ['Excelente (≥80%)', 'Bueno (60-79%)', 'Regular (40-59%)', 'Crítico (<40%)'],
                datasets: [{ data: [ex, bu, re, cr], backgroundColor: ['#10b981','#84cc16','#f59e0b','#ef4444'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 10, font: { size: 10 } } }, datalabels: { color: '#fff', font: { weight: 'bold', size: 12 }, formatter: (v, ctx) => { if (v === 0) return ''; const t = ctx.chart.data.datasets[0].data.reduce((a,b) => a+b, 0); return `${v}\n(${((v/t)*100).toFixed(0)}%)`; } } } },
            plugins: [ChartDataLabels]
        });
    }

    // Avance por año (promedio de esta secretaría)
    const años = ['2024','2025','2026'];
    const promedios = años.map(anio => {
        const key = `anio_${anio}`;
        let suma = 0, count = 0;
        programas.forEach(p => {
            const meta = parseFloat(p[key]?.meta) || 0;
            const avance = parseFloat(p[key]?.avance) || 0;
            if (meta > 0) { suma += Math.min(avance/meta, 1); count++; }
        });
        return count > 0 ? ((suma/count)*100).toFixed(1) : 0;
    });

    const ctxA = document.getElementById('chartSecAnios');
    if (ctxA) {
        new Chart(ctxA, {
            type: 'bar',
            data: {
                labels: años,
                datasets: [{ label: '% Cumplimiento', data: promedios, backgroundColor: ['rgba(59,130,246,0.8)','rgba(16,185,129,0.8)','rgba(245,158,11,0.4)'], borderColor: ['rgb(59,130,246)','rgb(16,185,129)','rgb(245,158,11)'], borderWidth: 2 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#1e3a8a', font: { weight: 'bold', size: 12 }, formatter: v => v + '%' } }, scales: { y: { beginAtZero: true, max: 120, ticks: { callback: v => v + '%' } } } },
            plugins: [ChartDataLabels]
        });
    }
}

// ==================== RENDERIZAR PROGRAMA ====================
function renderizarPrograma(prog, numero) {
    const pct = parseFloat(prog.pct_avance_fecha) || 0;
    const pctDisplay = (pct * 100).toFixed(1);
    const colorEstado = obtenerColorAvance(pct);
    const colorBorde = obtenerColorBorde(pct);

    const etiqueta = pct >= 0.8 ? 'Excelente' : pct >= 0.6 ? 'Bueno' : pct >= 0.4 ? 'Regular' : 'Crítico';

    const a24 = prog.anio_2024 || {};
    const a25 = prog.anio_2025 || {};
    const a26 = prog.anio_2026 || {};
    const a27 = prog.anio_2027 || {};

    const fmt = (v) => {
        const n = parseFloat(v);
        if (isNaN(n) || n === 0) return '0';
        if (n < 1 && n > 0) return n.toFixed(2);
        return n % 1 === 0 ? n.toString() : n.toFixed(2);
    };

    const fmtPct = (v) => {
        const n = parseFloat(v);
        if (isNaN(n)) return '0%';
        return n <= 1 ? (n * 100).toFixed(1) + '%' : n.toFixed(1) + '%';
    };

    return `
        <div class="card-programa">
            <div class="programa-header">
                <div class="programa-titulo">
                    ${prog.componente ? `<div class="programa-componente"><strong>Componente:</strong> ${prog.componente}</div>` : ''}
                    <h3>${numero}. ${prog.programa || 'Sin nombre'}</h3>
                </div>
                <span class="badge badge-${colorEstado}">
                    ${pctDisplay}% Avance al Plan - ${etiqueta}
                </span>
            </div>

            <table class="info-table">
                <tr><td>Código de Producto</td><td>${prog.codigo || 'N/A'}</td></tr>
                <tr><td>Indicador de Producto</td><td>${prog.indicador || 'N/A'}</td></tr>
                <tr><td>Unidad de Medida</td><td>${prog.unidad || 'N/A'}</td></tr>
                <tr><td>Tendencia</td><td>${prog.tendencia || 'N/A'}</td></tr>
                <tr><td>Línea Base</td><td>${fmt(prog.linea_base)}</td></tr>
                <tr><td>Meta Cuatrienio</td><td><strong>${fmt(prog.meta_cuatrenio)}</strong></td></tr>
            </table>

            <!-- Tabla de avance por año -->
            <div class="anios-container">
                <h4 style="margin:16px 0 10px;color:#1e3a8a;font-size:15px;">📅 Avance por Año</h4>
                <div class="tabla-anios-wrapper">
                    <table class="tabla-anios">
                        <thead>
                            <tr>
                                <th>Año</th>
                                <th>Meta</th>
                                <th>Avance</th>
                                <th>% Cumpl. Anual</th>
                                <th>% Aporte al PD</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderFilaAnio('2024', a24)}
                            ${renderFilaAnio('2025', a25)}
                            ${renderFilaAnio('2026', a26)}
                            ${renderFilaAnio2027('2027', a27)}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Barra de Progreso acumulado -->
            <div class="progress-container">
                <div class="progress-label">
                    <span>Avance Acumulado al Plan de Desarrollo</span>
                    <span>${pctDisplay}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${Math.min(pctDisplay,100)}%;background:${colorBorde};">
                        ${parseFloat(pctDisplay) >= 15 ? pctDisplay + '%' : ''}
                    </div>
                </div>
                <div style="font-size:12px;color:#6b7280;margin-top:4px;">
                    Avance acumulado: <strong>${fmt(prog.avance_acumulado)}</strong> de <strong>${fmt(prog.meta_cuatrenio)}</strong> (meta cuatrienio)
                </div>
            </div>
        </div>
    `;
}

function renderFilaAnio(anio, datos) {
    if (!datos) return '';
    const meta = parseFloat(datos.meta) || 0;
    const avance = parseFloat(datos.avance) || 0;
    const pctCumpl = parseFloat(datos.pct_cumplimiento) || 0;
    const pctPD = parseFloat(datos.pct_avance_pd) || 0;

    const fmt = (v) => {
        if (!v || v === 0) return '0';
        if (v < 1 && v > 0) return v.toFixed(2);
        return v % 1 === 0 ? v.toString() : v.toFixed(2);
    };

    const colorAvance = pctCumpl >= 1 ? '#10b981' : pctCumpl >= 0.6 ? '#f59e0b' : pctCumpl > 0 ? '#ef4444' : '#9ca3af';
    const bgAvance = pctCumpl === 0 ? '' : `background:${colorAvance}15;`;

    return `
        <tr style="${bgAvance}">
            <td><strong>${anio}</strong></td>
            <td>${fmt(meta)}</td>
            <td style="color:${colorAvance};font-weight:600;">${fmt(avance)}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="color:${colorAvance};font-weight:700;">${(pctCumpl*100).toFixed(1)}%</span>
                    <div style="flex:1;background:#e5e7eb;border-radius:4px;height:6px;min-width:60px;">
                        <div style="width:${Math.min(pctCumpl*100,100)}%;height:6px;background:${colorAvance};border-radius:4px;"></div>
                    </div>
                </div>
            </td>
            <td style="color:#1e3a8a;">${(pctPD*100).toFixed(2)}%</td>
        </tr>
    `;
}

function renderFilaAnio2027(anio, datos) {
    if (!datos) return '';
    const meta = parseFloat(datos.meta) || 0;
    const avance = parseFloat(datos.avance) || 0;
    const fmt = (v) => { if (!v || v === 0) return '0'; if (v < 1 && v > 0) return v.toFixed(2); return v % 1 === 0 ? v.toString() : v.toFixed(2); };
    return `
        <tr style="opacity:0.7;">
            <td><strong>${anio}</strong></td>
            <td>${fmt(meta)}</td>
            <td>${fmt(avance)}</td>
            <td><span style="color:#9ca3af;font-size:12px;">Pendiente</span></td>
            <td><span style="color:#9ca3af;font-size:12px;">Pendiente</span></td>
        </tr>
    `;
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Plan de Desarrollo - Cargando desde Firebase...');
    cargarDatosFirebase();
});
