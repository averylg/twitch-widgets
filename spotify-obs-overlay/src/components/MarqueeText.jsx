import { useRef, useEffect, useState } from 'react';
import "../styles/marquee.css";

const MarqueeText = ({ children, speed = 10 }) => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const isOverflow = textRef.current.scrollWidth > containerRef.current.clientWidth - 15;
        setIsOverflowing(isOverflow);

        if (isOverflow) {
          const scrollWidth = textRef.current.scrollWidth;
          const containerWidth = containerRef.current.clientWidth;
          const duration = (scrollWidth + containerWidth) / speed;
          setAnimationDuration(duration);
        }
      }
    };

    console.log("Anim Dur:", animationDuration);
    console.log("isOverflowing:", isOverflowing);

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children, speed, animationDuration, isOverflowing]);

  return (
    <div ref={containerRef} style={{ overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
      <div
        ref={textRef}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: isOverflowing ? `marquee ${animationDuration}s linear infinite` : 'none',
        }}
      >
        {children} {isOverflowing && children} 
      </div>
    </div>
  );
};

export default MarqueeText;
