import { useState } from "react";
import { db } from "../../conexion/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Reclamossuper.css";
import logocmi from "../Imagenes/Logocmi.png";

const Reclamossuper = () => {
  const [texto, setTexto] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const enviarReclamo = async () => {
    if (!texto.trim()) {
      alert("❌ El reclamo no puede estar vacío");
      return;
    }

    try {
      await addDoc(collection(db, "Reclamos"), {
        texto,
        creadoEn: serverTimestamp(),
        usuario: user.email, // 👈 aquí guardamos quién lo envió
        estado: "pendiente",
      });

      alert("✅ Reclamo enviado correctamente");
      setTexto("");
      navigate(-1); // regresa a la pantalla anterior
    } catch (error) {
      console.error("Error guardando reclamo:", error);
      alert("❌ Error al enviar reclamo");
    }
  };

  return (
    <div className="reclamo-container">
      {/* Header con logo y cancelar */}
      <div className="reclamo-header">
        <button className="btn-cancelar" onClick={() => navigate(-1)}>
          Cancelar
        </button>
        <img src={logocmi} alt="Logo CMI" className="logo" />
      </div>

      <h2>📢 Enviar Reclamo</h2>

      {/* Área de texto */}
      <textarea
        className="reclamo-textarea"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe aquí el motivo de tu reclamo..."
      />

      {/* Botón de enviar */}
      <button className="btn-enviar" onClick={enviarReclamo}>
        Enviar Reclamo
      </button>
    </div>
  );
};

export default Reclamossuper;
