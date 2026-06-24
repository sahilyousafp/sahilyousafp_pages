import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import CodeGraph from './CodeGraph';
import { codeProjects, posts, codeExp } from '../data';
import './CodeMode.css';

export default function CodeMode({ onBack }) {
  const sectionRefs = useRef([]);
  const [hoverGraph, setHoverGraph] = useState(false);

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

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="code-mode">
      <header className="code-header">
        <button className="back-link cursor-target" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> MODES
        </button>
        <nav className="code-nav">
          <button onClick={() => scrollTo('code-work')}>WORK</button>
          <button onClick={() => scrollTo('code-research')}>RESEARCH</button>
          <button onClick={() => scrollTo('code-exp')}>EXPERIENCE</button>
          <button onClick={() => scrollTo('code-contact')}>CONTACT</button>
        </nav>
      </header>

      {/* HERO */}
      <section ref={addRef} className="code-hero">
        <div className="code-graph-wrap">
          <CodeGraph onNodeHover={setHoverGraph} />
        </div>
        <div className="code-hero-content">
          <p className="eyebrow" data-reveal>CODING / AI / TOOLS</p>
          <h1 data-reveal>
            <span className="line1">ARCHITECT</span>
            <span className="line2">TURNED <em>AI BUILDER</em></span>
          </h1>
          <p className="hero-sub" data-reveal>
            I design and deploy computational systems for the built environment —<br />
            from LLM agents and graph neural networks to structural analysis tools.
          </p>
          <div className="hero-actions" data-reveal>
            <a href="#code-work" className="btn-primary cursor-target">VIEW PROJECTS</a>
            <a href="https://github.com/sahilyousafp" target="_blank" rel="noreferrer" className="btn-ghost cursor-target">
              <i className="fab fa-github"></i> GITHUB
            </a>
          </div>
        </div>
        <div className="hero-meta">
          <span>BARCELONA / DELHI</span>
          <span>OPEN TO WORK</span>
        </div>
        {!hoverGraph && (
          <div className="graph-hint">
            <i className="fas fa-mouse"></i> HOVER & CLICK THE GRAPH
          </div>
        )}
      </section>

      {/* MARQUEE */}
      <div className="code-marquee">
        <div className="marquee-track">
          {Array(4).fill(['PYTHON', 'LLMS', 'GRAPH NETWORKS', 'REACT', 'GRASSHOPPER', 'SIMULATION', 'OPENCV']).flat().map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* WORK */}
      <section ref={addRef} id="code-work" className="code-section">
        <div className="section-head" data-reveal>
          <span className="section-num">01</span>
          <h2>SELECTED PROJECTS</h2>
        </div>
        <div className="code-projects">
          {codeProjects.map((p, i) => (
            <a key={i} href={p.link} className="code-card cursor-target" data-reveal data-reveal-delay={(i % 3) + 1}>
              <div className="cc-img" style={{ backgroundImage: `url(${p.img})` }}></div>
              <div className="cc-body">
                <h3>{p.title}</h3>
                <p className="cc-tags">{p.tags}</p>
                <p className="cc-desc">{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* RESEARCH */}
      <section ref={addRef} id="code-research" className="code-section alt">
        <div className="section-head" data-reveal>
          <span className="section-num">02</span>
          <h2>RESEARCH & WRITING</h2>
        </div>
        <div className="research-grid">
          <div className="research-feature" data-reveal>
            <span className="pub-tag cursor-target">ANNSIM 2025 PUBLICATION</span>
            <h3>Building Analysis Tool (B.A.T.)</h3>
            <p>AI accessibility analyser for healthcare architecture, published by the Society for Modelling & Simulation International.</p>
            <a href="project-bat.html" className="link-arrow cursor-target">Read the paper <i className="fas fa-arrow-right"></i></a>
          </div>
          <div className="posts-list">
            {posts.map((p, i) => (
              <a key={i} href={p.u} target="_blank" rel="noreferrer" className="post-row cursor-target" data-reveal data-reveal-delay={(i % 2) + 1}>
                <span className="post-date">{p.d}</span>
                <span className="post-title">{p.t}</span>
                <span className="post-cat">{p.c}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section ref={addRef} id="code-exp" className="code-section">
        <div className="section-head" data-reveal>
          <span className="section-num">03</span>
          <h2>EXPERIENCE & PATH</h2>
        </div>
        <div className="exp-list">
          {codeExp.map((e, i) => (
            <div key={i} className="exp-row" data-reveal data-reveal-delay={(i % 2) + 1}>
              <span className="exp-type">{e.type}</span>
              <span className="exp-date">{e.date}</span>
              <div className="exp-info">
                <h4>{e.role}</h4>
                <p>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section ref={addRef} id="code-skills" className="code-section alt">
        <div className="section-head" data-reveal>
          <span className="section-num">04</span>
          <h2>TOOLING</h2>
        </div>
        <div className="skills-cloud" data-reveal>
          {['Python','TensorFlow','PyTorch','React','Three.js','Node.js','Grasshopper','Rhino 3D','Blender','Unity','OpenCV','LLM Agents','Graph Neural Networks','Reinforcement Learning','SQL','Docker','Git','Pandas'].map((s, i) => (
            <span key={i} className="skill-pill cursor-target">{s}</span>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section ref={addRef} id="code-contact" className="code-section">
        <div className="section-head" data-reveal>
          <span className="section-num">05</span>
          <h2>LET'S BUILD</h2>
        </div>
        <div className="contact-grid" data-reveal>
          <a href="mailto:sahil.yousaf@students.iaac.net" className="contact-big cursor-target">
            <span>EMAIL</span>
            sahil.yousaf@students.iaac.net
          </a>
          <a href="https://www.linkedin.com/in/sahil-yousaf-882a0b132/" target="_blank" rel="noreferrer" className="contact-big cursor-target">
            <span>LINKEDIN</span>
            /in/sahil-yousaf-882a0b132
          </a>
          <a href="https://github.com/sahilyousafp" target="_blank" rel="noreferrer" className="contact-big cursor-target">
            <span>GITHUB</span>
            @sahilyousafp
          </a>
        </div>
      </section>

      <footer className="code-footer">
        <span>© {new Date().getFullYear()} SAHIL YOUSAF</span>
        <span>BUILT WITH REACT + VITE</span>
      </footer>
    </div>
  );
}
