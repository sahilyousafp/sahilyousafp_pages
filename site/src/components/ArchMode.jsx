import { useEffect, useRef, useState } from 'react';
import { archRooms } from '../data';
import './ArchMode.css';

export default function ArchMode({ onBack }) {
  const sectionRefs = useRef([]);
  const planRef = useRef(null);
  const [activeRoom, setActiveRoom] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
        }
      });
    }, { threshold: 0.12 });

    sectionRefs.current.forEach(s => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const addRef = (el) => { if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el); };

  const scrollToRoom = (idx) => {
    const el = document.getElementById(`room-${idx}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const onScroll = () => {
      let current = 0;
      archRooms.forEach((_, i) => {
        const el = document.getElementById(`room-${i}`);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.6) current = i;
      });
      setActiveRoom(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="arch-mode">
      <header className="arch-header">
        <button className="back-link cursor-target" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> MODES
        </button>
        <div className="arch-contact-mini">
          <a href="mailto:sahil.yousaf@students.iaac.net">sahil.yousaf@students.iaac.net</a>
          <a href="https://www.linkedin.com/in/sahil-yousaf-882a0b132/" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i></a>
        </div>
      </header>

      {/* HERO */}
      <section ref={addRef} className="arch-hero">
        <div className="arch-hero-bg"></div>
        <div className="arch-hero-inner">
          <p className="arch-eyebrow" data-reveal>ARCHITECTURE / DESIGN / VISUALISATION</p>
          <h1 data-reveal>
            SAHIL<br />
            YOUSAF
          </h1>
          <p className="arch-title" data-reveal>Architect & AI Researcher</p>
          <p className="arch-bio" data-reveal>
            Six years of practice across award-winning studios in India, the UAE and global VFX productions.
            Currently completing a Master in AI for Architecture at IAAC, Barcelona.
          </p>
          <div className="arch-hero-cta" data-reveal>
            <a href="#floorplan" className="btn-arch cursor-target">EXPLORE PORTFOLIO</a>
            <a href="mailto:sahil.yousaf@students.iaac.net" className="btn-arch-outline cursor-target">GET IN TOUCH</a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* FLOOR PLAN */}
      <section ref={addRef} id="floorplan" className="floor-plan-section">
        <div className="section-head" data-reveal>
          <span className="section-num">FLOOR PLAN</span>
          <h2>SELECT A ROOM</h2>
        </div>
        <div ref={planRef} className="floor-plan" data-reveal>
          <svg viewBox="0 0 800 600" className="plan-svg">
            <defs>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(61,43,31,0.2)" strokeWidth="1" />
              </pattern>
            </defs>
            {/* outer walls */}
            <rect x="50" y="50" width="700" height="500" fill="none" stroke="#3D2B1F" strokeWidth="3" />
            <rect x="50" y="50" width="700" height="500" fill="url(#hatch)" opacity="0.4" />
            {/* rooms */}
            {archRooms.map((r, i) => {
              const positions = [
                { x: 70, y: 70, w: 320, h: 210 },
                { x: 410, y: 70, w: 320, h: 210 },
                { x: 70, y: 300, w: 320, h: 230 },
                { x: 410, y: 300, w: 320, h: 230 },
                { x: 250, y: 180, w: 120, h: 130 },
                { x: 430, y: 180, w: 120, h: 130 }
              ];
              const p = positions[i] || { x: 70, y: 70, w: 200, h: 150 };
              const isActive = activeRoom === i;
              return (
                <g
                  key={i}
                  className={`plan-room cursor-target ${isActive ? 'active' : ''}`}
                  onClick={() => scrollToRoom(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x={p.x} y={p.y} width={p.w} height={p.h} className="plan-room-rect" />
                  <text x={p.x + p.w / 2} y={p.y + p.h / 2 - 6} textAnchor="middle" className="plan-room-num">{r.num}</text>
                  <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 14} textAnchor="middle" className="plan-room-title">
                    {r.title.replace(/<em>|<\/em>/g, '').toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* ROOMS */}
      {archRooms.map((r, i) => (
        <section ref={addRef} key={i} id={`room-${i}`} className="room-section">
          <div className="room-grid">
            <div className="room-media" data-reveal>
              <img src={r.img} alt={r.title.replace(/<em>|<\/em>/g, '')} loading="lazy" />
              <span className="room-num">{r.num}</span>
            </div>
            <div className="room-text" data-reveal data-reveal-delay="1">
              <span className="room-meta">{r.meta}</span>
              <h2 dangerouslySetInnerHTML={{ __html: r.title }}></h2>
              <p>{r.desc}</p>
              <div className="room-nav">
                {i > 0 && <button onClick={() => scrollToRoom(i - 1)} className="cursor-target">← PREV</button>}
                {i < archRooms.length - 1 && <button onClick={() => scrollToRoom(i + 1)} className="cursor-target">NEXT →</button>}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <footer className="arch-footer">
        <div className="arch-footer-left">
          <h3>SAHIL YOUSAF</h3>
          <p>Architect & AI Researcher</p>
        </div>
        <div className="arch-footer-right">
          <a href="mailto:sahil.yousaf@students.iaac.net" className="cursor-target">sahil.yousaf@students.iaac.net</a>
          <a href="https://www.linkedin.com/in/sahil-yousaf-882a0b132/" target="_blank" rel="noreferrer" className="cursor-target">LinkedIn</a>
          <a href="https://github.com/sahilyousafp" target="_blank" rel="noreferrer" className="cursor-target">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
