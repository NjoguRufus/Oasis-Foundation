import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ErrorScreen = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Function to set canvas size dynamically
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize(); // Set initial size
    window.addEventListener("resize", setCanvasSize); // Adjust on resize

    // Matrix effect variables
    const chars = "01 ERROR SYSTEM FAILURE REBOOT * # @ ! & %".split("");
    let fontSize = Math.max(window.innerWidth / 40, 14); // Adjust font size based on screen width
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ff0000"; // Red color
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-black overflow-hidden">
      {/* Matrix Effect Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Main Error Message with Flashing Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-red-500 p-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-widest animate-pulse">
          ⚠ ERROR 909 ⚠
        </h1>
        <p className="mt-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-mono animate-pulse">
          .OASIS WELLNESS FOUNDATION.
        </p>
        <p className="mt-2 text-lg sm:text-2xl md:text-3xl lg:text-4xl animate-pulse">
          CONTACT <span className="text-white">DEVELOPER</span> FOR ACTIVATION.
        </p>
        <p className="mt-6 text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-300 tracking-widest animate-pulse">
          SYSTEM LOCKDOWN INITIATED...
        </p>
      </motion.div>
    </div>
  );
};

export default ErrorScreen;
