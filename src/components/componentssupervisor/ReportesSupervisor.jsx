// src/components/componentssupervisor/ReportesSupervisor.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../conexion/Firebase";
import { useNavigate } from "react-router-dom";
import "./ReportesSupervisor.css";
import logocmi from "../Imagenes/Logocmi.png";

const ReportesSupervisor = () => {
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  const fetchReportes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ReportesSalida"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportes(data);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const actualizarEstado = async (id, estado) => {
    try {
      const reporteRef = doc(db, "ReportesSalida", id);
      await updateDoc(reporteRef, { estado });
      fetchReportes(); // recargar lista
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  return (
    <div className="reportes-container">
      {/* ENCABEZADO */}
      <div className="reportes-header">
        <img src={logocmi} alt="Logo CMI" className="logo" />
        <button className="btn-salir" onClick={() => navigate(-1)}>
          ⬅ Atrás
        </button>
      </div>

      <h2>📑 Reportes pendientes</h2>

      <div className="reportes-lista">
        {reportes.length === 0 ? (
          <p>No hay reportes aún.</p>
        ) : (
          reportes.map((r) => (
            <div key={r.id} className="reporte-card">
              <div className="reporte-info">
                <h3>🚗 {r.carro}</h3>
                <p><b>Fecha inicio:</b> {r.fechaInicio}</p>
                <p><b>Total:</b> Q {Number(r.totalGeneral).toFixed(2)}</p>
                <p><b>Estado:</b> {r.estado || "pendiente"}</p>
              </div>

              <div className="reporte-actions">
                {r.pdfUrl && (
                  <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-pdf">
                    📄 Ver PDF
                  </a>
                )}

                {(!r.estado || r.estado === "pendiente") && (
                  <>
                    <button className="btn-aceptar" onClick={() => actualizarEstado(r.id, "aceptado")}>
                      ✅ Aceptar
                    </button>
                    <button className="btn-rechazar" onClick={() => actualizarEstado(r.id, "rechazado")}>
                      ❌ Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportesSupervisor;
