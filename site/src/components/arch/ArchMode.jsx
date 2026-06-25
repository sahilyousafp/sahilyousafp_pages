import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { archCompanies } from '../../data';
import { SceneContent } from './scene';
import './ArchMode.css';

const base = import.meta.env.BASE_URL;
const imgUrl = (path) => `${base}${path.replace(/^\//, '')}`;

const LOOK_TARGET = new THREE.Vector3(0, 0, 0);

function getScale() {
  const w = window.innerWidth;
  if (w <= 480) return 1.8;
  if (w <= 768) return 1.45;
  if (w <= 1024) return 1.2;
  return 1;
}

function CameraRig({ scrollT }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const s = getScale();
    const planPos = new THREE.Vector3(0, 3.5 * s, 0.001);
    const isoPos = new THREE.Vector3(1.5 * s, 1.8 * s, 1.5 * s);
    const orbitRadius = Math.sqrt(isoPos.x ** 2 + isoPos.z ** 2);
    const startAngle = Math.atan2(isoPos.x, isoPos.z);
    const t = scrollT.current;

    if (t <= 1) {
      targetPos.lerpVectors(planPos, isoPos, t);
    } else {
      const rotT = Math.min(t - 1, 1);
      const angle = startAngle + rotT * Math.PI;
      targetPos.set(
        Math.sin(angle) * orbitRadius,
        isoPos.y,
        Math.cos(angle) * orbitRadius
      );
    }

    camera.position.lerp(targetPos, 0.08);
    camera.lookAt(LOOK_TARGET);
  });

  return null;
}

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=)([^&\s]+)/);
  return m ? m[1] : null;
}

function ProjectDetail({ project, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = project.imgs || [];
  const videoId = getYouTubeId(project.video);
  const hasImages = imgs.length > 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (hasImages && e.key === 'ArrowRight' && imgIdx < imgs.length - 1) setImgIdx(i => i + 1);
      if (hasImages && e.key === 'ArrowLeft' && imgIdx > 0) setImgIdx(i => i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [imgIdx, imgs.length, onClose, hasImages]);

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div className="detail-card" onClick={e => e.stopPropagation()}>
        <button className="detail-close cursor-target" onClick={onClose}>&times;</button>
        <div className="detail-gallery">
          {videoId && (
            <iframe
              className="detail-video"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {hasImages && (
            <>
              <img src={imgUrl(imgs[imgIdx])} alt="" className="detail-img" />
              {imgs.length > 1 && (
                <div className="detail-gallery-nav">
                  <button className="detail-arrow cursor-target" onClick={() => setImgIdx(i => i - 1)} disabled={imgIdx === 0}>&#8592;</button>
                  <span className="detail-counter">{imgIdx + 1} / {imgs.length}</span>
                  <button className="detail-arrow cursor-target" onClick={() => setImgIdx(i => i + 1)} disabled={imgIdx === imgs.length - 1}>&#8594;</button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="detail-info">
          <span className="detail-num">{project.num}</span>
          <h3 dangerouslySetInnerHTML={{ __html: project.title }} />
          <span className="detail-meta">{project.meta}</span>
          <p className="detail-desc">{project.desc}</p>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="detail-link cursor-target">
              View on DNEG &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function OverlayCarousel({ company, onClose }) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !detail) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, detail]);

  if (!company) return null;
  const hasProjects = company.projects.length > 0;

  return (
    <>
      <div className="panel-backdrop" onClick={onClose}>
        <div className="panel-drawer" onClick={e => e.stopPropagation()}>
          <button className="panel-close cursor-target" onClick={onClose}>&times;</button>

          <div className="panel-header">
            <div className="panel-header-left">
              <span className="panel-period">{company.period}</span>
              <h2>{company.name}</h2>
            </div>
            <div className="panel-header-right">
              <span className="panel-role">{company.role}</span>
              <span className="panel-loc">{company.location}</span>
            </div>
          </div>

          {hasProjects && (
            <div className="panel-track">
              {company.projects.map((p, pi) => {
                const vid = getYouTubeId(p.video);
                const hasCover = p.imgs && p.imgs.length > 0;

                if (vid) {
                  return (
                    <div key={pi} className="panel-video-card">
                      <iframe
                        className="panel-video"
                        src={`https://www.youtube.com/embed/${vid}?rel=0`}
                        title={p.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="panel-video-info">
                        <span className="panel-cover-num">{p.num}</span>
                        <span className="panel-cover-title" dangerouslySetInnerHTML={{ __html: p.title }} />
                        <p className="panel-video-desc">{p.desc}</p>
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noopener noreferrer" className="detail-link cursor-target">
                            View on DNEG &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={pi} className="panel-cover cursor-target" onClick={() => setDetail(p)}>
                    {hasCover && <img src={imgUrl(p.imgs[0])} alt="" />}
                    {!hasCover && <div className="panel-cover-placeholder" />}
                    <div className="panel-cover-label">
                      <span className="panel-cover-num">{p.num}</span>
                      <span className="panel-cover-title" dangerouslySetInnerHTML={{ __html: p.title }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!hasProjects && (
            <div className="panel-empty"><span>PROJECT DETAILS COMING SOON</span></div>
          )}
        </div>
      </div>

      {detail && <ProjectDetail project={detail} onClose={() => setDetail(null)} />}
    </>
  );
}

export default function ArchMode({ onBack }) {
  const [active, setActive] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const scrollT = useRef(0);

  const company = archCompanies.find(c => c.id === active);

  const handleHover = useCallback((id, cx, cy) => {
    if (id) {
      const c = archCompanies.find(co => co.id === id);
      setTooltip({ name: c?.name || id, x: cx, y: cy });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleClick = useCallback((id) => {
    setActive(prev => prev === id ? null : id);
  }, []);

  const touchRef = useRef({ active: false, lastY: 0 });

  useEffect(() => {
    const onWheel = (e) => {
      if (active) return;
      e.preventDefault();
      scrollT.current = Math.max(0, Math.min(2, scrollT.current + e.deltaY * 0.0008));
    };

    const onTouchStart = (e) => {
      if (active) return;
      touchRef.current = { active: true, lastY: e.touches[0].clientY };
    };

    const onTouchMove = (e) => {
      if (!touchRef.current.active || active) return;
      const y = e.touches[0].clientY;
      const dy = touchRef.current.lastY - y;
      touchRef.current.lastY = y;
      scrollT.current = Math.max(0, Math.min(2, scrollT.current + dy * 0.003));
      if (Math.abs(dy) > 2 && e.cancelable) e.preventDefault();
    };

    const onTouchEnd = () => {
      touchRef.current.active = false;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [active]);

  const hintText = scrollT.current <= 0.1
    ? 'SCROLL TO EXPLORE'
    : 'SCROLL TO ROTATE · CLICK A BUILDING';

  return (
    <div className="arch-mode">
      <header className="arch-header">
        <button className="back-link cursor-target" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> MODES
        </button>
        <div className="arch-header-title">COLONY</div>
        <div className="arch-contact-mini">
          <a href="mailto:sahilyousafp@gmail.com" className="cursor-target">sahilyousafp@gmail.com</a>
          <a href="https://www.linkedin.com/in/sahil-yousaf-882a0b132/" target="_blank" rel="noreferrer" className="cursor-target">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </header>

      <Canvas
        className="colony-canvas"
        camera={{ fov: 45, near: 0.01, far: 200, position: [0, 3.5 * getScale(), 0.001] }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-camera-near={0.1}
          shadow-camera-far={20}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-2, 3, -1]} intensity={0.4} />
        <hemisphereLight args={['#ddeeff', '#f0ebe1', 0.3]} />
        <CameraRig scrollT={scrollT} />
        <SceneContent onHover={handleHover} onClick={handleClick} />
      </Canvas>

      {tooltip && (
        <div className="city-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.name}
        </div>
      )}

      {active && <OverlayCarousel company={company} onClose={() => setActive(null)} />}

      <div className={`colony-hint ${active ? 'hidden' : ''}`}>
        <span>SCROLL TO EXPLORE &nbsp;&bull;&nbsp; CLICK A BUILDING</span>
      </div>
    </div>
  );
}
