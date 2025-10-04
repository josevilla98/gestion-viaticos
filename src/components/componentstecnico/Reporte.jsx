import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../conexion/Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { pdf } from "@react-pdf/renderer";
import ReportPDF from "./ReportePDF"; // 👈 componente PDF
import { useAuth } from "../../context/AuthContext"; // 👈 hook de auth
import "./Reporte.css";

const ReporteSalida = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // usuario logueado

  // Campos generales
  const [fechaInicio, setFechaInicio] = useState("");
  const [kmInicio, setKmInicio] = useState("");
  const [kmFinal, setKmFinal] = useState("");
  const [carro, setCarro] = useState("c203");

  // Distribuidoras seleccionadas
  const [distribuidorasSeleccionadas, setDistribuidorasSeleccionadas] = useState([]);

  const distribuidoras = [
    "CD mazatenango",
    "CD coatepeque",
    "CD xelaju",
    "CD san antonio",
    "CD quiche",
    "CD solola",
  ];

  // Gastos por día
  const [dias, setDias] = useState([
    { nombre: "Domingo", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
    { nombre: "Lunes", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
    { nombre: "Martes", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
    { nombre: "Miércoles", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
    { nombre: "Jueves", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
    { nombre: "Viernes", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
    { nombre: "Sábado", desayuno: 0, almuerzo: 0, cena: 0, hospedaje: 0, otros: 0, imagenes: [] },
  ]);

  // Handlers
  const manejarCambio = (index, campo, valor) => {
    const copia = [...dias];
    copia[index][campo] = valor;
    setDias(copia);
  };

  const manejarImagenes = (index, files) => {
    const copia = [...dias];
    copia[index].imagenes = Array.from(files);
    setDias(copia);
  };

  const manejarDistribuidora = (e) => {
    const opciones = Array.from(e.target.selectedOptions, (option) => option.value);
    setDistribuidorasSeleccionadas(opciones);
  };

  // Calcular total
  const totalGeneral = dias.reduce(
    (acc, d) =>
      acc +
      Number(d.desayuno) +
      Number(d.almuerzo) +
      Number(d.cena) +
      Number(d.hospedaje) +
      Number(d.otros),
    0
  );

  // Guardar Reporte
  const guardarReporte = async () => {
    try {
      // 1️⃣ Obtener info del usuario desde Firestore
      const userRef = doc(db, "usuario", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("❌ No se encontró la información del usuario");
        return;
      }

      const userData = userSnap.data();

      // 2️⃣ Guardar reporte base en Firestore
      const reporteRef = await addDoc(collection(db, "ReportesSalida"), {
        fechaInicio,
        kmInicio,
        kmFinal,
        carro,
        distribuidoras: distribuidorasSeleccionadas,
        totalGeneral,
        estado: "pendiente",
        creadoEn: serverTimestamp(),
        usuario: {
          uid: user.uid,
          nombre: userData.nombre,
          codigo: userData.codigo,
          rol: userData.rol,
          distribuidora: userData.distribuidora,
        },
      });

      const reporteId = reporteRef.id;

      // 3️⃣ Guardar subcolección con los días
      const diasGuardados = [];
      for (const dia of dias) {
        if (
          Number(dia.desayuno) === 0 &&
          Number(dia.almuerzo) === 0 &&
          Number(dia.cena) === 0 &&
          Number(dia.hospedaje) === 0 &&
          Number(dia.otros) === 0 &&
          dia.imagenes.length === 0
        ) {
          continue;
        }

        const urls = [];
        for (const imagen of dia.imagenes) {
          const storageRef = ref(storage, `reportes/${reporteId}/${dia.nombre}/${imagen.name}`);
          await uploadBytes(storageRef, imagen);
          const url = await getDownloadURL(storageRef);
          urls.push(url);
        }

        const diaData = {
          nombre: dia.nombre,
          desayuno: Number(dia.desayuno),
          almuerzo: Number(dia.almuerzo),
          cena: Number(dia.cena),
          hospedaje: Number(dia.hospedaje),
          otros: Number(dia.otros),
          imagenes: urls,
        };

        diasGuardados.push(diaData);

        await addDoc(collection(db, "ReportesSalida", reporteId, "dias"), diaData);
      }

      // 4️⃣ Generar PDF con datos de usuario + días + imágenes
      const datos = {
        fechaInicio,
        kmInicio,
        kmFinal,
        carro,
        distribuidorasSeleccionadas,
        totalGeneral,
        usuario: userData,
      };

      const blob = await pdf(<ReportPDF datos={datos} dias={diasGuardados} />).toBlob();

      const pdfRef = ref(storage, `reportes/${reporteId}/reporte.pdf`);
      await uploadBytes(pdfRef, blob);
      const pdfUrl = await getDownloadURL(pdfRef);

      // 5️⃣ Guardar el link del PDF en el documento principal
      await updateDoc(doc(db, "ReportesSalida", reporteId), { pdfUrl });

      alert("✅ Reporte guardado correctamente con PDF");
      navigate(-1);
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      alert("❌ Ocurrió un error al guardar el reporte");
    }
  };

  return (
    <div className="reporte-container">
      {/* ENCABEZADO */}
      <div className="reporte-header">
        <h2>Reporte de Gastos de Salida</h2>
        <button className="btn-cancelar" onClick={() => navigate(-1)}>
          Cancelar
        </button>
      </div>

      {/* FORMULARIO SUPERIOR */}
      <div className="form-section">
        <label>Fecha de inicio de la semana:</label>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />

        <label>Kilometraje inicial:</label>
        <input type="number" value={kmInicio} onChange={(e) => setKmInicio(e.target.value)} />

        <label>Kilometraje final:</label>
        <input type="number" value={kmFinal} onChange={(e) => setKmFinal(e.target.value)} />

        <label>Carro utilizado:</label>
        <select value={carro} onChange={(e) => setCarro(e.target.value)}>
          <option value="c203">C203</option>
          <option value="c205">C205</option>
          <option value="p103">P103</option>
        </select>

        {/* Selector de distribuidoras */}
        <label>Distribuidoras visitadas:</label>
        <select multiple value={distribuidorasSeleccionadas} onChange={manejarDistribuidora}>
          {distribuidoras.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>
        <p><small>Puedes mantener CTRL (Windows) o CMD (Mac) para seleccionar varias</small></p>
      </div>

      {/* TABLA DE GASTOS */}
      <div className="tabla-gastos">
        {dias.map((dia, i) => (
          <div key={i} className="columna-dia">
            <h4>{dia.nombre}</h4>

            <label>Desayuno:</label>
            <input
              type="number"
              value={dia.desayuno}
              onChange={(e) => manejarCambio(i, "desayuno", e.target.value)}
            />

            <label>Almuerzo:</label>
            <input
              type="number"
              value={dia.almuerzo}
              onChange={(e) => manejarCambio(i, "almuerzo", e.target.value)}
            />

            <label>Cena:</label>
            <input
              type="number"
              value={dia.cena}
              onChange={(e) => manejarCambio(i, "cena", e.target.value)}
            />

            <label>Hospedaje:</label>
            <input
              type="number"
              value={dia.hospedaje}
              onChange={(e) => manejarCambio(i, "hospedaje", e.target.value)}
            />

            <label>Otros:</label>
            <input
              type="number"
              value={dia.otros}
              onChange={(e) => manejarCambio(i, "otros", e.target.value)}
            />

            <label>Facturas (puedes subir varias):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => manejarImagenes(i, e.target.files)}
            />
          </div>
        ))}
      </div>

      {/* RESUMEN FINAL */}
      <div className="resumen-final">
        <h3>Total de gastos (sin combustible): Q {totalGeneral.toFixed(2)}</h3>
        <button className="btn-guardar" onClick={guardarReporte}>
          Guardar Reporte
        </button>
      </div>
    </div>
  );
};

export default ReporteSalida;
