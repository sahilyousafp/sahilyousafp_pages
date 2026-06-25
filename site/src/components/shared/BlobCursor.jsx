import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import './BlobCursor.css';

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#5227FF',
  hidden = false,
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = 'rgba(0,0,0,0.75)',
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = 'blob',
  filterStdDeviation = 30,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter = true,
  fastDuration = 0.08,
  slowDuration = 0.45,
  fastEase = 'power3.out',
  slowEase = 'power3.out',
  zIndex = 100
}) {
  const containerRef = useRef(null);
  const trailsRef = useRef([]);
  const leadRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -200, y: -200 });

  const tick = useCallback(() => {
    const { x, y } = mouseRef.current;
    const lead = leadRef.current;

    if (lead) {
      gsap.to(lead, {
        left: x - sizes[0] / 2,
        top: y - sizes[0] / 2,
        duration: fastDuration,
        ease: fastEase,
        overwrite: 'auto'
      });
    }

    trailsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        left: x - sizes[i + 1] / 2,
        top: y - sizes[i + 1] / 2,
        duration: slowDuration + i * 0.12,
        ease: slowEase,
        overwrite: 'auto'
      });
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [fastDuration, slowDuration, fastEase, slowEase, sizes]);

  const handleMove = useCallback(e => {
    mouseRef.current.x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    mouseRef.current.y = 'clientY' in e ? e.clientY : e.touches[0].clientY;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMove, tick]);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      opacity: hidden ? 0 : 1,
      duration: 0.25,
      ease: 'power2.out',
    });
  }, [hidden]);

  const br = blobType === 'circle' ? '50%' : '0%';

  return (
    <div ref={containerRef} className="blob-container" style={{ zIndex }}>
      {useFilter && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="blob-main"
        style={{
          filter: useFilter ? `url(#${filterId})` : undefined,
        }}
      >
        {Array.from({ length: trailCount - 1 }).map((_, i) => (
          <div
            key={i}
            ref={el => (trailsRef.current[i] = el)}
            className="blob"
            style={{
              width: sizes[i + 1],
              height: sizes[i + 1],
              borderRadius: br,
              backgroundColor: fillColor,
              opacity: opacities[i + 1],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`
            }}
          >
            <div
              className="inner-dot"
              style={{
                width: innerSizes[i + 1],
                height: innerSizes[i + 1],
                top: (sizes[i + 1] - innerSizes[i + 1]) / 2,
                left: (sizes[i + 1] - innerSizes[i + 1]) / 2,
                backgroundColor: innerColor,
                borderRadius: br
              }}
            />
          </div>
        ))}
      </div>

      <div
        ref={leadRef}
        className="blob-lead"
        style={{
          width: sizes[0],
          height: sizes[0],
          borderRadius: br,
          backgroundColor: fillColor,
          opacity: opacities[0],
        }}
      >
        <div
          className="inner-dot"
          style={{
            width: innerSizes[0],
            height: innerSizes[0],
            top: (sizes[0] - innerSizes[0]) / 2,
            left: (sizes[0] - innerSizes[0]) / 2,
            backgroundColor: innerColor,
            borderRadius: br
          }}
        />
      </div>
    </div>
  );
}
