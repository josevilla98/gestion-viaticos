// src/components/componentssupervisor/Reportesmes.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../conexion/Firebase";
import { useNavigate } from "react-router-dom";
import "./Reportesmes.css";
import logocmi from "../Imagenes/Logocmi.png";

const Reportesmes = () => {
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ReportesSalida"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReportes(data);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
      }
    };

    fetchReportes();
  }, []);

  return (
    <div className="reportes-container">
      {/* ENCABEZADO */}
      <div className="reportes-header">
        <img src={logocmi} alt="Logo CMI" className="logo" />
        <button className="btn-salir" onClick={() => navigate(-1)}>
          ⬅ Atrás
        </button>
      </div>

      <h2>📑 Reportes de salida</h2>

      <div className="reportes-lista">
        {reportes.length === 0 ? (
          <p>No hay reportes disponibles.</p>
        ) : (
          reportes.map((r) => (
            <div key={r.id} className="reporte-card">
              <div className="reporte-info">
                <h3>🚗 {r.carro}</h3>
                <p><b>Fecha inicio:</b> {r.fechaInicio}</p>
                <p><b>Kilometraje:</b> {r.kmInicio} → {r.kmFinal}</p>
                <p><b>Total gastos:</b> Q {Number(r.totalGeneral).toFixed(2)}</p>
              </div>

              <div className="reporte-actions">
                {r.pdfUrl ? (
                  <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-pdf">
                    📄 Ver PDF
                  </a>
                ) : (
                  <span className="no-pdf">PDF no disponible</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reportesmes;
