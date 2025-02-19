import { useEffect, useRef } from "react";
import Grid2Background from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.17/build/backgrounds/grid2.cdn.min.js";

const CylindersGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const bg = Grid2Background(canvasRef.current);

    const handleClick = () => {
      bg.grid.setColors([
        0xffffff * Math.random(),
        0xffffff * Math.random(),
        0xffffff * Math.random(),
      ]);
      bg.grid.light1.color.set(0xffffff * Math.random());
      bg.grid.light1.intensity = 500 + Math.random() * 1000;
      bg.grid.light2.color.set(0xffffff * Math.random());
      bg.grid.light2.intensity = 250 + Math.random() * 250;
    };

    document.body.addEventListener("click", handleClick);
    return () => document.body.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
    <div className="mainglass">

    </div>
      <canvas ref={canvasRef} className="absolute -z-10 flex h-964px w-2116px justify-center items-center left-352px top-32px bg-white/30 backdrop-blur-xs"></canvas>
    {/* <div className="w-full h-screen bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(0,0,0,0.5)_200%)] font-montserrat relative">
    </div> */}
    </>
  );
};

export default CylindersGrid;
