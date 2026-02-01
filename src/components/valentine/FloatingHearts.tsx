import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  emoji: string;
}

interface CursorHeart {
  id: number;
  x: number;
  y: number;
}

const emojis = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '🌹', '✨'];

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [cursorHearts, setCursorHearts] = useState<CursorHeart[]>([]);

  useEffect(() => {
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      for (let i = 0; i < 25; i++) {
        newHearts.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 35 + 15,
          duration: Math.random() * 12 + 8,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.2,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, []);

  // Cursor heart trail
  useEffect(() => {
    let heartId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.85) { // Only spawn occasionally
        const newHeart: CursorHeart = {
          id: heartId++,
          x: e.clientX,
          y: e.clientY,
        };
        setCursorHearts(prev => [...prev.slice(-10), newHeart]);
        
        // Remove after animation
        setTimeout(() => {
          setCursorHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1500);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          initial={{ y: '110vh', rotate: 0, scale: 1 }}
          animate={{
            y: '-10vh',
            rotate: [0, 15, -15, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
            x: [0, 30, -30, 20, -20, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}

      {/* Sparkles scattered around */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-valentine-gold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: Math.random() * 18 + 10,
          }}
          animate={{
            scale: [1, 1.5, 1, 1.3, 1],
            opacity: [0.2, 1, 0.2, 0.8, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Glitter dots */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`glitter-${i}`}
          className="absolute rounded-full bg-valentine-gold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 1.5 + Math.random() * 2,
            delay: Math.random() * 4,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Cursor heart trail */}
      <AnimatePresence>
        {cursorHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none"
            style={{
              left: heart.x,
              top: heart.y,
              fontSize: 20,
            }}
            initial={{ opacity: 1, scale: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1.5, 
              y: -50,
              x: (Math.random() - 0.5) * 40,
              rotate: (Math.random() - 0.5) * 60,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {emojis[Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating bubbles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full border-2 border-primary/30"
          style={{
            left: `${10 + i * 12}%`,
            width: 20 + Math.random() * 30,
            height: 20 + Math.random() * 30,
          }}
          initial={{ y: '110vh', opacity: 0.3 }}
          animate={{
            y: '-10vh',
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingHearts;
