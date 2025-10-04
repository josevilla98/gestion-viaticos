// src/components/DashboardPlanificador.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../conexion/Firebase';
import './Planificador.css';
import logoCMI from './Imagenes/Logocmi.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Planificador = () => {
  const [vista, setVista] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    codigo: '',
    rol: '',
    distribuidora: '',
    contraseña: ''
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 🔹 Obtener nombre del planificador desde Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, "usuario", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setNombreUsuario(data.nombre || user.email);
        } else {
          setNombreUsuario(user.email);
        }
      } catch (error) {
        console.error("❌ Error obteniendo usuario:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // 🔹 Obtener usuarios filtrados por rol
  const obtenerUsuarios = async (rol) => {
    try {
      const q = query(collection(db, "usuario"), where("rol", "==", rol));
      const snapshot = await getDocs(q);
      const filtrados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsuarios(filtrados);
      setVista(rol);
    } catch (error) {
      console.error("❌ Error obteniendo usuarios:", error);
    }
  };

  // 🔹 Agregar nuevo usuario
  const agregarUsuario = async () => {
    try {
      await addDoc(collection(db, "usuario"), nuevoUsuario);
      alert('✅ Usuario agregado correctamente');
      setNuevoUsuario({
        nombre: '',
        codigo: '',
        rol: '',
        distribuidora: '',
        contraseña: ''
      });
    } catch (error) {
      console.error('❌ Error al agregar usuario:', error);
      alert('Hubo un error al agregar el usuario');
    }
  };

  // 🔹 cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* LOGO EN BURBUJA */}
        <div className="logo-bubble">
          <img src={logoCMI} alt="Logo" className="dashboard-logo" />
        </div>
        <h1>Sistema de Control de Viáticos</h1>
      </header>

      <main className="dashboard-main">
        <h2>Bienvenido, {nombreUsuario}</h2>

        <div className="button-group">
          <button className="dashboard-button" onClick={() => obtenerUsuarios('Tecnico')}>
            Ver Técnicos
          </button>
          <button className="dashboard-button" onClick={() => obtenerUsuarios('Supervisor')}>
            Ver Supervisores
          </button>
          <button className="dashboard-button" onClick={() => setVista('Agregar')}>
            Agregar Usuario
          </button>
          <button className="dashboard-button" onClick={() => navigate("/Reclamosplani")}>
            Reportes de Salidas
          </button>
          <button className="dashboard-button" onClick={() => navigate("/Reclamos")}>
            Ver Reclamos
          </button>
          <button className="dashboard-button logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

        {vista === 'Tecnico' || vista === 'Supervisor' ? (
          <div className="usuarios-lista">
            <h3>Lista de {vista === 'Tecnico' ? 'Técnicos' : 'Supervisores'}</h3>
            <ul>
              {usuarios.map((usuario) => (
                <li key={usuario.id}>
                  <strong>{usuario.nombre}</strong> — {usuario.codigo} — {usuario.distribuidora}
                </li>
              ))}
            </ul>
          </div>
        ) : vista === 'Agregar' ? (
          <div className="agregar-usuario">
            <h3>Agregar Nuevo Usuario</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Código"
              value={nuevoUsuario.codigo}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, codigo: e.target.value })}
            />
            <select
              value={nuevoUsuario.rol}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
            >
              <option value="">Seleccione Rol</option>
              <option value="Tecnico">Técnico</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Planificador">Planificador</option>
            </select>
            <input
              type="text"
              placeholder="Distribuidora"
              value={nuevoUsuario.distribuidora}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, distribuidora: e.target.value })}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.contraseña}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contraseña: e.target.value })}
            />
            <button className="dashboard-button" onClick={agregarUsuario}>Guardar Usuario</button>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Planificador;
