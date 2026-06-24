import { useEffect, useRef, useState } from 'react';
import { graphData } from '../data';
import './CodeGraph.css';

export default function CodeGraph({ onNodeHover }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const hoveredRef = useRef(null);
  const rafRef = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const [tooltip, setTooltip] = useState(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dimsRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initGraph();
    };

    const initGraph = () => {
      const { w, h } = dimsRef.current;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const cats = graphData.cats;
      const count = cats.length;
      const orbit = Math.min(w, h) * 0.32;

      const root = { id: 'root', label: 'SAHIL.YOUSAF', x: cx, y: cy, r: 18, vx: 0, vy: 0, fixed: true, color: '#FF3300', level: 0 };
      const nodes = [root];
      const links = [];

      cats.forEach((cat, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const node = {
          id: cat.id,
          label: cat.label,
          x: cx + Math.cos(angle) * orbit + (Math.random() - 0.5) * 40,
          y: cy + Math.sin(angle) * orbit + (Math.random() - 0.5) * 40,
          r: 12,
          vx: 0, vy: 0,
          color: '#00F0FF',
          level: 1,
          meta: cat
        };
        nodes.push(node);
        links.push({ source: root, target: node, color: 'rgba(0,240,255,0.25)' });

        (cat.leaves || []).forEach((leaf, j) => {
          const leafAngle = angle + (j - (cat.leaves.length - 1) / 2) * 0.35;
          const leafDist = orbit * 0.55 + Math.random() * 30;
          const leafNode = {
            id: `${cat.id}-${j}`,
            label: leaf.label,
            x: node.x + Math.cos(leafAngle) * leafDist,
            y: node.y + Math.sin(leafAngle) * leafDist,
            r: 6,
            vx: 0, vy: 0,
            color: 'rgba(244,244,240,0.7)',
            level: 2,
            meta: leaf
          };
          nodes.push(leafNode);
          links.push({ source: node, target: leafNode, color: 'rgba(244,244,240,0.12)' });
        });
      });

      nodesRef.current = nodes;
      linksRef.current = links;
    };

    const animate = () => {
      const { w, h } = dimsRef.current;
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // physics
      nodes.forEach(node => {
        if (node.fixed) return;
        node.vx *= 0.92;
        node.vy *= 0.92;

        // center gravity
        node.vx += (w * 0.5 - node.x) * 0.0003;
        node.vy += (h * 0.5 - node.y) * 0.0003;

        // repulsion
        nodes.forEach(other => {
          if (node === other) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = node.r + other.r + (node.level === 2 ? 35 : 55);
          if (dist < minDist) {
            const f = (minDist - dist) / dist * 0.8;
            node.vx += dx * f;
            node.vy += dy * f;
          }
        });

        // mouse repel/attraction
        const mdx = mouse.x - node.x;
        const mdy = mouse.y - node.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
        if (mDist < 160) {
          const f = (160 - mDist) / 160 * 0.5;
          node.vx -= (mdx / mDist) * f * 8;
          node.vy -= (mdy / mDist) * f * 8;
        }

        node.x += node.vx;
        node.y += node.vy;

        // bounds
        node.x = Math.max(node.r, Math.min(w - node.r, node.x));
        node.y = Math.max(node.r, Math.min(h - node.r, node.y));
      });

      // link spring
      links.forEach(link => {
        const dx = link.target.x - link.source.x;
        const dy = link.target.y - link.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = link.target.level === 2 ? 90 : 160;
        const f = (dist - targetDist) / dist * 0.02;
        const fx = dx * f;
        const fy = dy * f;
        if (!link.source.fixed) { link.source.vx += fx; link.source.vy += fy; }
        if (!link.target.fixed) { link.target.vx -= fx; link.target.vy -= fy; }

        ctx.beginPath();
        ctx.moveTo(link.source.x, link.source.y);
        ctx.lineTo(link.target.x, link.target.y);
        ctx.strokeStyle = link.color;
        ctx.lineWidth = link.target.level === 2 ? 1 : 1.5;
        ctx.stroke();
      });

      // nodes
      hoveredRef.current = null;
      nodes.forEach(node => {
        const isHover = mouse.x > -999 && Math.hypot(mouse.x - node.x, mouse.y - node.y) < node.r + 10;
        if (isHover) hoveredRef.current = node;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowBlur = isHover ? 20 : 0;
        ctx.shadowColor = node.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (node.level < 2 || isHover) {
          ctx.fillStyle = '#F4F4F0';
          ctx.font = `${node.level === 0 ? 700 : 500} ${node.level === 0 ? 14 : 11}px "JetBrains Mono",monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, node.x, node.y + node.r + 16);
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (hoveredRef.current) {
        const m = hoveredRef.current.meta;
        setTooltip({ x: e.clientX + 16, y: e.clientY + 16, title: m.label || m.title, desc: m.desc });
        if (onNodeHover) onNodeHover(true);
      } else {
        setTooltip(null);
        if (onNodeHover) onNodeHover(false);
      }
    };

    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
      setTooltip(null);
    };

    const onClick = () => {
      if (hoveredRef.current && hoveredRef.current.meta?.link) {
        window.location.href = hoveredRef.current.meta.link;
      }
    };

    resize();
    animate();
    window.addEventListener('resize', resize);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('click', onClick);
    };
  }, [onNodeHover]);

  return (
    <div ref={containerRef} className="code-graph">
      <canvas ref={canvasRef} />
      {tooltip && (
        <div className="cg-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <strong>{tooltip.title}</strong>
          <span>{tooltip.desc}</span>
        </div>
      )}
    </div>
  );
}
