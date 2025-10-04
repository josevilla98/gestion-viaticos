import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../conexion/Firebase";
import './Login.css';
import cmiteescucha from './Imagenes/cmiteescucha.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;

      // 📌 Buscar en Firestore el documento del usuario
      const docRef = doc(db, "usuario", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const rol = data.rol;

        // 📌 Redirección según el rol
        if (rol === "Tecnico") {
          navigate('/Tecnicos');
        } else if (rol === "Planificador") {
          navigate('/Planificador');
        }else if (rol === "Supervisor") {
          navigate('/Supervisores');
        } 
         else {
          navigate('/'); // fallback
        }
      } else {
        setError("No se encontró información del usuario en la base de datos.");
      }
    } catch (err) {
      setError('Error en el inicio de sesión. Verifica tu correo o contraseña.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      {/* Parte superior con el formulario */}
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Ingresar</button>
        </form>
      </div>

      {/* Parte inferior dividida en 2 columnas */}
      <div className="login-bottom">
        <div className="login-left">
          <h3>Denuncias y Valores REIR</h3>
          <p>
            Nuestra empresa promueve los valores <b>Respeto, Ética, Integridad y Responsabilidad (REIR)</b>.
            Si eres testigo de situaciones no aceptables, cuentas con los canales
            adecuados para denunciar de manera segura y confidencial.  
            <br /><br />
            Fomentamos una cultura organizacional donde la transparencia y el
            respeto prevalecen, asegurando que cada colaborador se sienta protegido y escuchado.
          </p>
        </div>

        <div className="login-right">
        <img src={cmiteescucha} alt="Comité de Escucha" />
        </div>
      </div>
    </div>
  );
};

export default Login;
