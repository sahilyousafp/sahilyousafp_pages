import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './EdgeModeSwitch.css';

export default function EdgeModeSwitch({ mode, onSwitch, onEdgeActive }) {
  const arrowRef = useRef(null);
  const activeRef = useRef(false);
  const sideRef = useRef(null);
  const edgeThreshold = 80;

  const handleClick = useCallback(() => {
    if (activeRef.current) onSwitch();
  }, [onSwitch]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const deadZone = h * 0.1;

      let side = null;
      if (clientY > deadZone && clientY < h - deadZone) {
        if (clientX < edgeThreshold) side = 'left';
        else if (clientX > w - edgeThreshold) side = 'right';
      }

      if (side && !activeRef.current) {
        activeRef.current = true;
        sideRef.current = side;
        onEdgeActive?.(true);

        if (arrowRef.current) {
          arrowRef.current.className = `edge-arrow edge-arrow-${mode} edge-arrow-${side}`;
          gsap.to(arrowRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      } else if (side && activeRef.current) {
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            y: clientY,
            duration: 0.15,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      } else if (!side && activeRef.current) {
        activeRef.current = false;
        sideRef.current = null;
        onEdgeActive?.(false);

        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            opacity: 0,
            scale: 0.6,
            duration: 0.25,
            ease: 'power2.in',
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode, onEdgeActive]);

  const switchLabel = mode === 'code' ? 'ARCHITECTURE' : 'CODE';

  return (
    <div
      ref={arrowRef}
      className={`edge-arrow edge-arrow-${mode}`}
      onClick={handleClick}
      style={{ opacity: 0 }}
    >
      <svg className="edge-arrow-svg" viewBox="0 0 24 40" fill="none">
        <path d="M2 20L18 4V16H22V24H18V36L2 20Z" fill="currentColor" />
      </svg>
      <span className="edge-arrow-label">{switchLabel}</span>
    </div>
  );
}
