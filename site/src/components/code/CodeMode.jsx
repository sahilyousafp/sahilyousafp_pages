import { useEffect, useRef, useState } from 'react';
import CodeGraph from './CodeGraph';
import { codeProjects, publications, blogs, codeExp } from '../../data';
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
          <button onClick={() => scrollTo('code-publications')}>PUBLICATIONS</button>
          <button onClick={() => scrollTo('code-blogs')}>BLOGS</button>
          <button onClick={() => scrollTo('code-exp')}>EXPERIENCE</button>
          <button onClick={() => scrollTo('code-contact')}>CONTACT</button>
          <a href="https://github.com/sahilyousafp" target="_blank" rel="noreferrer" className="code-nav-github"><i className="fab fa-github"></i></a>
        </nav>
      </header>

      {/* HERO with Graph Background */}
      <section ref={addRef} className="code-hero">
        <div className="code-graph-wrap">
          <CodeGraph onNodeHover={setHoverGraph} onNodeClick={scrollTo} />
        </div>
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

      {/* PUBLICATIONS */}
      <section ref={addRef} id="code-publications" className="code-section alt">
        <div className="section-head" data-reveal>
          <span className="section-num">02</span>
          <h2>PUBLICATIONS</h2>
        </div>
        <div className="publications-list">
          {publications.map((p, i) => (
            <a key={i} href={p.u} target="_blank" rel="noreferrer" className="publication-card cursor-target" data-reveal data-reveal-delay={i + 1}>
              <div className="pub-header">
                <span className="pub-conference">{p.conf}</span>
                <span className="pub-date">{p.d}</span>
              </div>
              <h3>{p.t}</h3>
              <p className="pub-subtitle">{p.c}</p>
              <p className="pub-desc">{p.desc}</p>
              <div className="pub-footer">
                <span className="read-more">Read the paper <i className="fas fa-arrow-right"></i></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* BLOGS */}
      <section ref={addRef} id="code-blogs" className="code-section">
        <div className="section-head" data-reveal>
          <span className="section-num">03</span>
          <h2>BLOGS & WRITING</h2>
        </div>
        <div className="blog-carousel" data-reveal>
          <div className="blog-carousel-track">
            {blogs.map((p, i) => (
              <a key={i} href={p.u} target="_blank" rel="noreferrer" className="blog-card cursor-target">
                <div className="blog-card-img" style={{ backgroundImage: `url(${p.img})` }}></div>
                <div className="blog-card-body">
                  <span className="blog-card-cat">{p.c}</span>
                  <h3 className="blog-card-title">{p.t}</h3>
                  <span className="blog-card-date">{p.d}</span>
                  <span className="blog-card-read">Read on IAAC <i className="fas fa-arrow-right"></i></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section ref={addRef} id="code-exp" className="code-section alt">
        <div className="section-head" data-reveal>
          <span className="section-num">04</span>
          <h2>EXPERIENCE & PATH</h2>
        </div>
        <div className="exp-list">
          {codeExp.map((e, i) => {
            const Row = e.link ? 'a' : 'div';
            return (
              <Row key={i} className="exp-row cursor-target" href={e.link || undefined} target={e.link ? '_blank' : undefined} rel={e.link ? 'noreferrer' : undefined} data-reveal data-reveal-delay={(i % 2) + 1}>
                <span className="exp-type">{e.type}</span>
                <span className="exp-date">{e.date}</span>
                <div className="exp-info">
                  <h4>{e.role}</h4>
                  <p>{e.desc}</p>
                </div>
              </Row>
            );
          })}
        </div>
      </section>

      {/* SKILLS */}
      <section ref={addRef} id="code-skills" className="code-section">
        <div className="section-head" data-reveal>
          <span className="section-num">05</span>
          <h2>TOOLING</h2>
        </div>
        <div className="skills-cloud" data-reveal>
          {['Python','TensorFlow','PyTorch','React','Three.js','Node.js','Grasshopper','Rhino 3D','Blender','Unity','OpenCV','LLM Agents','Graph Neural Networks','Reinforcement Learning','SQL','Docker','Git','Pandas'].map((s, i) => (
            <span key={i} className="skill-pill cursor-target">{s}</span>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section ref={addRef} id="code-contact" className="code-section alt">
        <div className="section-head" data-reveal>
          <span className="section-num">06</span>
          <h2>LET'S BUILD</h2>
        </div>
        <div className="contact-grid" data-reveal>
          <a href="mailto:sahil.yousaf@students.iaac.net" className="contact-big cursor-target">
            <span>EMAIL</span>
            sahil.yousaf@students.iaac.net
          </a>
          <a href="https://www.linkedin.com/in/sahil-yousaf-882a0b132/" target="_blank" rel="noreferrer" className="contact-big cursor-target">
            <span>LINKEDIN</span>
            City Layers · IaaC
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
