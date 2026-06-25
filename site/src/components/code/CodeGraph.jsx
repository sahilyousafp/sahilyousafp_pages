import { useEffect, useRef, useState, useCallback } from 'react';
import './CodeGraph.css';

const CAT_COLORS = {
  center: '#FF3300', projects: '#00F0FF', publications: '#FFB800',
  blogs: '#00FF88', experience: '#B388FF', tooling: '#448AFF', contact: '#F4F4F0',
};

const INIT_NODES = [
  { id: 'center', label: 'Sahil Yousaf', sub: 'Architect | AI Researcher', icon: 'local_florist', type: 'center', cat: 'center', x: 50, y: 50, parent: null },
  { id: 'projects', label: 'Selected Projects', icon: 'code', type: 'branch', cat: 'projects', x: 30, y: 30, parent: 'center', scrollTo: 'code-work' },
  { id: 'bat', label: 'B.A.T.', icon: 'visibility', type: 'sub', cat: 'projects', x: 18, y: 20, parent: 'projects', line: 'dashed', link: '/sahilyousafp_pages/project-bat.html' },
  { id: 'grounded', label: 'Grounded', icon: 'architecture', type: 'sub', cat: 'projects', x: 14, y: 36, parent: 'projects', line: 'dashed', link: '/sahilyousafp_pages/project-structural.html' },
  { id: 'llm', label: 'LLM Urbanism', icon: 'smart_toy', type: 'sub', cat: 'projects', x: 22, y: 14, parent: 'projects', line: 'dashed', link: '/sahilyousafp_pages/project-llm-urbanism.html' },
  { id: 'pardaz', label: 'Pardaz', icon: 'directions_walk', type: 'sub', cat: 'projects', x: 38, y: 18, parent: 'projects', line: 'dashed', link: '/sahilyousafp_pages/project-pardaz.html' },
  { id: 'zono', label: 'ZONO_NAUTS', icon: 'terminal', type: 'sub', cat: 'projects', x: 12, y: 28, parent: 'projects', line: 'dashed', link: '/sahilyousafp_pages/project-hackathon.html' },
  { id: 'ai4all', label: 'AI4ALL', icon: 'satellite_alt', type: 'sub', cat: 'projects', x: 28, y: 12, parent: 'projects', line: 'dashed', link: '/sahilyousafp_pages/project-ai4all.html' },
  { id: 'publications', label: 'Publications', icon: 'menu_book', type: 'branch', cat: 'publications', x: 68, y: 30, parent: 'center', scrollTo: 'code-publications' },
  { id: 'annsim', label: 'ANNSIM 2025', icon: 'school', type: 'sub', cat: 'publications', x: 80, y: 22, parent: 'publications', line: 'dashed', link: '/sahilyousafp_pages/project-bat.html' },
  { id: 'blogs', label: 'Blogs & Writing', icon: 'edit_note', type: 'branch', cat: 'blogs', x: 74, y: 54, parent: 'center', scrollTo: 'code-blogs' },
  { id: 'iaac_blog', label: 'IAAC Blog', icon: 'rss_feed', type: 'sub', cat: 'blogs', x: 84, y: 48, parent: 'blogs', line: 'dashed', link: 'https://blog.iaac.net/user/sahilyousafp/' },
  { id: 'experience', label: 'Experience', icon: 'timeline', type: 'branch', cat: 'experience', x: 60, y: 72, parent: 'center', scrollTo: 'code-exp' },
  { id: 'iaac', label: 'IAAC Barcelona', icon: 'school', type: 'sub', cat: 'experience', x: 70, y: 82, parent: 'experience', line: 'dashed', scrollTo: 'code-exp' },
  { id: 'morph', label: 'Morphogenesis', icon: 'apartment', type: 'sub', cat: 'experience', x: 52, y: 84, parent: 'experience', line: 'dashed', scrollTo: 'code-exp' },
  { id: 'tooling', label: 'Tooling', icon: 'build', type: 'branch', cat: 'tooling', x: 30, y: 68, parent: 'center', scrollTo: 'code-skills' },
  { id: 'python', label: 'Python / ML', icon: 'data_object', type: 'sub', cat: 'tooling', x: 18, y: 62, parent: 'tooling', line: 'dashed', scrollTo: 'code-skills' },
  { id: 'react', label: 'React / Web', icon: 'language', type: 'sub', cat: 'tooling', x: 20, y: 76, parent: 'tooling', line: 'dashed', scrollTo: 'code-skills' },
  { id: 'contact', label: 'Contact', icon: 'mail', type: 'branch', cat: 'contact', x: 50, y: 30, parent: 'center', scrollTo: 'code-contact' },
];

const DETAILS = {
  projects: { title: 'Selected Projects', text: 'Computational tools across structural analysis, urban simulation, pedestrian modelling, and participatory platforms.' },
  bat: { title: 'Building Analysis Tool', text: 'AI accessibility analyser for healthcare architecture — graph-based navigation, image segmentation, and RAG recommendations. Published at ANNSIM 2025.' },
  grounded: { title: 'Grounded: Structural Solutions', text: 'Upload any 3D model — segments walls, floors and roofs, generates a structural grid, and runs finite element analysis via PyNite.' },
  llm: { title: 'LLM Urbanism', text: '500 autonomous LLM-powered agents navigate Barcelona\'s Eixample, each reasoning in natural language about where to go next.' },
  pardaz: { title: 'Pardaz', text: 'Pedestrian simulation platform for validating exhibition layouts. Architects annotate floor plans and receive heatmaps and centrality analysis.' },
  zono: { title: 'ZONO_NAUTS', text: 'AEC TECH Hackathon 2025 at BIG Barcelona — GNN urban growth prediction voxelised into a Minecraft-style city.' },
  ai4all: { title: 'AI4ALL Decision', text: 'Participatory land-cover visualisation platform — 23 years of satellite data made accessible to citizens and planners.' },
  publications: { title: 'Publications', text: 'Peer-reviewed research published at the ANNSIM 2025 conference by the Society for Modelling & Simulation International.' },
  annsim: { title: 'ANNSIM 2025', text: 'B.A.T.: Designing for the Visually Impaired — Enhancing Accessibility in Healthcare Architecture. Published July 2025.' },
  blogs: { title: 'Blogs & Writing', text: 'Nine published writings on the IAAC blog covering AI theory, robotic fabrication, design communication, and research studios.' },
  iaac_blog: { title: 'IAAC Blog', text: 'Research posts on large-scale 3D printing, structural tools, reinforcement learning, and AI-driven inclusive design.' },
  experience: { title: 'Experience & Path', text: 'From Morphogenesis and SHAPE to DNEG and IAAC Barcelona — bridging architectural practice with computational research.' },
  iaac: { title: 'IAAC Barcelona', text: 'Master in AI for Architecture & the Built Environment — Institute for Advanced Architecture of Catalonia, 2024–25.' },
  morph: { title: 'Morphogenesis', text: 'Sustainable, award-winning parametric and bioclimatic architecture practice in Delhi, 2022–24.' },
  tooling: { title: 'Tooling', text: 'Python, TensorFlow, PyTorch, React, Three.js, Grasshopper, Rhino 3D, OpenCV, LLM Agents, Graph Neural Networks, Docker, Git.' },
  python: { title: 'Python / ML', text: 'Primary language for AI research — TensorFlow, PyTorch, Mesa ABM, DuckDB spatial, NetworkX graph analysis.' },
  react: { title: 'React / Web', text: 'Frontend development with React, Vite, Leaflet.js, Three.js, Canvas API, and Tailwind CSS.' },
  contact: { title: 'Contact', text: 'Open to roles, research collaborations, and consulting worldwide. Email, LinkedIn, or GitHub.' },
};

const DEFAULT_CARD = {
  title: null,
  text: 'Architect and AI developer investigating the convergence of computational geometry, machine learning, and architectural structural analysis.',
};

const REPULSION = 4000;
const SPRING_K = 0.008;
const SPRING_REST_BRANCH = 160;
const SPRING_REST_SUB = 110;
const MIN_DIST = 90;
const DAMPING = 0.85;
const CENTER_GRAVITY = 0.0003;

export default function CodeGraph({ onNodeHover, onNodeClick }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const rafRef = useRef(null);
  const [cardContent, setCardContent] = useState(DEFAULT_CARD);
  const hoveredRef = useRef(null);

  const simRef = useRef(null);
  const dragRef = useRef({ active: false, nodeId: null, isPan: false, startX: 0, startY: 0, moved: false });

  const initSim = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    simRef.current = INIT_NODES.map(n => ({
      ...n,
      px: n.x / 100 * w,
      py: n.y / 100 * h,
      vx: 0, vy: 0,
    }));
  }, []);

  useEffect(() => {
    initSim();
    window.addEventListener('resize', initSim);
    return () => window.removeEventListener('resize', initSim);
  }, [initSim]);

  const drawLines = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const sim = simRef.current;
    if (!canvas || !container || !sim) return;
    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lookup = {};
    sim.forEach(n => { lookup[n.id] = n; });

    sim.forEach(node => {
      if (!node.parent) return;
      const p = lookup[node.parent];
      if (!p) return;
      ctx.beginPath();
      ctx.moveTo(node.px, node.py);
      ctx.lineTo(p.px, p.py);
      ctx.strokeStyle = CAT_COLORS[node.cat] || '#FF3300';
      ctx.lineWidth = 1;
      ctx.globalAlpha = node.line === 'dashed' ? 0.25 : 0.4;
      ctx.setLineDash(node.line === 'dashed' ? [4, 4] : []);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onDown = (e) => {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const sim = simRef.current;
      if (!sim) return;

      let hit = null;
      for (let i = sim.length - 1; i >= 0; i--) {
        const dx = sim[i].px - mx;
        const dy = sim[i].py - my;
        if (Math.sqrt(dx * dx + dy * dy) < 45) { hit = sim[i]; break; }
      }

      if (hit) {
        dragRef.current = { active: true, nodeId: hit.id, isPan: false, startX: mx, startY: my, moved: false };
      } else {
        dragRef.current = { active: true, nodeId: null, isPan: true, startX: mx, startY: my, moved: false };
      }
    };

    const onMove = (e) => {
      const d = dragRef.current;
      if (!d.active) return;
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const ddx = mx - d.startX;
      const ddy = my - d.startY;
      if (Math.abs(ddx) > 3 || Math.abs(ddy) > 3) d.moved = true;

      const sim = simRef.current;
      if (!sim) return;

      if (d.isPan) {
        sim.forEach(n => { n.px += ddx; n.py += ddy; n.vx = 0; n.vy = 0; });
        d.startX = mx;
        d.startY = my;
      } else if (d.nodeId) {
        const node = sim.find(n => n.id === d.nodeId);
        if (node) { node.px = mx; node.py = my; node.vx = 0; node.vy = 0; }
      }
    };

    const onUp = () => {
      dragRef.current.active = false;
    };

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    const animate = () => {
      const sim = simRef.current;
      const cont = containerRef.current;
      if (!sim || !cont) { rafRef.current = requestAnimationFrame(animate); return; }
      const w = cont.clientWidth;
      const h = cont.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const lookup = {};
      sim.forEach(n => { lookup[n.id] = n; });

      for (let i = 0; i < sim.length; i++) {
        const a = sim[i];
        if (dragRef.current.active && dragRef.current.nodeId === a.id) continue;

        for (let j = i + 1; j < sim.length; j++) {
          const b = sim[j];
          if (dragRef.current.active && dragRef.current.nodeId === b.id) continue;
          let dx = a.px - b.px;
          let dy = a.py - b.py;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < MIN_DIST) dist = MIN_DIST;
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        }

        if (a.parent && lookup[a.parent]) {
          const p = lookup[a.parent];
          const dx = a.px - p.px;
          const dy = a.py - p.py;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const rest = a.type === 'sub' ? SPRING_REST_SUB : SPRING_REST_BRANCH;
          const displacement = dist - rest;
          const fx = (dx / dist) * displacement * SPRING_K;
          const fy = (dy / dist) * displacement * SPRING_K;
          a.vx -= fx; a.vy -= fy;
          if (!(dragRef.current.active && dragRef.current.nodeId === p.id)) {
            p.vx += fx; p.vy += fy;
          }
        }

        a.vx += (cx - a.px) * CENTER_GRAVITY;
        a.vy += (cy - a.py) * CENTER_GRAVITY;
      }

      sim.forEach(n => {
        if (dragRef.current.active && dragRef.current.nodeId === n.id) return;
        n.vx *= DAMPING;
        n.vy *= DAMPING;
        n.px += n.vx;
        n.py += n.vy;
        n.px = Math.max(40, Math.min(w - 40, n.px));
        n.py = Math.max(40, Math.min(h - 40, n.py));
      });

      sim.forEach(n => {
        const el = nodeRefs.current[n.id];
        if (el) {
          el.style.left = n.px + 'px';
          el.style.top = n.py + 'px';
        }
      });

      drawLines();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawLines]);

  const handleEnter = (id) => {
    hoveredRef.current = id;
    if (onNodeHover) onNodeHover(true);
    if (DETAILS[id]) setCardContent(DETAILS[id]);
  };

  const handleLeave = () => {
    hoveredRef.current = null;
    if (onNodeHover) onNodeHover(false);
    setTimeout(() => { if (!hoveredRef.current) setCardContent(DEFAULT_CARD); }, 800);
  };

  const handleClick = (node) => {
    if (dragRef.current.moved) return;
    if (node.link) {
      window.location.href = node.link;
    } else if (node.scrollTo && onNodeClick) {
      onNodeClick(node.scrollTo);
    }
  };

  return (
    <div className="kg-container" ref={containerRef}>
      <canvas className="kg-canvas" ref={canvasRef} />

      {INIT_NODES.map(node => (
        <div
          key={node.id}
          ref={el => { nodeRefs.current[node.id] = el; }}
          className={`kg-node kg-node-${node.type} kg-cat-${node.cat}`}
          style={{ '--cat-color': CAT_COLORS[node.cat] || '#FF3300' }}
          onMouseEnter={() => handleEnter(node.id)}
          onMouseLeave={handleLeave}
          onClick={() => handleClick(node)}
        >
          <div className={`kg-icon ${node.type === 'center' ? 'kg-icon-center' : ''} ${node.type === 'branch' ? 'kg-icon-hex' : ''}`}>
            <span className="material-symbols-outlined" style={node.type === 'center' ? { fontVariationSettings: '"FILL" 1' } : undefined}>
              {node.icon}
            </span>
          </div>
          {node.type === 'center' && (
            <>
              <span className="kg-label-main">{node.label}</span>
              <span className="kg-label-sub">{node.sub}</span>
            </>
          )}
          {node.type === 'branch' && <span className="kg-label-branch">{node.label}</span>}
          {node.type === 'sub' && <span className="kg-label-leaf">{node.label}</span>}
        </div>
      ))}

      <div className="kg-card">
        <div className="kg-card-head">
          <div className="kg-card-head-left">
            <span className="material-symbols-outlined kg-card-icon">brightness_7</span>
            <span className="kg-card-tag">INDEX</span>
          </div>
        </div>
        <div className="kg-card-divider" />
        <div className="kg-card-body">
          {cardContent.title && <h4 className="kg-card-title">{cardContent.title}</h4>}
          <p className="kg-card-text">{cardContent.text}</p>
          {!cardContent.title && (
            <a href="#code-work" className="kg-card-link cursor-target">view full resume</a>
          )}
        </div>
        <div className="kg-card-sections">
          {['PROJECTS', 'PUBLICATIONS', 'EXPERIENCE'].map((s, i) => (
            <div key={i} className="kg-card-row">
              <div className="kg-card-row-left">
                <span className="material-symbols-outlined">{['code', 'menu_book', 'timeline'][i]}</span>
                <span>{s}</span>
              </div>
              <span className="material-symbols-outlined">add</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
