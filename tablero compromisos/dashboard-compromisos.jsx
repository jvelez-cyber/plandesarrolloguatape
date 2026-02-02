import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Search, Filter, Download, Plus, Calendar, User, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

// Configuración de Firebase (reemplazar con tus credenciales)
const FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Estados de cumplimiento con colores
const ESTADOS_CUMPLIMIENTO = {
  'Si': { color: '#10b981', label: 'Cumplido', icon: CheckCircle2 },
  'No': { color: '#ef4444', label: 'No Cumplido', icon: XCircle },
  'En proceso': { color: '#f59e0b', label: 'En Proceso', icon: Clock },
  'En término': { color: '#6b7280', label: 'En Término', icon: AlertCircle },
  'Oportuno': { color: '#10b981', label: 'Oportuno', icon: CheckCircle2 },
  'Extemporáneo': { color: '#f59e0b', label: 'Extemporáneo', icon: Clock }
};

const DashboardCompromisos = () => {
  const [compromisos, setCompromisos] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [secretarios, setSecretarios] = useState([]);
  const [filtros, setFiltros] = useState({
    responsable: '',
    estado: '',
    año: '2025',
    busqueda: ''
  });
  const [vistaActual, setVistaActual] = useState('dashboard'); // dashboard, tabla, crear
  const [loading, setLoading] = useState(true);

  // Simular datos (reemplazar con llamadas a Firebase)
  useEffect(() => {
    // Aquí irían las llamadas a Firebase
    const datosSimulados = {
      compromisos: [
        {
          id: 1,
          no: 55,
          fechaReunion: '2025-02-03',
          descripcion: 'Acto administrativo delegación de rendición de la cuenta a la Contraloría',
          responsable1: 'C-001',
          responsable2: 'C-001',
          responsable3: null,
          fechaAsignada: '2025-02-03',
          fechaCumplimiento: '2025-02-10',
          cumplimiento: 'Si',
          valoracion: 'Oportuno'
        },
        {
          id: 2,
          no: 3,
          fechaReunion: '2025-02-05',
          descripcion: 'Actualización lista de participantes Frente de Seguridad',
          responsable1: 'C-001',
          fechaAsignada: '2025-02-05',
          fechaCumplimiento: '2025-12-30',
          cumplimiento: 'Si',
          valoracion: 'Oportuno'
        },
        {
          id: 3,
          no: 42,
          fechaReunion: '2025-09-23',
          descripcion: 'Actualización PGIRS',
          responsable1: 'C-001',
          fechaAsignada: '2025-09-23',
          fechaCumplimiento: '2025-10-25',
          cumplimiento: 'Si',
          valoracion: 'Oportuno'
        },
        {
          id: 4,
          no: 77,
          fechaReunion: '2025-03-31',
          descripcion: 'Actualizar política pública de protección animal',
          responsable1: 'C-001',
          fechaAsignada: '2025-03-31',
          fechaCumplimiento: null,
          cumplimiento: 'En proceso',
          valoracion: null
        }
      ],
      responsables: [
        { codigo: 'C-001', cargo: 'Alcalde Municipal' },
        { codigo: 'C-002', cargo: 'Secretario de Gobierno' },
        { codigo: 'C-003', cargo: 'Secretaria de Planeación' }
      ],
      secretarios: [
        {
          nombre: 'David Esteban Franco Vallejo',
          codigo: 'C-001',
          cargo: 'Alcalde Municipal',
          foto: 'https://via.placeholder.com/150'
        }
      ]
    };

    setCompromisos(datosSimulados.compromisos);
    setResponsables(datosSimulados.responsables);
    setSecretarios(datosSimulados.secretarios);
    setLoading(false);
  }, []);

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const total = compromisos.length;
    const cumplidos = compromisos.filter(c => c.cumplimiento === 'Si').length;
    const enProceso = compromisos.filter(c => c.cumplimiento === 'En proceso').length;
    const noCumplidos = compromisos.filter(c => c.cumplimiento === 'No').length;
    const enTermino = compromisos.filter(c => c.cumplimiento === 'En término').length;

    return {
      total,
      cumplidos,
      enProceso,
      noCumplidos,
      enTermino,
      porcentajeCumplimiento: total > 0 ? ((cumplidos / total) * 100).toFixed(1) : 0
    };
  };

  const estadisticas = calcularEstadisticas();

  // Datos para gráficos
  const datosGraficoBarra = [
    { nombre: 'Cumplidos', valor: estadisticas.cumplidos, color: '#10b981' },
    { nombre: 'En Proceso', valor: estadisticas.enProceso, color: '#f59e0b' },
    { nombre: 'No Cumplidos', valor: estadisticas.noCumplidos, color: '#ef4444' },
    { nombre: 'En Término', valor: estadisticas.enTermino, color: '#6b7280' }
  ];

  const datosGraficoPie = datosGraficoBarra.filter(d => d.valor > 0);

  // Filtrar compromisos
  const compromisosFiltrados = compromisos.filter(compromiso => {
    const cumpleFiltroResponsable = !filtros.responsable || 
      compromiso.responsable1 === filtros.responsable ||
      compromiso.responsable2 === filtros.responsable ||
      compromiso.responsable3 === filtros.responsable;
    
    const cumpleFiltroEstado = !filtros.estado || compromiso.cumplimiento === filtros.estado;
    
    const cumpleFiltroBusqueda = !filtros.busqueda || 
      compromiso.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());

    return cumpleFiltroResponsable && cumpleFiltroEstado && cumpleFiltroBusqueda;
  });

  // Vista Dashboard
  const DashboardView = () => (
    <div className="dashboard-content">
      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <Calendar size={28} />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.total}</h3>
            <p>Total Compromisos</p>
          </div>
        </div>

        <div className="stat-card cumplidos">
          <div className="stat-icon">
            <CheckCircle2 size={28} />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.cumplidos}</h3>
            <p>Cumplidos</p>
            <span className="stat-badge">{estadisticas.porcentajeCumplimiento}%</span>
          </div>
        </div>

        <div className="stat-card proceso">
          <div className="stat-icon">
            <Clock size={28} />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.enProceso}</h3>
            <p>En Proceso</p>
          </div>
        </div>

        <div className="stat-card pendientes">
          <div className="stat-icon">
            <XCircle size={28} />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.noCumplidos}</h3>
            <p>No Cumplidos</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Cumplimiento de Compromisos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosGraficoBarra}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nombre" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {datosGraficoBarra.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosGraficoPie}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, valor, percent }) => `${nombre}: ${valor} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {datosGraficoPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Vista Tabla
  const TablaView = () => (
    <div className="tabla-content">
      <div className="tabla-header">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar compromiso..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
          />
        </div>
        <button className="btn-nuevo" onClick={() => setVistaActual('crear')}>
          <Plus size={20} />
          Nuevo Compromiso
        </button>
      </div>

      <div className="tabla-wrapper">
        <table className="tabla-compromisos">
          <thead>
            <tr>
              <th>No</th>
              <th>Fecha Reunión</th>
              <th>Descripción</th>
              <th>Responsable(s)</th>
              <th>Fecha Cumplimiento</th>
              <th>Estado</th>
              <th>Valoración</th>
            </tr>
          </thead>
          <tbody>
            {compromisosFiltrados.map((compromiso) => {
              const EstadoIcon = ESTADOS_CUMPLIMIENTO[compromiso.cumplimiento]?.icon || AlertCircle;
              const estadoColor = ESTADOS_CUMPLIMIENTO[compromiso.cumplimiento]?.color || '#6b7280';
              
              return (
                <tr key={compromiso.id}>
                  <td className="td-no">{compromiso.no}</td>
                  <td>{new Date(compromiso.fechaReunion).toLocaleDateString('es-ES')}</td>
                  <td className="td-descripcion">{compromiso.descripcion}</td>
                  <td>
                    <div className="responsables-list">
                      {[compromiso.responsable1, compromiso.responsable2, compromiso.responsable3]
                        .filter(Boolean)
                        .map((resp, idx) => {
                          const responsable = responsables.find(r => r.codigo === resp);
                          return (
                            <span key={idx} className="badge-responsable">
                              {responsable?.cargo || resp}
                            </span>
                          );
                        })}
                    </div>
                  </td>
                  <td>
                    {compromiso.fechaCumplimiento 
                      ? new Date(compromiso.fechaCumplimiento).toLocaleDateString('es-ES')
                      : '-'}
                  </td>
                  <td>
                    <span 
                      className="badge-estado"
                      style={{ 
                        backgroundColor: `${estadoColor}20`,
                        color: estadoColor,
                        border: `1px solid ${estadoColor}`
                      }}
                    >
                      <EstadoIcon size={16} />
                      {compromiso.cumplimiento}
                    </span>
                  </td>
                  <td>
                    {compromiso.valoracion && (
                      <span className="badge-valoracion">
                        {compromiso.valoracion}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Header */
        .dashboard-header {
          background: white;
          padding: 24px 32px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }

        .header-title h1 {
          font-size: 28px;
          color: #1f2937;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin-top: 4px;
        }

        .header-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-select {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 150px;
        }

        .filter-select:hover {
          border-color: #667eea;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Navegación */
        .nav-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .nav-tab {
          padding: 12px 24px;
          background: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .nav-tab:hover {
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.4);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-card.total .stat-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .stat-card.cumplidos .stat-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .stat-card.proceso .stat-icon { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .stat-card.pendientes .stat-icon { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }

        .stat-info h3 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .stat-info p {
          color: #6b7280;
          font-size: 14px;
          margin-top: 4px;
        }

        .stat-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #10b98120;
          color: #059669;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }

        /* Charts */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .chart-card h3 {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 20px;
          font-weight: 600;
        }

        /* Tabla */
        .tabla-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .tabla-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          color: #1f2937;
        }

        .search-box input:focus {
          outline: none;
        }

        .btn-nuevo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-nuevo:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 12px -3px rgba(102, 126, 234, 0.4);
        }

        .tabla-wrapper {
          overflow-x: auto;
        }

        .tabla-compromisos {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }

        .tabla-compromisos thead {
          background: #f9fafb;
        }

        .tabla-compromisos th {
          padding: 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tabla-compromisos tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }

        .tabla-compromisos tbody tr:hover {
          background: #f9fafb;
        }

        .tabla-compromisos td {
          padding: 16px;
          font-size: 14px;
          color: #374151;
        }

        .td-no {
          font-weight: 600;
          color: #667eea;
        }

        .td-descripcion {
          max-width: 300px;
        }

        .responsables-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .badge-responsable {
          display: inline-block;
          padding: 4px 12px;
          background: #e0e7ff;
          color: #4f46e5;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-estado {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .badge-valoracion {
          display: inline-block;
          padding: 4px 12px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .tabla-header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <div className="header-logo">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E" alt="Logo" style={{width: '32px'}} />
          </div>
          <div>
            <h1>Compromisos Consejo de Gobierno</h1>
            <p className="header-subtitle">#JuntosConstruimos - Municipio de Guatapé</p>
          </div>
        </div>
        <div className="header-filters">
          <select 
            className="filter-select"
            value={filtros.responsable}
            onChange={(e) => setFiltros({ ...filtros, responsable: e.target.value })}
          >
            <option value="">Todos los responsables</option>
            {responsables.map(r => (
              <option key={r.codigo} value={r.codigo}>{r.cargo}</option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            {Object.keys(ESTADOS_CUMPLIMIENTO).map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={filtros.año}
            onChange={(e) => setFiltros({ ...filtros, año: e.target.value })}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* Navegación */}
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${vistaActual === 'dashboard' ? 'active' : ''}`}
          onClick={() => setVistaActual('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-tab ${vistaActual === 'tabla' ? 'active' : ''}`}
          onClick={() => setVistaActual('tabla')}
        >
          Compromisos
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>
          Cargando datos...
        </div>
      ) : vistaActual === 'dashboard' ? (
        <DashboardView />
      ) : (
        <TablaView />
      )}
    </div>
  );
};

export default DashboardCompromisos;
