import React, { useRef, useEffect } from 'react';

// Simple iridescent animated background using canvas
// Props: color (array), mouseReact (bool), amplitude (float), speed (float)
const Iridescence = ({ color = [0, 1, 1], mouseReact = false, amplitude = 0.1, speed = 1.0 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let t = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    if (mouseReact) {
      window.addEventListener('mousemove', (e) => {
        mouse.current.x = e.clientX / width;
        mouse.current.y = e.clientY / height;
      });
    }

    function draw() {
      t += 0.01 * speed;
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          // Iridescent wave formula
          const dx = x / width - 0.5;
          const dy = y / height - 0.5;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = t + dist * 8 + Math.sin(t + dx * 6) * amplitude * 10;
          const r = Math.floor(80 + 80 * Math.sin(angle + color[0]));
          const g = Math.floor(180 + 60 * Math.sin(angle + color[1]));
          const b = Math.floor(220 + 35 * Math.sin(angle + color[2]));
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [color, mouseReact, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        filter: 'blur(1.5px) brightness(1.1)'
      }}
    />
  );
};

export default Iridescence; 