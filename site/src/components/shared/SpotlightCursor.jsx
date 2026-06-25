import { useEffect, useRef } from 'react';
import './SpotlightCursor.css';

export default function SpotlightCursor() {
  const spotlightRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';
      spotlight.style.opacity = 1;
    };

    const handleMouseLeave = () => {
      spotlight.style.opacity = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="spotlight-cursor"
    >
      <div className="spotlight-glow"></div>
      <div className="spotlight-circle"></div>
    </div>
  );
}
