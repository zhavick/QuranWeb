import { useEffect, RefObject } from 'react';

export function useAutoScroll(
  containerRef: RefObject<HTMLElement | null>,
  speed: number
) {
  useEffect(() => {
    if (speed <= 0) return;
    let frameId: number;
    let lastTime = performance.now();
    const pixelsPerSecond = speed === 1 ? 22 : 45;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const el = containerRef.current;
      if (el) {
        el.scrollTop += pixelsPerSecond * dt;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [containerRef, speed]);
}

