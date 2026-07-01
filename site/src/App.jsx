import { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import BlobCursor from './components/shared/BlobCursor';
import CodeMode from './components/code/CodeMode';
import ArchMode from './components/arch/ArchMode';
import EdgeModeSwitch from './components/shared/EdgeModeSwitch';
import './App.css';

function ModeLanding({ onSelect, onHoverSide }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      onHoverSide(x < 0.5 ? 'code' : 'arch');
    };

    const onLeave = () => onHoverSide(null);

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [onHoverSide]);

  return (
    <div ref={containerRef} className="mode-landing">
      {/* LEFT: CODE MODE */}
      <div
        className="mode-half mode-code cursor-target"
        onClick={() => onSelect('code')}
      >
        <div className="mode-bg-code"></div>

        <div className="mode-content">
          <div className="mode-header-left">
            <span className="logo">SY</span>
            <span className="mode-eyebrow">CODER</span>
          </div>

          <div className="mode-main">
            <h1>
              <span>SPATIAL</span>
              <span>ENGINEER</span>
            </h1>
            <p className="mode-subtitle">Computational intelligence for spatial systems</p>
            <p className="mode-desc">
              LLM agents · Graph neural networks · Structural analysis tools · Geospatial AI
            </p>
            <div className="mode-stats">
              <div><span className="stat-num">6</span> <span className="stat-label">Projects</span></div>
              <div><span className="stat-num">1</span> <span className="stat-label">Publication</span></div>
              <div><span className="stat-num">8</span> <span className="stat-label">Blogs</span></div>
            </div>
          </div>

          <div className="mode-footer-left">
            <span>BARCELONA / DELHI</span>
            <span>OPEN TO WORK</span>
          </div>
        </div>

        <div className="mode-accent-line"></div>
      </div>

      {/* DIVIDER */}
      <div className="mode-divider"></div>

      {/* RIGHT: ARCHITECTURE MODE */}
      <div
        className="mode-half mode-arch cursor-target"
        onClick={() => onSelect('arch')}
      >
        <div className="mode-bg-arch"></div>

        <div className="mode-content">
          <div className="mode-header-right">
            <span className="mode-eyebrow">ARCHITECT</span>
          </div>

          <div className="mode-main">
            <h1>
              <span>SAHIL</span>
              <span>YOUSAF</span>
            </h1>
            <p className="mode-subtitle">Architect & AI Researcher</p>
            <p className="mode-desc">
              3 years across award-winning studios: Morphogenesis, DNEG, SHAPE. Masters at IAAC Barcelona.
            </p>
          </div>

          <div className="mode-footer-right">
            <span>IAAC Barcelona</span>
          </div>
        </div>

        <div className="mode-accent-line"></div>
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
  const [hoverSide, setHoverSide] = useState(null);
  const [edgeActive, setEdgeActive] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (path === 'code' || path === 'arch') setMode(path);

    const onPopState = () => {
      const p = window.location.pathname.replace('/', '');
      if (p === 'code' || p === 'arch') setMode(p);
      else setMode(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (mode) {
      history.pushState(null, '', `/${mode}`);
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto';
    } else {
      history.replaceState(null, '', '/');
      document.body.style.overflow = '';
    }
  }, [mode]);

  const blobColor = mode === 'arch'
    ? '#C75B3A'
    : mode === 'code'
      ? '#00F0FF'
      : hoverSide === 'code'
        ? '#00F0FF'
        : hoverSide === 'arch'
          ? '#C75B3A'
          : '#ffffff';

  const blobInner = mode === 'arch'
    ? 'rgba(255,235,220,0.8)'
    : mode === 'code'
      ? 'rgba(255,255,255,0.8)'
      : hoverSide === 'code'
        ? 'rgba(255,255,255,0.8)'
        : hoverSide === 'arch'
          ? 'rgba(255,235,220,0.8)'
          : 'rgba(200,200,200,0.8)';

  return (
    <div ref={appRef} className={`app ${mode || 'landing'}`}>
      <Loader done={loaded} />
      {mode === null ? (
        <ModeLanding onSelect={setMode} onHoverSide={setHoverSide} />
      ) : mode === 'code' ? (
        <CodeMode onBack={() => setMode(null)} />
      ) : (
        <ArchMode onBack={() => setMode(null)} />
      )}
      {mode && <EdgeModeSwitch mode={mode} onSwitch={() => setMode(mode === 'code' ? 'arch' : 'code')} onEdgeActive={setEdgeActive} />}
      <BlobCursor
        blobType="circle"
        fillColor={blobColor}
        hidden={edgeActive}
        trailCount={3}
        sizes={[40, 80, 55]}
        innerSizes={[12, 22, 16]}
        innerColor={blobInner}
        opacities={[0.6, 0.5, 0.4]}
        shadowColor="rgba(0,0,0,0.15)"
        shadowBlur={2}
        shadowOffsetX={0}
        shadowOffsetY={0}
        filterStdDeviation={12}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={9999}
      />
      <Analytics />
    </div>
  );
}
