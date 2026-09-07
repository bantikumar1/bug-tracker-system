import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GhostTrailHeading = ({ children, className = "hero-title" }) => {
  const containerRef = useRef(null);
  const mainRef = useRef(null);
  const ghost1Ref = useRef(null);
  const ghost2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mainRef.current && ghost1Ref.current && ghost2Ref.current) {
        const tl = gsap.timeline();
        tl.from(ghost1Ref.current, { x: -300, opacity: 0.5, duration: 0.6 })
          .from(ghost2Ref.current, { x: -400, opacity: 0.3, duration: 0.7 }, '<0.1')
          .from(mainRef.current, { x: -200, opacity: 0, duration: 0.8 }, '<0.1')
          .to(ghost1Ref.current, { opacity: 0, filter: 'blur(4px)', duration: 0.5 })
          .to(ghost2Ref.current, { opacity: 0, filter: 'blur(8px)', duration: 0.5 }, '<');
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="ghost-trail-container" 
      style={{ position: 'relative', display: 'inline-block', width: '100%', overflow: 'hidden' }}
    >
      {/* Ghost Copy Layer 2 (Furthest trail) */}
      <h1 
        ref={ghost2Ref} 
        className={`${className} ghost-copy ghost-2`}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          opacity: 0, 
          zIndex: 1, 
          pointerEvents: 'none',
          userSelect: 'none'
        }}
        aria-hidden="true"
      >
        {children}
      </h1>

      {/* Ghost Copy Layer 1 (Closer trail) */}
      <h1 
        ref={ghost1Ref} 
        className={`${className} ghost-copy ghost-1`}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          opacity: 0, 
          zIndex: 2, 
          pointerEvents: 'none',
          userSelect: 'none'
        }}
        aria-hidden="true"
      >
        {children}
      </h1>

      {/* Main Heading Layer */}
      <h1 
        ref={mainRef} 
        className={`${className} ghost-main`}
        style={{ position: 'relative', zIndex: 3 }}
      >
        {children}
      </h1>
    </div>
  );
};

export default GhostTrailHeading;
