import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Tecnicos from "./components/Tecnicos";
import Admin from "./components/Planificador";
import PrivateRoute from "./context/PrivateRoute";

// 🔹 importa los componentes de técnico
import Reporte from "./components/componentstecnico/Reporte";
import Distribuidoras from "./components/componentstecnico/Distribuidoras";
import Historial from "./components/componentstecnico/Historial";

// 🔹 importa los componentes de supervisor
import Supervisores from "./components/Supervisores";
import Reportemes from "./components/componentssupervisor/Reportesmes";
import ReportesSupervisor from "./components/componentssupervisor/ReportesSupervisor"; 
import Reportesuper from "./components/componentssupervisor/Reportesuper"; // ✅ NUEVO (Ingresar Gastos)
import Reclamossuper from "./components/componentssupervisor/Reclamossuper"; // ✅ NUEVO (Reclamos)

// 🔹 importa los componentes de planificador
import Reclamos from "./components/componentsplanificador/Reclamos";
import Reclamosplani from "./components/componentsplanificador/Reportesplani";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/tecnicos"
          element={
            <PrivateRoute rolRequerido="Tecnico">
              <Tecnicos />
            </PrivateRoute>
          }
        />
        <Route
          path="/Planificador"
          element={
            <PrivateRoute rolRequerido="Planificador">
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/Supervisores"
          element={
            <PrivateRoute rolRequerido="Supervisor">
              <Supervisores />
            </PrivateRoute>
          }
        />
        <Route
          path="/Reportemes"
          element={
            <PrivateRoute rolRequerido="Supervisor">
              <Reportemes />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nueva ruta para reportes del supervisor */}
        <Route
          path="/reportes-supervisor"
          element={
            <PrivateRoute rolRequerido="Supervisor">
              <ReportesSupervisor />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nueva ruta para ingresar gastos (Reportesuper) */}
        <Route
          path="/Reportesuper"
          element={
            <PrivateRoute rolRequerido="Supervisor">
              <Reportesuper />
            </PrivateRoute>
          }
        />

        {/* 🔹 Nueva ruta para reclamos del supervisor */}
        <Route
          path="/Reclamossuper"
          element={
            <PrivateRoute rolRequerido="Supervisor">
              <Reclamossuper />
            </PrivateRoute>
          }
        />

        {/* 🔹 Subrutas para técnicos */}
        <Route
          path="/Reporte"
          element={
            <PrivateRoute rolRequerido="Tecnico">
              <Reporte />
            </PrivateRoute>
          }
        />
        <Route
          path="/Distribuidoras"
          element={
            <PrivateRoute rolRequerido="Tecnico">
              <Distribuidoras />
            </PrivateRoute>
          }
        />
        <Route
          path="/Historial"
          element={
            <PrivateRoute rolRequerido="Tecnico">
              <Historial />
            </PrivateRoute>
          }
        />

        {/* 🔹 Subrutas para planificador */}
        <Route
          path="/Reclamos"
          element={
            <PrivateRoute rolRequerido="Planificador">
              <Reclamos />
            </PrivateRoute>
          }
        />
        <Route
          path="/Reclamosplani"
          element={
            <PrivateRoute rolRequerido="Planificador">
              <Reclamosplani />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
