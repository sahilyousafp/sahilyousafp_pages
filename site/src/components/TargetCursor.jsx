import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

export default function TargetCursor({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget = '#FF3300'
}) {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const cornersRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const isHovering = useRef(false);

  const updatePosition = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Linear interpolation for smooth follow
    pos.current.x += (targetPos.current.x - pos.current.x) * 0.15;
    pos.current.y += (targetPos.current.y - pos.current.y) * 0.15;

    const containingBlock = cursor.offsetParent;
    let offsetX = 0, offsetY = 0;
    if (containingBlock && containingBlock !== document.body) {
      const rect = containingBlock.getBoundingClientRect();
      offsetX = rect.left;
      offsetY = rect.top;
    }

    cursor.style.transform = `translate3d(${pos.current.x - offsetX}px, ${pos.current.y - offsetY}px, 0)`;
    raf.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const onMouseMove = (e) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;
    };

    const onMouseEnter = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 1, scale: 1, duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.8, duration: 0.3 });
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
      if (hideDefaultCursor) document.body.style.cursor = '';
    };
  }, [hideDefaultCursor, updatePosition]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const corners = cornersRef.current;
    if (!cursor || !dot || !corners) return;

    const targets = document.querySelectorAll(targetSelector);

    const onTargetEnter = (e) => {
      isHovering.current = true;
      const rect = e.currentTarget.getBoundingClientRect();
      const color = cursorColorOnTarget || cursorColor;

      gsap.to(cursor, {
        width: rect.width + 24,
        height: rect.height + 24,
        duration: hoverDuration,
        ease: 'power2.out'
      });
      gsap.to([dot, corners], {
        color,
        borderColor: color,
        duration: hoverDuration
      });
    };

    const onTargetLeave = () => {
      isHovering.current = false;
      gsap.to(cursor, {
        width: 40,
        height: 40,
        duration: hoverDuration,
        ease: 'power2.out'
      });
      gsap.to([dot, corners], {
        color: cursorColor,
        borderColor: cursorColor,
        duration: hoverDuration
      });
    };

    const onTargetMove = (e) => {
      if (!parallaxOn || !isHovering.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(corners, {
        x: px * 12,
        y: py * 12,
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
      <span ref={cornersRef} className="tc-corners"></span>
    </div>
  );
}
