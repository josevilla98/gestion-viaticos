// src/components/Supervisores.jsx
import './Supervisores.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../conexion/Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import logoCMI from './Imagenes/Logocmi.png';

const Supervisores = () => {
  const fechaActual = new Date().toLocaleDateString('es-ES');
  const saldoInicial = 2500;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [resumen, setResumen] = useState([]);
  const [saldoEstimado, setSaldoEstimado] = useState(saldoInicial);
  const [mostrarTecnicos, setMostrarTecnicos] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);

  // 🔹 Traer nombre del supervisor
  useEffect(() => {
    const fetchNombre = async () => {
      if (!user?.email) return;
      const snapshot = await getDocs(collection(db, 'usuario'));
      const usuarioData = snapshot.docs
        .map((doc) => doc.data())
        .find((u) => u.codigo === user.email || u.correo === user.email);

      if (usuarioData) setNombre(usuarioData.nombre);
    };
    fetchNombre();
  }, [user]);

  // 🔹 Traer gastos últimos 3 meses
  useEffect(() => {
    const fetchGastos = async () => {
      if (!user?.email) return;
      const q = query(
        collection(db, 'ReportesSalida'),
        where('usuarioEmail', '==', user.email)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());

      // Obtener últimos 3 meses
      const hoy = new Date();
      const meses = [];
      for (let i = 2; i >= 0; i--) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
        const nombreMes = fecha.toLocaleString('es-ES', { month: 'long' });
        const gastosMes = data
          .filter((r) => {
            const f = new Date(r.fechaInicio);
            return f.getMonth() === fecha.getMonth() && f.getFullYear() === fecha.getFullYear();
          })
          .reduce((acc, r) => acc + (parseFloat(r.totalGeneral) || 0), 0);
        meses.push({ mes: nombreMes, total: gastosMes });
      }
      setResumen(meses);

      // Calcular saldo solo con reportes pendientes
      const totalPendientes = data
        .filter((r) => r.estado === 'pendiente')
        .reduce((acc, r) => acc + (parseFloat(r.totalGeneral) || 0), 0);

      setSaldoEstimado(saldoInicial - totalPendientes);
    };
    fetchGastos();
  }, [user]);

  // 🔹 Traer técnicos
  const fetchTecnicos = async () => {
    const snapshot = await getDocs(collection(db, 'usuario'));
    const lista = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((u) => u.rol === 'Tecnico');
    setTecnicos(lista);
    setMostrarTecnicos(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="tecnicos-container">
      {/* Panel lateral */}
      <div className="sidebar">
        <img src={logoCMI} alt="Logo CMI" className="logo-sidebar" />
        <button onClick={() => navigate('/Reportesuper')}>Ingresar Gastos</button>
        <button onClick={() => navigate('/Reportemes')}>Reportes de salida</button>
        <button onClick={() => navigate('/reportes-supervisor')}>Ver Reportes Supervisores</button>
        <button onClick={() => navigate('/Reclamossuper')}>Realizar Reclamo</button>
        <button onClick={fetchTecnicos}>Ver Técnicos</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {/* Panel derecho */}
      <div className="main-content">
        {mostrarTecnicos ? (
          <>
            <div className="header-tecnicos">
              <h2>Lista de Técnicos</h2>
              <button className="btn-cerrar" onClick={() => setMostrarTecnicos(false)}>
                ❌ Cerrar
              </button>
            </div>
            <ul className="lista-usuarios">
              {tecnicos.map((t) => (
                <li key={t.id}>
                  <strong>{t.nombre}</strong> — {t.codigo} — {t.Distribuidora}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h2>Bienvenido {nombre || user?.email}</h2>
            <h3>Resumen de Gastos</h3>
            <div className="resumen-circulos">
              {resumen.map((r, i) => (
                <div className="circulo" key={i}>
                  <p>{r.mes}</p>
                  <span>Q. {r.total}</span>
                </div>
              ))}
            </div>
            <div className="info-extra">
              <p><strong>Fecha actual:</strong> {fechaActual}</p>
              <p><strong>Saldo estimado en cuenta:</strong> Q. {saldoEstimado}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Supervisores;
