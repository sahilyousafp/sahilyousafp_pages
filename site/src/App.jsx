import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import TargetCursor from './components/TargetCursor';
import CodeMode from './components/CodeMode';
import ArchMode from './components/ArchMode';
import './App.css';

function ModeLanding({ onSelect }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const tilt = (x - 0.5) * 8;
      gsap.to(container, { '--tilt': `${tilt}deg`, duration: 0.5, ease: 'power2.out' });
    };

    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={containerRef} className="mode-landing">
      <div className="mode-bg-code"></div>
      <div className="mode-bg-arch"></div>
      <div className="mode-divider"></div>

      <div className="mode-top">
        <span className="logo">SY</span>
        <span className="mode-eyebrow">PORTFOLIO 2025</span>
      </div>

      <h1 className="mode-title">
        <span className="mode-left">ARCHITECT</span>
        <span className="mode-right">AI BUILDER</span>
      </h1>

      <div className="mode-cards">
        <button className="mode-card cursor-target code" onClick={() => onSelect('code')}>
          <span className="mc-label">MODE</span>
          <span className="mc-name">CODE</span>
          <span className="mc-desc">Interactive graph · GitHub projects · AI research</span>
          <span className="mc-arrow"><i className="fas fa-arrow-right"></i></span>
        </button>
        <button className="mode-card cursor-target arch" onClick={() => onSelect('arch')}>
          <span className="mc-label">MODE</span>
          <span className="mc-name">ARCHITECTURE</span>
          <span className="mc-desc">Floor plan · 3D scroll · Built work</span>
          <span className="mc-arrow"><i className="fas fa-arrow-right"></i></span>
        </button>
      </div>

      <div className="mode-bottom">
        <span>SAHIL YOUSAF</span>
        <span>BARCELONA · DELHI</span>
      </div>
    </div>
  );
}

function Loader({ done }) {
  return (
    <div className={`loader ${done ? 'done' : ''}`}>
      <div className="loader-text">INITIALISING PORTFOLIO_</div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (mode) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto';
    }
  }, [mode]);

  const cursorColor = mode === 'code' ? '#ffffff' : '#3D2B1F';
  const cursorColorOnTarget = mode === 'code' ? '#FF3300' : '#C75B3A';

  return (
    <div ref={appRef} className={`app ${mode || 'landing'}`}>
      <Loader done={loaded} />
      {mode === null ? (
        <ModeLanding onSelect={setMode} />
      ) : mode === 'code' ? (
        <CodeMode onBack={() => setMode(null)} />
      ) : (
        <ArchMode onBack={() => setMode(null)} />
      )}
      <TargetCursor
        targetSelector=".cursor-target"
        cursorColor={cursorColor}
        cursorColorOnTarget={cursorColorOnTarget}
        spinDuration={3}
        hideDefaultCursor={true}
      />
    </div>
  );
}
