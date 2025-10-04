// src/components/componentsplanificador/ReportesPlanificador.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../../conexion/Firebase";
import { useNavigate } from "react-router-dom";
import "./Reportesplani.css";
import logocmi from "../Imagenes/Logocmi.png";

const ReportesPlanificador = () => {
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  const fetchReportes = async () => {
    try {
      const q = query(collection(db, "ReportesSalida"), where("estado", "==", "aceptado"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportes(data);
    } catch (error) {
      console.error("Error al obtener reportes aceptados:", error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const finalizarReporte = async (id) => {
    try {
      const reporteRef = doc(db, "ReportesSalida", id);
      await updateDoc(reporteRef, { estado: "finalizado" });
      fetchReportes();
    } catch (error) {
      console.error("Error al finalizar reporte:", error);
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

      <h2>📑 Reportes aceptados (Planificador)</h2>

      <div className="reportes-lista">
        {reportes.length === 0 ? (
          <p>No hay reportes aceptados aún.</p>
        ) : (
          reportes.map((r) => (
            <div key={r.id} className="reporte-card">
              <div className="reporte-info">
                <h3>🚗 {r.carro}</h3>
                <p><b>Fecha inicio:</b> {r.fechaInicio}</p>
                <p><b>Total gastos:</b> Q {Number(r.totalGeneral).toFixed(2)}</p>
                <p><b>Estado:</b> {r.estado}</p>
              </div>

              <div className="reporte-actions">
                {r.pdfUrl && (
                  <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-pdf">
                    📄 Ver PDF
                  </a>
                )}

                {r.estado === "aceptado" && (
                  <button className="btn-finalizar" onClick={() => finalizarReporte(r.id)}>
                    🔒 Finalizar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportesPlanificador;
