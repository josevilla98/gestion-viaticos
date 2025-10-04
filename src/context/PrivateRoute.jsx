// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, rolRequerido }) => {
  const { user, loading, userData } = useAuth();

  // ⏳ Si aún está cargando la autenticación
  if (loading) {
    return <p>Cargando...</p>;
  }

  // ❌ Si no está logueado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Si el usuario no tiene rol o no cumple con el requerido
  if (rolRequerido && userData?.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si todo bien, renderiza el contenido
  return children;
};

export default PrivateRoute;
