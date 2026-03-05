import React, { useEffect, useState } from 'react';
import './App.css';

// FONDO LÍQUIDO ACTUALIZADO: Más bajo, blurry y pastel
const LiquidBackground = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    background: '#080b14', // Mantenemos el fondo oscuro base
    overflow: 'hidden'
  }}>
    {/* Capa de Blur y Opacidad para efecto pastel y suave */}
    <div style={{
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(50px)', // Blur intenso para suavizar formas
      WebkitBackdropFilter: 'blur(50px)',
      opacity: 0.6, // Reducimos opacidad general para tono pastel
      display: 'flex',
      alignItems: 'flex-end' // Forzamos el contenido al fondo
    }}>
      <svg 
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none" 
        style={{ 
          width: '100%', 
          height: '60%', // Reducimos la altura del SVG al 60%
          transform: 'translateY(10%)' // Lo empujamos un poco más abajo
        }}
      >
        {/* Capa 1: Deep Purple (Base más alta) */}
        <path fill="rgba(76, 29, 149, 0.7)">
          <animate attributeName="d" dur="20s" repeatCount="indefinite"
            values="
              M0,300 C250,400 750,200 1000,300 L1000,1000 L0,1000 Z;
              M0,300 C300,200 800,400 1000,300 L1000,1000 L0,1000 Z;
              M0,300 C250,400 750,200 1000,300 L1000,1000 L0,1000 Z
            " />
        </path>
        {/* Capa 2: Fucsia (Media) */}
        <path fill="rgba(192, 38, 211, 0.5)">
          <animate attributeName="d" dur="15s" repeatCount="indefinite"
            values="
              M0,450 C300,350 600,550 1000,450 L1000,1000 L0,1000 Z;
              M0,450 C400,550 800,350 1000,450 L1000,1000 L0,1000 Z;
              M0,450 C300,350 600,550 1000,450 L1000,1000 L0,1000 Z
            " />
        </path>
        {/* Capa 3: Magenta (Superior, más baja) */}
        <path fill="rgba(219, 39, 119, 0.4)">
          <animate attributeName="d" dur="25s" repeatCount="indefinite"
            values="
              M0,600 C400,700 700,500 1000,600 L1000,1000 L0,1000 Z;
              M0,600 C200,500 600,700 1000,600 L1000,1000 L0,1000 Z;
              M0,600 C400,700 700,500 1000,600 L1000,1000 L0,1000 Z
            " />
        </path>
      </svg>
    </div>
  </div>
);

function App() {
  const [allData, setAllData] = useState(null);
  const [lang, setLang] = useState('es');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    fetch('/data.json').then(res => res.json()).then(setAllData).catch(console.error);
  }, []);

  useEffect(() => {
    if (allData) {
      const fullName = allData[lang].profile.name;
      let i = 0;
      setDisplayName('');
      const timer = setInterval(() => {
        setDisplayName(fullName.substring(0, i + 1));
        i++;
        if (i >= fullName.length) clearInterval(timer);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [allData, lang]);

  if (!allData) return <div style={{textAlign: 'center', padding: '50px', color: 'white'}}>Cargando...</div>;
  const content = allData[lang];

  return (
    <>
      <LiquidBackground />

      <div className="app-wrapper">
        <nav className="navbar">
          <div className="nav-container">
            <select className="lang-select" onChange={(e) => setLang(e.target.value)} value={lang}>
              <option value="es">Español 🇦🇷</option>
              <option value="en">English 🇺🇸</option>
            </select>
          </div>
        </nav>

        <main className="container">
          <header className="hero">
            <h1>{displayName}<span className="cursor">|</span></h1>
            <p className="subtitle">{content.profile.title}</p>
            <p className="summary">{content.profile.summary}</p>
          </header>

          <section>
            <h2 className="section-title">{content.sections.exp}</h2>
            {content.experience.map((exp, i) => (
              <div key={i} className="card">
                <h3>{exp.role} @ {exp.company}</h3>
                <span className="date-tag">{exp.period}</span>
                <p className="description-text">{exp.description}</p>
              </div>
            ))}
          </section>

          <section style={{marginTop: '60px'}}>
            <h2 className="section-title">{content.sections.proj}</h2>
            <div className="grid">
              {content.projects.map((p, i) => (
                <div key={i} className="card project-card" style={{marginTop: '0'}}>
                  <h3>{p.title}</h3>
                  <span className="category-tag">{p.category}</span>
                  <p className="description-text">{p.shortDesc || p.description}</p>
                  <a href={p.link} target="_blank" rel="noreferrer" className="git-link">Ver Código →</a>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;