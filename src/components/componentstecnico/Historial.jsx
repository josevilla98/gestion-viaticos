// src/components/componentestecnico/Historial.jsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../conexion/Firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logocmi from "../Imagenes/Logocmi.png";
import "./Historial.css";

const Historial = () => {
  const { user } = useAuth(); // 👈 correo del usuario logueado
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        if (!user?.email) return;

        // 🔹 Buscar los reportes creados por este usuario
        //const q = query(collection(db, "ReportesSalida"), where("usuarioEmail", "==", user.email));
        const q = query(collection(db, "ReportesSalida"), where("usuario.uid", "==", user.uid));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReportes(data);
      } catch (error) {
        console.error("❌ Error al obtener historial:", error);
      }
    };

    fetchReportes();
  }, [user]);

  return (
    <div className="historial-container">
      {/* ENCABEZADO */}
      <div className="historial-header">
        <img src={logocmi} alt="Logo CMI" className="logo" />
        <button className="btn-salir" onClick={() => navigate(-1)}>
          ⬅ Atrás
        </button>
      </div>

      <h2>📑 Historial de Reportes</h2>

      {reportes.length === 0 ? (
        <p className="no-reportes">No tienes reportes guardados.</p>
      ) : (
        <ul className="lista-reportes">
          {reportes.map((r) => (
            <li key={r.id} className="reporte-item">
              <div>
                <strong>Fecha inicio:</strong> {r.fechaInicio} <br />
                <strong>Vehículo:</strong> {r.carro} <br />
                <strong>Total:</strong> Q {r.totalGeneral} <br />
                <strong>Estado:</strong>{" "}
                <span
                  className={
                    r.estado === "pendiente"
                      ? "estado-pendiente"
                      : r.estado === "aprobado"
                      ? "estado-aprobado"
                      : "estado-rechazado"
                  }
                >
                  {r.estado}
                </span>
              </div>

              {r.pdfUrl && (
                <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-pdf">
                  📥 Ver PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial;
