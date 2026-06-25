import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

export default function TargetCursor({
  targetSelector = '.cursor-target',
  spinDuration = 3,
  hideDefaultCursor = true,
  hoverDuration = 0.25,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget = '#FF3300'
}) {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const tlRef = useRef(null);
  const trRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const isHovering = useRef(false);

  const updatePosition = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    pos.current.x += (targetPos.current.x - pos.current.x) * 0.12;
    pos.current.y += (targetPos.current.y - pos.current.y) * 0.12;

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
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.6, duration: 0.3, ease: 'power2.out' });
      }
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
    const dot = dotRef.current;
    const corners = [tlRef.current, trRef.current, blRef.current, brRef.current];
    if (!cursor || !dot || corners.some(c => !c)) return;

    const targets = document.querySelectorAll(targetSelector);

    const setColor = (color) => {
      gsap.to([dot, ...corners], {
        backgroundColor: color,
        borderColor: color,
        duration: hoverDuration
      });
    };

    const onTargetEnter = (e) => {
      isHovering.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      const w = rect.width + 16;
      const h = rect.height + 16;
      const color = cursorColorOnTarget || cursorColor;

      gsap.to(cursor, {
        width: w,
        height: h,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      gsap.to(tlRef.current, { top: -2, left: -2, duration: hoverDuration, ease: 'power2.out' });
      gsap.to(trRef.current, { top: -2, right: -2, duration: hoverDuration, ease: 'power2.out' });
      gsap.to(blRef.current, { bottom: -2, left: -2, duration: hoverDuration, ease: 'power2.out' });
      gsap.to(brRef.current, { bottom: -2, right: -2, duration: hoverDuration, ease: 'power2.out' });

      setColor(color);
    };

    const onTargetLeave = () => {
      isHovering.current = false;

      gsap.to(cursor, {
        width: 20,
        height: 20,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      gsap.to(tlRef.current, { top: 2, left: 2, duration: hoverDuration, ease: 'power2.out' });
      gsap.to(trRef.current, { top: 2, right: 2, duration: hoverDuration, ease: 'power2.out' });
      gsap.to(blRef.current, { bottom: 2, left: 2, duration: hoverDuration, ease: 'power2.out' });
      gsap.to(brRef.current, { bottom: 2, right: 2, duration: hoverDuration, ease: 'power2.out' });

      setColor(cursorColor);
    };

    const onTargetMove = (e) => {
      if (!parallaxOn || !isHovering.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(corners, {
        x: px * 10,
        y: py * 10,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    targets.forEach(t => {
      t.addEventListener('mouseenter', onTargetEnter);
      t.addEventListener('mouseleave', onTargetLeave);
      t.addEventListener('mousemove', onTargetMove);
    });

    return () => {
      targets.forEach(t => {
        t.removeEventListener('mouseenter', onTargetEnter);
        t.removeEventListener('mouseleave', onTargetLeave);
        t.removeEventListener('mousemove', onTargetMove);
      });
    };
  }, [targetSelector, cursorColor, cursorColorOnTarget, hoverDuration, parallaxOn]);

  return (
    <div
      ref={cursorRef}
      className="target-cursor"
      style={{ '--cursor-color': cursorColor, '--spin-duration': `${spinDuration}s` }}
    >
      <span ref={dotRef} className="tc-dot"></span>
      <span ref={tlRef} className="tc-corner tc-tl"></span>
      <span ref={trRef} className="tc-corner tc-tr"></span>
      <span ref={blRef} className="tc-corner tc-bl"></span>
      <span ref={brRef} className="tc-corner tc-br"></span>
    </div>
  );
}
