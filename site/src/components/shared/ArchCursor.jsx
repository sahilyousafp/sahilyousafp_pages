import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './ArchCursor.css';

export default function ArchCursor({
  cursorColor = '#3D2B1F',
  cursorColorOnTarget = '#C75B3A',
  targetSelector = '.cursor-target',
  hideDefaultCursor = true
}) {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  const updatePosition = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    pos.current.x += (targetPos.current.x - pos.current.x) * 0.15;
    pos.current.y += (targetPos.current.y - pos.current.y) * 0.15;

    cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
    raf.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.style.cursor = 'none';
      });
    }

    const onMouseMove = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
    };

    const onMouseEnter = () => {
      gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const onMouseLeave = () => {
      gsap.to(cursorRef.current, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.out' });
    };

    raf.current = requestAnimationFrame(updatePosition);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (hideDefaultCursor) {
        document.body.style.cursor = '';
        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
          el.style.cursor = '';
        });
      }
    };
  }, [hideDefaultCursor, updatePosition]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!cursor || !ring || !dot) return;

    const targets = document.querySelectorAll(targetSelector);

    const onTargetEnter = () => {
      gsap.to(ring, { scale: 1.6, borderColor: cursorColorOnTarget, duration: 0.25, ease: 'power2.out' });
      gsap.to(dot, { backgroundColor: cursorColorOnTarget, scale: 1.4, duration: 0.25, ease: 'power2.out' });
    };

    const onTargetLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: cursorColor, duration: 0.25, ease: 'power2.out' });
      gsap.to(dot, { backgroundColor: cursorColor, scale: 1, duration: 0.25, ease: 'power2.out' });
    };

    targets.forEach(t => {
      t.addEventListener('mouseenter', onTargetEnter);
      t.addEventListener('mouseleave', onTargetLeave);
    });

    return () => {
      targets.forEach(t => {
        t.removeEventListener('mouseenter', onTargetEnter);
        t.removeEventListener('mouseleave', onTargetLeave);
      });
    };
  }, [targetSelector, cursorColor, cursorColorOnTarget]);

  return (
    <div ref={cursorRef} className="arch-cursor" style={{ '--cursor-color': cursorColor }}>
      <span ref={ringRef} className="ac-ring"></span>
      <span ref={dotRef} className="ac-dot"></span>
    </div>
  );
}
