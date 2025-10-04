import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../conexion/Firebase"; // usamos db directamente
import { useNavigate } from "react-router-dom";
import "./Distribuidoras.css";
import logoCMI from "../Imagenes/Logocmi.png"; // 🔹 Ajusta la ruta si es necesario

const Distribuidoras = () => {
  const [distribuidoras, setDistribuidoras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistribuidoras = async () => {
      try {
        const distribuidorasRef = collection(db, "distribuidoras"); 
        const snapshot = await getDocs(distribuidorasRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDistribuidoras(data);
      } catch (error) {
        console.error("Error obteniendo distribuidoras:", error);
      }
    };

    fetchDistribuidoras();
  }, []);

  return (
    <div className="distribuidoras-container">
      {/* 🔹 Logo */}
      <div className="header">
        <img src={logoCMI} alt="Logo CMI" className="logo-cmi" />
        <h2>Distribuidoras</h2>
      </div>

      {/* 🔹 Lista de distribuidoras */}
      <div className="lista-distribuidoras">
        {distribuidoras.map((dist) => (
          <div key={dist.id} className="distribuidora-card">
            <span className="nombre">{dist.nombre}</span>
            <span className="ubicacion">{dist.ubicacion}</span>
          </div>
        ))}
      </div>

      {/* 🔹 Botón de atrás */}
      <button className="btn-atras" onClick={() => navigate("/tecnicos")}>
        ⬅ Atrás
      </button>
    </div>
  );
};

export default Distribuidoras;
