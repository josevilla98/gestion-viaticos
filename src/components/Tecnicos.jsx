import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../conexion/Firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import logoCMI from "./Imagenes/Logocmi.png";
import "./Tecnicos.css";

const Tecnicos = () => {
  const fechaActual = new Date().toLocaleDateString("es-ES");
  const saldoBase = 2500; // saldo inicial
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [saldoEstimado, setSaldoEstimado] = useState(saldoBase);
  const [gastosMeses, setGastosMeses] = useState({
    mes1: 0,
    mes2: 0,
    mes3: 0,
  });

  // 🔹 Obtener nombre del usuario desde Firestore
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

  // 🔹 Obtener reportes del usuario
  useEffect(() => {
    const fetchReportes = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, "ReportesSalida"),
          where("usuario.uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        let totalPendiente = 0;
        const gastosPorMes = {};

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const fecha = new Date(data.creadoEn?.seconds * 1000);
          const mes = fecha.toLocaleString("es-ES", { month: "long" });

          // 🔹 Restar solo pendientes al saldo
          if (data.estado === "pendiente") {
            totalPendiente += data.totalGeneral || 0;
          }

          // 🔹 Sumar por mes
          if (!gastosPorMes[mes]) gastosPorMes[mes] = 0;
          gastosPorMes[mes] += data.totalGeneral || 0;
        });

        // 🔹 Calcular saldo
        setSaldoEstimado(saldoBase - totalPendiente);

        // 🔹 Últimos 3 meses (en orden)
        const hoy = new Date();
        const mesesLabels = [];
        const gastosFinal = {};

        for (let i = 2; i >= 0; i--) {
          const fechaMes = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
          const mesNombre = fechaMes.toLocaleString("es-ES", { month: "long" });
          mesesLabels.push(mesNombre);
          gastosFinal[mesNombre] = gastosPorMes[mesNombre] || 0;
        }

        setGastosMeses(gastosFinal);
      } catch (error) {
        console.error("❌ Error obteniendo reportes:", error);
      }
    };

    fetchReportes();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="tecnicos-container">
      {/* Panel lateral */}
      <div className="sidebar">
        <img src={logoCMI} alt="Logo CMI" className="logo-sidebar" />
        <button onClick={() => navigate("/Reporte")}>Ingresar Gastos</button>
        <button onClick={() => navigate("/historial")}>Historial</button>
        <button onClick={() => navigate("/distribuidoras")}>Distribuidoras</button>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {/* Panel derecho */}
      <div className="main-content">
        <h2>Bienvenido {nombreUsuario}</h2>
        <h3>Resumen de Gastos</h3>

        <div className="resumen-circulos">
          {Object.entries(gastosMeses).map(([mes, gasto]) => (
            <div className="circulo" key={mes}>
              <p>{mes}</p>
              <span>Q. {gasto}</span>
            </div>
          ))}
        </div>

        <div className="info-extra">
          <p><strong>Fecha actual:</strong> {fechaActual}</p>
          <p><strong>Saldo estimado en cuenta:</strong> Q. {saldoEstimado}</p>
        </div>
      </div>
    </div>
  );
};

export default Tecnicos;
