import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logoCMI from './Imagenes/Logocmi.png';
import imagen1 from './Imagenes/cmi1.jpg';
import imagen2 from './Imagenes/cmi2.jpg';
import imagen3 from './Imagenes/cmi3.webp';
import imagen4 from './Imagenes/cmi4.jpg';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const irAlLogin = () => {
    navigate('/login');
  };

  // Cambio automático de imágenes cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const imagenes = [imagen2, imagen3, imagen4];

  return (
    <div className="home-wrapper">
      {/* Óvalo con logo, título y botón */}
      <header className="home-header">
        <div className="oval-container">
          <img src={logoCMI} alt="Logo CMI" className="logo" />
          <h1 className="titulo">Sistema de Control de Viáticos</h1>
          <button onClick={irAlLogin} className="boton-login">
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Carrusel */}
      <section className="carrusel">
        <img src={imagenes[index]} alt={`Imagen ${index}`} className="carrusel-img" />

        {/* Texto sobre carrusel */}
        <div className="texto-sobre-carrusel">
          <p>
            Bienvenido al sistema de gestión de viáticos. Aquí podrás registrar tus solicitudes, hacer 
            seguimiento a tus reembolsos y administrar tus gastos de forma eficiente.
          </p>
        </div>
      </section>

      {/* Sección inferior con imagen izquierda y texto derecha */}
      <section className="contenido-inferior">
        <div className="columna-izq">
          <img src={imagen1} alt="Imagen principal" className="imagen-lateral" />
        </div>
        <div className="columna-der">
          <h2 className="somos-cmi">Somos CMI</h2>
          <p>
            Somos una corporación familiar multilatina con 105 años de buenas historias que contar 
            generando valor económico, social y ambiental en las comunidades donde operamos, 
            ofreciendo excelencia y calidad en nuestros productos, servicios y proyectos.
          </p>

          {/* División en dos columnas */}
          <div className="valores-anos">
            <div className="valores">
              <h3>Nuestros valores REIR</h3>
              <p>
                Nos inspiramos en los valores que nuestro fundador, don Juan Bautista, siguió durante su vida 
                y continuamos su legado interactuando y realizando nuestras actividades con responsabilidad, 
                excelencia, integridad y respeto: los valores corporativos REIR.
              </p>
            </div>
            <div className="anos">
              <h3>105 años</h3>
              <p>
                A lo largo de 105 años, nuestra empresa ha tenido muchos comienzos, abierto muchas puertas, 
                incursionado en múltiples áreas de negocio y ha tenido un sinfín de aprendizajes. Descubre cómo 
                inició el sueño de un gran visionario en 1920 con una pequeña tienda en San Cristóbal, Totonicapán en Guatemala.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
