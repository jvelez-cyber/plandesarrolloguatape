import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Edit2, Save, X, Trash2, Plus } from 'lucide-react';

// Importar fuentes de Google
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Patrick+Hand&family=Caveat:wght@400;700&family=Poppins:wght@400;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const DashboardCompromisos = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [secretarios, setSecretarios] = useState([]);
  const [filtros, setFiltros] = useState({
    responsable: '',
    estado: '',
    año: '2024',
    busqueda: ''
  });
  const [compromisoEditando, setCompromisoEditando] = useState(null);
  const [modalEdicion, setModalEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simular datos
  useEffect(() => {
    const datosSimulados = {
      compromisos: [
        {
          id: 1, no: 55, fechaReunion: '2024-02-03',
          descripcion: 'Acto administrativo delegación de rendición de la cuenta a la Contraloría',
          responsable1: 'C-001', responsable2: 'C-002', responsable3: null,
          fechaAsignada: '2024-02-03', fechaCumplimiento: '2024-02-10',
          cumplimiento: 'Si', valoracion: 'Oportuno'
        },
        {
          id: 2, no: 3, fechaReunion: '2024-02-05',
          descripcion: 'Actualización lista de participantes Frente de Seguridad',
          responsable1: 'C-001', fechaAsignada: '2024-02-05',
          fechaCumplimiento: '2024-12-30', cumplimiento: 'Si', valoracion: 'Oportuno'
        },
        {
          id: 3, no: 42, fechaReunion: '2024-09-23',
          descripcion: 'Actualización PGIRS', responsable1: 'C-003',
          fechaAsignada: '2024-09-23', fechaCumplimiento: '2024-10-25',
          cumplimiento: 'Si', valoracion: 'Oportuno'
        },
        {
          id: 4, no: 77, fechaReunion: '2024-03-31',
          descripcion: 'Actualizar política pública de protección animal',
          responsable1: 'C-001', fechaAsignada: '2024-03-31',
          fechaCumplimiento: null, cumplimiento: 'En proceso', valoracion: null
        },
        {
          id: 5, no: 15, fechaReunion: '2024-05-12',
          descripcion: 'Revisión plan de desarrollo municipal',
          responsable1: 'C-003', responsable2: 'C-002',
          fechaAsignada: '2024-05-12', fechaCumplimiento: '2024-06-20',
          cumplimiento: 'Si', valoracion: 'Oportuno'
        },
        {
          id: 6, no: 28, fechaReunion: '2025-01-08',
          descripcion: 'Actualización normativa turística',
          responsable1: 'C-005', fechaAsignada: '2025-01-08',
          fechaCumplimiento: null, cumplimiento: 'En proceso', valoracion: null
        },
        {
          id: 7, no: 34, fechaReunion: '2025-02-15',
          descripcion: 'Programa de capacitación docentes',
          responsable1: 'C-006', fechaAsignada: '2025-02-15',
          fechaCumplimiento: null, cumplimiento: 'En proceso', valoracion: null
        },
        {
          id: 8, no: 45, fechaReunion: '2024-10-22',
          descripcion: 'Mantenimiento infraestructura deportiva',
          responsable1: 'C-004', responsable2: 'C-003',
          fechaAsignada: '2024-10-22', fechaCumplimiento: '2024-11-15',
          cumplimiento: 'Si', valoracion: 'Extemporáneo'
        }
      ],
      responsables: [
        { codigo: 'C-001', cargo: 'Alcalde Municipal' },
        { codigo: 'C-002', cargo: 'Secretario de Gobierno' },
        { codigo: 'C-003', cargo: 'Secretaria de Planeación' },
        { codigo: 'C-004', cargo: 'Secretaria de Hacienda' },
        { codigo: 'C-005', cargo: 'Secretaria de Turismo' },
        { codigo: 'C-006', cargo: 'Secretaria de Bienestar Social' }
      ],
      secretarios: [
        { nombre: 'David Esteban Franco Vallejo', codigo: 'C-001', cargo: 'Alcalde Municipal', 
          foto: 'https://ui-avatars.com/api/?name=David+Franco&background=FF006E&color=fff&size=200' },
        { nombre: 'Carlos Hernán Espinosa', codigo: 'C-002', cargo: 'Secretario de Gobierno',
          foto: 'https://ui-avatars.com/api/?name=Carlos+Espinosa&background=FB5607&color=fff&size=200' },
        { nombre: 'Velkis Neivany Galeano', codigo: 'C-003', cargo: 'Secretaria de Planeación',
          foto: 'https://ui-avatars.com/api/?name=Velkis+Galeano&background=FFBE0B&color=fff&size=200' },
        { nombre: 'Durley Arelis Ramírez', codigo: 'C-004', cargo: 'Secretaria de Hacienda',
          foto: 'https://ui-avatars.com/api/?name=Durley+Ramirez&background=8338EC&color=fff&size=200' },
        { nombre: 'Estefanía Jiménez', codigo: 'C-005', cargo: 'Secretaria de Turismo',
          foto: 'https://ui-avatars.com/api/?name=Estefania+Jimenez&background=3A86FF&color=fff&size=200' },
        { nombre: 'Yésica Paola Suárez', codigo: 'C-006', cargo: 'Secretaria de Bienestar Social',
          foto: 'https://ui-avatars.com/api/?name=Yesica+Suarez&background=06FFA5&color=fff&size=200' }
      ]
    };

    setCompromisos(datosSimulados.compromisos);
    setResponsables(datosSimulados.responsables);
    setSecretarios(datosSimulados.secretarios);
    setLoading(false);
  }, []);

  // Filtrar compromisos
  const compromisosFiltrados = compromisos.filter(c => {
    const añoCompromiso = new Date(c.fechaReunion).getFullYear().toString();
    const cumpleFiltroAño = !filtros.año || añoCompromiso === filtros.año;
    const cumpleFiltroResponsable = !filtros.responsable || 
      c.responsable1 === filtros.responsable || c.responsable2 === filtros.responsable || c.responsable3 === filtros.responsable;
    const cumpleFiltroEstado = !filtros.estado || c.cumplimiento === filtros.estado;
    const cumpleFiltroBusqueda = !filtros.busqueda || c.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
    return cumpleFiltroAño && cumpleFiltroResponsable && cumpleFiltroEstado && cumpleFiltroBusqueda;
  });

  // Estadísticas
  const estadisticas = {
    total: compromisosFiltrados.length,
    cumplidos: compromisosFiltrados.filter(c => c.cumplimiento === 'Si').length,
    enProceso: compromisosFiltrados.filter(c => c.cumplimiento === 'En proceso').length,
    noCumplidos: compromisosFiltrados.filter(c => c.cumplimiento === 'No').length
  };

  // Top Responsables
  const calcularTopResponsables = () => {
    const conteo = {};
    compromisosFiltrados.forEach(c => {
      [c.responsable1, c.responsable2, c.responsable3].filter(Boolean).forEach(resp => {
        if (!conteo[resp]) conteo[resp] = { codigo: resp, total: 0, cumplidos: 0, pendientes: 0 };
        conteo[resp].total++;
        if (c.cumplimiento === 'Si') conteo[resp].cumplidos++;
        else conteo[resp].pendientes++;
      });
    });
    return Object.values(conteo).sort((a, b) => b.total - a.total).slice(0, 10).map(item => {
      const secretario = secretarios.find(s => s.codigo === item.codigo);
      const responsable = responsables.find(r => r.codigo === item.codigo);
      return { ...item, nombre: secretario?.nombre || responsable?.cargo || item.codigo,
        foto: secretario?.foto, cargo: responsable?.cargo };
    });
  };

  const topResponsables = calcularTopResponsables();
  const añosDisponibles = [...new Set(compromisos.map(c => new Date(c.fechaReunion).getFullYear().toString()))].sort().reverse();

  // Datos gráficos
  const datosGraficoBarra = [
    { nombre: 'Cumplidos', valor: estadisticas.cumplidos, color: '#06FFA5' },
    { nombre: 'En Proceso', valor: estadisticas.enProceso, color: '#FFBE0B' },
    { nombre: 'No Cumplidos', valor: estadisticas.noCumplidos, color: '#FF006E' }
  ];

  // Funciones edición
  const abrirModalEdicion = (compromiso) => {
    setCompromisoEditando({...compromiso});
    setModalEdicion(true);
  };

  const cerrarModalEdicion = () => {
    setCompromisoEditando(null);
    setModalEdicion(false);
  };

  const handleCambioEdicion = (campo, valor) => {
    setCompromisoEditando({ ...compromisoEditando, [campo]: valor });
  };

  const guardarEdicion = () => {
    setCompromisos(compromisos.map(c => c.id === compromisoEditando.id ? compromisoEditando : c));
    cerrarModalEdicion();
  };

  const eliminarCompromiso = (id) => {
    if (window.confirm('¿Está seguro de eliminar este compromiso?')) {
      setCompromisos(compromisos.filter(c => c.id !== id));
    }
  };

  // Modal
  const ModalEdicion = () => {
    if (!modalEdicion || !compromisoEditando) return null;

    return (
      <div className="modal-overlay" onClick={cerrarModalEdicion}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>✏️ Editar Compromiso #{compromisoEditando.no}</h2>
            <button className="btn-close-modal" onClick={cerrarModalEdicion}>
              <X size={24} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>📋 No. Compromiso</label>
                <input type="number" value={compromisoEditando.no}
                  onChange={(e) => handleCambioEdicion('no', parseInt(e.target.value))} />
              </div>
              <div className="form-group">
                <label>📅 Fecha Reunión</label>
                <input type="date" value={compromisoEditando.fechaReunion}
                  onChange={(e) => handleCambioEdicion('fechaReunion', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label>📝 Descripción</label>
                <textarea rows="3" value={compromisoEditando.descripcion}
                  onChange={(e) => handleCambioEdicion('descripcion', e.target.value)} />
              </div>
              <div className="form-group">
                <label>👤 Responsable 1</label>
                <select value={compromisoEditando.responsable1 || ''}
                  onChange={(e) => handleCambioEdicion('responsable1', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {responsables.map(r => <option key={r.codigo} value={r.codigo}>{r.cargo}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>👤 Responsable 2</label>
                <select value={compromisoEditando.responsable2 || ''}
                  onChange={(e) => handleCambioEdicion('responsable2', e.target.value || null)}>
                  <option value="">Ninguno</option>
                  {responsables.map(r => <option key={r.codigo} value={r.codigo}>{r.cargo}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>👤 Responsable 3</label>
                <select value={compromisoEditando.responsable3 || ''}
                  onChange={(e) => handleCambioEdicion('responsable3', e.target.value || null)}>
                  <option value="">Ninguno</option>
                  {responsables.map(r => <option key={r.codigo} value={r.codigo}>{r.cargo}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>📆 Fecha Asignada</label>
                <input type="date" value={compromisoEditando.fechaAsignada}
                  onChange={(e) => handleCambioEdicion('fechaAsignada', e.target.value)} />
              </div>
              <div className="form-group">
                <label>✅ Fecha Cumplimiento</label>
                <input type="date" value={compromisoEditando.fechaCumplimiento || ''}
                  onChange={(e) => handleCambioEdicion('fechaCumplimiento', e.target.value || null)} />
              </div>
              <div className="form-group">
                <label>🎯 Estado</label>
                <select value={compromisoEditando.cumplimiento}
                  onChange={(e) => handleCambioEdicion('cumplimiento', e.target.value)}>
                  <option value="Si">Cumplido</option>
                  <option value="No">No Cumplido</option>
                  <option value="En proceso">En Proceso</option>
                  <option value="En término">En Término</option>
                </select>
              </div>
              <div className="form-group">
                <label>⭐ Valoración</label>
                <select value={compromisoEditando.valoracion || ''}
                  onChange={(e) => handleCambioEdicion('valoracion', e.target.value || null)}>
                  <option value="">Sin valoración</option>
                  <option value="Oportuno">Oportuno</option>
                  <option value="Extemporáneo">Extemporáneo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-cancelar" onClick={cerrarModalEdicion}>❌ Cancelar</button>
            <button className="btn-guardar" onClick={guardarEdicion}>
              <Save size={18} /> 💾 Guardar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div style={{textAlign:'center', padding:'60px', color:'white', fontSize:'24px'}}>⏳ Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      <style>{`
        :root {
          --color-1: #FF006E; --color-2: #FB5607; --color-3: #FFBE0B;
          --color-4: #8338EC; --color-5: #3A86FF; --color-6: #06FFA5;
          --color-7: #FF1B8D; --color-8: #00D9FF; --color-9: #FFD60A; --color-10: #7209B7;
          --success: #06FFA5; --warning: #FFBE0B; --danger: #FF006E;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #FF006E 0%, #FB5607 20%, #FFBE0B 40%, #3A86FF 60%, #8338EC 80%, #06FFA5 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          min-height: 100vh;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .floating-emoji {
          position: fixed; font-size: 3rem; animation: float 4s ease-in-out infinite;
          pointer-events: none; z-index: 1;
        }
        .emoji-1 { top: 10%; left: 5%; animation-delay: 0s; }
        .emoji-2 { top: 20%; right: 5%; animation-delay: 1s; }
        .emoji-3 { bottom: 15%; left: 10%; animation-delay: 2s; }
        .emoji-4 { bottom: 25%; right: 8%; animation-delay: 3s; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(15deg); }
        }
        .dashboard-container {
          max-width: 1900px; margin: 0 auto; padding: 2rem; position: relative; z-index: 10;
        }
        
        /* HEADER */
        .header-section {
          background: white; border-radius: 30px; padding: 2.5rem; margin-bottom: 2rem;
          box-shadow: 0 15px 50px rgba(0,0,0,.2), inset 0 0 0 4px white, inset 0 0 0 10px var(--color-1);
          transform: rotate(-1deg); position: relative; overflow: visible;
        }
        .header-section::before, .header-section::after {
          content: '📌'; position: absolute; font-size: 3.5rem;
          filter: drop-shadow(0 8px 15px rgba(0,0,0,.3));
          animation: pinWiggle 3s ease-in-out infinite;
        }
        .header-section::before { top: -18px; left: 25%; transform: rotate(-30deg); }
        .header-section::after { top: -18px; right: 25%; transform: rotate(30deg); animation-delay: 1.5s; }
        @keyframes pinWiggle {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(30deg); }
        }
        .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; }
        .header-title {
          font-family: 'Permanent Marker', cursive; font-size: 3.5rem;
          background: linear-gradient(45deg, var(--color-4), var(--color-1), var(--color-2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          transform: rotate(-2deg); filter: drop-shadow(3px 3px 0 rgba(0,0,0,.1));
        }
        .header-subtitle {
          font-family: 'Patrick Hand', cursive; font-size: 1.6rem;
          color: var(--color-5); margin-top: 0.5rem;
        }

        /* SEGMENTADOR AÑO */
        .year-section {
          background: white; border-radius: 30px; padding: 2rem; margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,.2); border: 6px solid white;
          outline: 4px dashed var(--color-5); outline-offset: -18px;
        }
        .year-title {
          font-family: 'Permanent Marker', cursive; font-size: 2.2rem;
          color: var(--color-4); margin-bottom: 1.5rem; display: flex;
          align-items: center; gap: 1rem;
        }
        .year-buttons {
          display: flex; gap: 1.5rem; flex-wrap: wrap;
        }
        .year-btn {
          background: white; border: 5px solid; border-radius: 25px;
          padding: 1.2rem 2.5rem; font-family: 'Patrick Hand', cursive;
          font-size: 1.4rem; font-weight: 700; cursor: pointer;
          transition: all 0.3s ease; box-shadow: 6px 6px 0px;
        }
        .year-btn:nth-child(1) { border-color: var(--color-1); box-shadow: 6px 6px 0px var(--color-1); transform: rotate(-2deg); }
        .year-btn:nth-child(2) { border-color: var(--color-2); box-shadow: 6px 6px 0px var(--color-2); transform: rotate(2deg); }
        .year-btn:nth-child(3) { border-color: var(--color-3); box-shadow: 6px 6px 0px var(--color-3); transform: rotate(-1.5deg); }
        .year-btn:nth-child(4) { border-color: var(--color-6); box-shadow: 6px 6px 0px var(--color-6); transform: rotate(1.5deg); }
        .year-btn:hover {
          transform: rotate(0deg) translateY(-8px) scale(1.05); box-shadow: 10px 10px 0px;
        }
        .year-btn.active {
          transform: rotate(0deg) scale(1.1); background: var(--color-4); color: white;
          border-color: var(--color-4); box-shadow: 8px 8px 0px rgba(131, 56, 236, 0.5);
        }

        /* STATUS CARDS */
        .status-section {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem; margin-bottom: 2rem;
        }
        .status-card {
          background: white; padding: 2rem 2rem 3.5rem; border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,.25); cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        .status-card::before {
          content: ''; position: absolute; top: -10px; left: 50%;
          transform: translateX(-50%); width: 70px; height: 30px;
          background: rgba(0,0,0,.12); border-radius: 4px;
          box-shadow: 0 3px 8px rgba(0,0,0,.3);
        }
        .status-card:nth-child(1) { transform: rotate(-4deg); }
        .status-card:nth-child(2) { transform: rotate(3deg); }
        .status-card:nth-child(3) { transform: rotate(-3deg); }
        .status-card:nth-child(4) { transform: rotate(4deg); }
        .status-card:hover {
          transform: rotate(0deg) translateY(-20px) scale(1.08);
          z-index: 10; box-shadow: 0 30px 70px rgba(0,0,0,.35);
        }
        .status-icon { font-size: 6rem; margin-bottom: 1.2rem; display: block; text-align: center; }
        .status-label {
          font-family: 'Patrick Hand', cursive; font-size: 1.7rem;
          font-weight: 700; margin-bottom: 0.8rem; display: block;
          text-align: center; text-transform: uppercase;
        }
        .status-count {
          font-family: 'Permanent Marker', cursive; font-size: 5rem;
          display: block; line-height: 1; text-align: center;
        }
        .status-card.all .status-count { color: var(--color-4); }
        .status-card.success .status-count { color: var(--success); }
        .status-card.warning .status-count { color: var(--warning); }
        .status-card.danger .status-count { color: var(--danger); }

        /* TOP RESPONSABLES - ICONOS GRANDES */
        .tree-section {
          background: white; border-radius: 35px; padding: 3.5rem; margin-bottom: 2rem;
          box-shadow: 0 25px 70px rgba(0,0,0,.25); position: relative;
        }
        .tree-title {
          font-family: 'Permanent Marker', cursive; font-size: 2.8rem;
          color: var(--color-4); margin-bottom: 2.5rem; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 1rem;
        }
        .tree-branches {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2.5rem; width: 100%;
        }
        .branch-item {
          background: white; border: 6px solid; border-radius: 25px;
          padding: 2rem; box-shadow: 7px 7px 0px; cursor: pointer;
          transition: all 0.35s ease; position: relative; min-height: 450px;
        }
        .branch-item:nth-child(10n+1) { border-color: var(--color-1); box-shadow: 7px 7px 0px var(--color-1); transform: rotate(-3deg); }
        .branch-item:nth-child(10n+2) { border-color: var(--color-2); box-shadow: 7px 7px 0px var(--color-2); transform: rotate(2deg); }
        .branch-item:nth-child(10n+3) { border-color: var(--color-3); box-shadow: 7px 7px 0px var(--color-3); transform: rotate(-2deg); }
        .branch-item:nth-child(10n+4) { border-color: var(--color-4); box-shadow: 7px 7px 0px var(--color-4); transform: rotate(3deg); }
        .branch-item:nth-child(10n+5) { border-color: var(--color-5); box-shadow: 7px 7px 0px var(--color-5); transform: rotate(-1deg); }
        .branch-item:nth-child(10n+6) { border-color: var(--color-6); box-shadow: 7px 7px 0px var(--color-6); transform: rotate(2.5deg); }
        .branch-item:nth-child(10n+7) { border-color: var(--color-7); box-shadow: 7px 7px 0px var(--color-7); transform: rotate(-2.5deg); }
        .branch-item:nth-child(10n+8) { border-color: var(--color-8); box-shadow: 7px 7px 0px var(--color-8); transform: rotate(1.5deg); }
        .branch-item:nth-child(10n+9) { border-color: var(--color-9); box-shadow: 7px 7px 0px var(--color-9); transform: rotate(-3.5deg); }
        .branch-item:nth-child(10n+10) { border-color: var(--color-10); box-shadow: 7px 7px 0px var(--color-10); transform: rotate(2deg); }
        .branch-item:hover {
          transform: rotate(0deg) translateY(-12px) scale(1.06);
          box-shadow: 11px 11px 0px; z-index: 10;
        }
        .branch-item::before {
          content: '📎'; position: absolute; top: -14px; right: 22px;
          font-size: 2.5rem; transform: rotate(48deg);
          filter: drop-shadow(0 4px 8px rgba(0,0,0,.3));
        }
        .responsable-rank {
          position: absolute; top: -18px; left: 20px; width: 60px; height: 60px;
          background: linear-gradient(135deg, var(--color-10), var(--color-4));
          color: white; border-radius: 50%; display: flex;
          align-items: center; justify-content: center;
          font-family: 'Permanent Marker', cursive; font-size: 2rem;
          box-shadow: 0 8px 20px rgba(0,0,0,.35);
        }
        .responsable-photo {
          width: 150px; height: 150px; border-radius: 50%;
          object-fit: cover; border: 6px solid white;
          box-shadow: 0 12px 30px rgba(0,0,0,.35);
          margin: 1rem auto 1.2rem; display: block;
          transition: all 0.35s ease;
        }
        .branch-item:hover .responsable-photo {
          transform: scale(1.15) rotate(8deg);
          box-shadow: 0 18px 40px rgba(0,0,0,.45);
        }
        .responsable-name {
          font-family: 'Patrick Hand', cursive; font-size: 1.4rem;
          font-weight: 700; color: var(--color-10); text-align: center;
          margin-bottom: 0.6rem; line-height: 1.3;
        }
        .responsable-cargo {
          font-family: 'Caveat', cursive; font-size: 1.2rem;
          color: #666; text-align: center; margin-bottom: 1.5rem;
        }
        .responsable-stats {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem;
        }
        .mini-stat {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1rem; border-radius: 12px; text-align: center;
          border: 3px solid; font-family: 'Patrick Hand', cursive;
          font-weight: 700; transition: all 0.3s ease;
        }
        .mini-stat:hover { transform: scale(1.08); background: white; }
        .mini-stat.total {
          border-color: var(--color-4); color: var(--color-4);
          grid-column: 1 / -1; font-size: 1.2rem;
        }
        .mini-stat.cumplido { border-color: var(--success); color: var(--success); }
        .mini-stat.proceso { border-color: var(--warning); color: var(--warning); }
        .mini-stat-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
        .mini-stat-value {
          font-size: 2.2rem; display: block; line-height: 1;
        }
        .mini-stat-label {
          font-size: 0.9rem; display: block; margin-top: 0.3rem;
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* GRÁFICOS */
        .charts-section {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
          gap: 2.5rem; margin-bottom: 2rem;
        }
        .chart-card {
          background: white; border-radius: 0; padding: 2.5rem;
          box-shadow: 0 15px 40px rgba(0,0,0,.2);
          position: relative; border-left: 50px solid var(--color-5);
        }
        .chart-title {
          font-family: 'Patrick Hand', cursive; font-size: 2rem;
          color: var(--color-4); margin-bottom: 1.8rem;
          display: flex; align-items: center; gap: 1rem;
          border-bottom: 4px dashed var(--color-2); padding-bottom: 1.2rem;
        }

        /* TABLA */
        .table-section {
          background: white; border-radius: 30px; padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,.25);
        }
        .table-header {
          background: white; padding: 1.8rem; border-radius: 18px;
          margin-bottom: 2.5rem; display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1.5rem;
          box-shadow: 0 8px 25px rgba(0,0,0,.12);
        }
        .table-title {
          font-family: 'Permanent Marker', cursive; font-size: 2.3rem;
          color: var(--color-4); display: flex; align-items: center; gap: 1rem;
        }
        .search-wrapper { position: relative; flex: 1; max-width: 450px; }
        .search-wrapper input {
          width: 100%; padding: 1.2rem 1.2rem 1.2rem 4rem;
          border: 5px solid var(--color-2); border-radius: 28px;
          font-family: 'Patrick Hand', cursive; font-size: 1.3rem;
          box-shadow: inset 0 3px 8px rgba(0,0,0,.12);
        }
        .search-wrapper input:focus {
          outline: none; border-color: var(--color-4);
          box-shadow: 0 0 0 5px rgba(131, 56, 236, 0.2);
        }
        .search-icon {
          position: absolute; left: 1.4rem; top: 50%;
          transform: translateY(-50%); color: var(--color-4);
        }
        .table-container { overflow-x: auto; background: white; border-radius: 20px; padding: 1rem; }
        .table-compromisos {
          width: 100%; border-collapse: separate; border-spacing: 0 0.8rem;
        }
        .table-compromisos thead th {
          background: var(--color-4); color: white; padding: 1.2rem;
          font-family: 'Patrick Hand', cursive; font-size: 1.2rem;
          font-weight: 700; text-align: left;
        }
        .table-compromisos thead th:first-child { border-radius: 12px 0 0 12px; }
        .table-compromisos thead th:last-child { border-radius: 0 12px 12px 0; }
        .table-compromisos tbody tr {
          background: white; transition: all 0.3s ease;
          box-shadow: 0 3px 10px rgba(0,0,0,.1);
        }
        .table-compromisos tbody tr:hover {
          transform: scale(1.02); box-shadow: 0 8px 20px rgba(0,0,0,.15);
        }
        .table-compromisos tbody td {
          padding: 1.2rem; font-size: 0.95rem; vertical-align: middle;
        }
        .table-compromisos tbody td:first-child { border-radius: 12px 0 0 12px; }
        .table-compromisos tbody td:last-child { border-radius: 0 12px 12px 0; }
        .td-no {
          font-family: 'Permanent Marker', cursive; font-size: 1.3rem;
          color: var(--color-4);
        }
        .badge-estado {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1rem; border-radius: 20px;
          font-family: 'Patrick Hand', cursive; font-weight: 700;
          border: 3px solid;
        }
        .badge-estado.cumplido {
          background: #06FFA520; color: #06FFA5; border-color: #06FFA5;
        }
        .badge-estado.proceso {
          background: #FFBE0B20; color: #FFBE0B; border-color: #FFBE0B;
        }
        .badge-estado.nocumplido {
          background: #FF006E20; color: #FF006E; border-color: #FF006E;
        }
        .btn-accion {
          padding: 0.6rem; border: none; border-radius: 10px;
          cursor: pointer; margin: 0 0.3rem; transition: all 0.2s;
        }
        .btn-editar { background: #3A86FF20; color: #3A86FF; }
        .btn-editar:hover { background: #3A86FF; color: white; transform: scale(1.1); }
        .btn-eliminar { background: #FF006E20; color: #FF006E; }
        .btn-eliminar:hover { background: #FF006E; color: white; transform: scale(1.1); }

        /* MODAL */
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7); display: flex;
          align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .modal-content {
          background: white; border-radius: 30px; max-width: 900px;
          width: 100%; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 30px 80px rgba(0,0,0,.4);
          border: 8px solid var(--color-4);
        }
        .modal-header {
          padding: 2rem; border-bottom: 4px dashed var(--color-2);
          display: flex; justify-content: space-between; align-items: center;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
        }
        .modal-header h2 {
          font-family: 'Permanent Marker', cursive; font-size: 2rem;
          color: var(--color-4);
        }
        .btn-close-modal {
          background: var(--color-2); border: none; border-radius: 50%;
          width: 50px; height: 50px; cursor: pointer; color: white;
          font-size: 1.5rem; transition: all 0.3s;
        }
        .btn-close-modal:hover {
          background: var(--color-1); transform: rotate(90deg) scale(1.1);
        }
        .modal-body { padding: 2rem; }
        .form-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
        }
        .form-group { display: flex; flex-direction: column; gap: 0.8rem; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group label {
          font-family: 'Patrick Hand', cursive; font-size: 1.3rem;
          font-weight: 700; color: var(--color-4);
        }
        .form-group input, .form-group select, .form-group textarea {
          padding: 1rem; border: 4px solid #ddd; border-radius: 15px;
          font-family: 'Patrick Hand', cursive; font-size: 1.1rem;
          transition: all 0.3s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none; border-color: var(--color-4);
          box-shadow: 0 0 0 4px rgba(131, 56, 236, 0.2);
        }
        .modal-footer {
          padding: 2rem; border-top: 4px dashed var(--color-2);
          display: flex; justify-content: flex-end; gap: 1rem;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
        }
        .btn-cancelar {
          padding: 1rem 2rem; border: 4px dashed #999;
          background: white; color: #666; border-radius: 20px;
          font-family: 'Patrick Hand', cursive; font-weight: 700;
          font-size: 1.2rem; cursor: pointer; transition: all 0.3s;
          box-shadow: 5px 5px 0px #999;
        }
        .btn-cancelar:hover {
          transform: translate(3px, 3px); box-shadow: 2px 2px 0px #999;
        }
        .btn-guardar {
          padding: 1rem 2rem; border: 4px solid var(--color-4);
          background: var(--color-4); color: white; border-radius: 20px;
          font-family: 'Patrick Hand', cursive; font-weight: 700;
          font-size: 1.2rem; cursor: pointer; transition: all 0.3s;
          box-shadow: 5px 5px 0px rgba(131, 56, 236, 0.5);
          display: flex; align-items: center; gap: 0.5rem;
        }
        .btn-guardar:hover {
          transform: translate(3px, 3px); box-shadow: 2px 2px 0px rgba(131, 56, 236, 0.5);
        }

        @media (max-width: 768px) {
          .header-title { font-size: 2.5rem; }
          .tree-branches { grid-template-columns: 1fr; }
          .charts-section { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Emojis flotantes */}
      <div className="floating-emoji emoji-1">🌳</div>
      <div className="floating-emoji emoji-2">🎨</div>
      <div className="floating-emoji emoji-3">📊</div>
      <div className="floating-emoji emoji-4">✨</div>

      {/* Header */}
      <div className="header-section">
        <div className="header-content">
          <div>
            <h1 className="header-title">🌳 Tablero Compromisos</h1>
            <p className="header-subtitle">#JuntosConstruimos - Municipio de Guatapé</p>
          </div>
        </div>
      </div>

      {/* Segmentador de Año */}
      <div className="year-section">
        <h2 className="year-title">📅 Filtrar por Año</h2>
        <div className="year-buttons">
          {añosDisponibles.map(año => (
            <button
              key={año}
              className={`year-btn ${filtros.año === año ? 'active' : ''}`}
              onClick={() => setFiltros({ ...filtros, año })}
            >
              {año}
            </button>
          ))}
          <button
            className={`year-btn ${filtros.año === '' ? 'active' : ''}`}
            onClick={() => setFiltros({ ...filtros, año: '' })}
          >
            Todos
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="status-section">
        <div className="status-card all">
          <div className="status-icon">📋</div>
          <span className="status-label">Total</span>
          <span className="status-count">{estadisticas.total}</span>
        </div>
        <div className="status-card success">
          <div className="status-icon">✅</div>
          <span className="status-label">Cumplidos</span>
          <span className="status-count">{estadisticas.cumplidos}</span>
        </div>
        <div className="status-card warning">
          <div className="status-icon">⏳</div>
          <span className="status-label">En Proceso</span>
          <span className="status-count">{estadisticas.enProceso}</span>
        </div>
        <div className="status-card danger">
          <div className="status-icon">❌</div>
          <span className="status-label">No Cumplidos</span>
          <span className="status-count">{estadisticas.noCumplidos}</span>
        </div>
      </div>

      {/* Top 10 Responsables */}
      <div className="tree-section">
        <h2 className="tree-title">🏆 Top 10 Responsables</h2>
        <div className="tree-branches">
          {topResponsables.map((resp, index) => (
            <div key={resp.codigo} className="branch-item">
              <div className="responsable-rank">#{index + 1}</div>
              <img src={resp.foto} alt={resp.nombre} className="responsable-photo" />
              <div className="responsable-name">{resp.nombre}</div>
              <div className="responsable-cargo">{resp.cargo}</div>
              <div className="responsable-stats">
                <div className="mini-stat total">
                  <span className="mini-stat-icon">📋</span>
                  <span className="mini-stat-value">{resp.total}</span>
                  <span className="mini-stat-label">Total</span>
                </div>
                <div className="mini-stat cumplido">
                  <span className="mini-stat-icon">✅</span>
                  <span className="mini-stat-value">{resp.cumplidos}</span>
                  <span className="mini-stat-label">Cumplidos</span>
                </div>
                <div className="mini-stat proceso">
                  <span className="mini-stat-icon">⏳</span>
                  <span className="mini-stat-value">{resp.pendientes}</span>
                  <span className="mini-stat-label">Pendientes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">📊 Estado de Compromisos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={datosGraficoBarra} cx="50%" cy="50%" outerRadius={100}
                dataKey="valor" label>
                {datosGraficoBarra.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">📈 Cumplimiento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGraficoBarra}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" radius={[15, 15, 0, 0]}>
                {datosGraficoBarra.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-section">
        <div className="table-header">
          <h3 className="table-title">📋 Lista de Compromisos</h3>
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="🔍 Buscar compromiso..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            />
          </div>
        </div>
        <div className="table-container">
          <table className="table-compromisos">
            <thead>
              <tr>
                <th>No</th>
                <th>📅 Reunión</th>
                <th>📝 Descripción</th>
                <th>👥 Responsables</th>
                <th>📆 Asignada</th>
                <th>✅ Cumplimiento</th>
                <th>🎯 Estado</th>
                <th>⭐ Valoración</th>
                <th>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compromisosFiltrados.map(c => (
                <tr key={c.id}>
                  <td className="td-no">{c.no}</td>
                  <td>{new Date(c.fechaReunion).toLocaleDateString('es-ES')}</td>
                  <td>{c.descripcion}</td>
                  <td>
                    {[c.responsable1, c.responsable2, c.responsable3].filter(Boolean)
                      .map((resp, idx) => (
                        <div key={idx}>{responsables.find(r => r.codigo === resp)?.cargo || resp}</div>
                      ))}
                  </td>
                  <td>{new Date(c.fechaAsignada).toLocaleDateString('es-ES')}</td>
                  <td>{c.fechaCumplimiento ? new Date(c.fechaCumplimiento).toLocaleDateString('es-ES') : '-'}</td>
                  <td>
                    <span className={`badge-estado ${
                      c.cumplimiento === 'Si' ? 'cumplido' :
                      c.cumplimiento === 'En proceso' ? 'proceso' : 'nocumplido'
                    }`}>
                      {c.cumplimiento === 'Si' ? '✅' :
                       c.cumplimiento === 'En proceso' ? '⏳' : '❌'}
                      {c.cumplimiento}
                    </span>
                  </td>
                  <td>{c.valoracion || '-'}</td>
                  <td>
                    <button className="btn-accion btn-editar"
                      onClick={() => abrirModalEdicion(c)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-accion btn-eliminar"
                      onClick={() => eliminarCompromiso(c.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ModalEdicion />
    </div>
  );
};

export default DashboardCompromisos;
