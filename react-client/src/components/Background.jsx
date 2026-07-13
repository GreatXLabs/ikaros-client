import { useState, useEffect } from "react";
import "./Background.css";

export function Background() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <span className="background-wrapper">
      <span 
        className="background"
        style={{ 
          transform: `translate(${position.x * 0.5}px, ${position.y * 0.5}px)`
        }}
        >
          <img 
            className="luna"
            src="/Imgs/bg/the moon we dither.png"
            alt=""
            style={{
              transform: `translate(calc(48% + ${position.x * -1.5}px), calc(40px + ${position.y * -1.5}px))`
            }}
          />
        </span>
      </span>

  );
}