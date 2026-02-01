import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  emoji: string;
  animationType: number;
}

interface CursorHeart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const emojis = ['💕', '💖', '💗', '💓', '💝', '💘', '❤️', '🩷', '🌹', '✨', '💐', '🦋', '⭐', '🎀', '💫'];

// 15+ Different animation patterns
const animationPatterns = [
  // 1. Classic float up
  { y: '-10vh', x: [0, 20, -20, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 0.9, 1] },
  // 2. Zigzag
  { y: '-10vh', x: [0, 50, -50, 30, -30, 0], rotate: [0, 20, -20, 10, -10, 0] },
  // 3. Spiral
  { y: '-10vh', x: [0, 40, 0, -40, 0], rotate: [0, 180, 360, 540, 720], scale: [1, 1.2, 1, 0.8, 1] },
  // 4. Bounce float
  { y: [0, -100, -50, -200, -150, -300, '-10vh'], x: [0, 10, -10, 0], scale: [1, 1.3, 1, 1.2, 1] },
  // 5. Wave
  { y: '-10vh', x: [0, 60, -60, 60, -60, 0], rotate: [0, 5, -5, 5, -5, 0] },
  // 6. Gentle sway
  { y: '-10vh', x: [0, 15, -15, 10, -10, 5, -5, 0], rotate: [0, 3, -3, 0] },
  // 7. Pulse float
  { y: '-10vh', x: [0, 10, -10, 0], scale: [1, 1.4, 0.8, 1.2, 1] },
  // 8. Crazy spin
  { y: '-10vh', x: [0, 30, -30, 0], rotate: [0, 360, 720, 1080] },
  // 9. Figure 8
  { y: [0, -100, -200, -300, '-10vh'], x: [0, 40, 0, -40, 0] },
  // 10. Heartbeat float
  { y: '-10vh', scale: [1, 1.3, 1, 1.3, 1, 1.2, 1], x: [0, 5, -5, 0] },
  // 11. Drift
  { y: '-10vh', x: [0, 80, 40, 100, 60], rotate: [0, 15, -10, 5, 0] },
  // 12. Twirl
  { y: '-10vh', rotate: [0, 90, 180, 270, 360], scale: [1, 0.9, 1.1, 0.9, 1] },
  // 13. Wobble up
  { y: '-10vh', rotate: [0, 20, -20, 15, -15, 10, -10, 0], x: [0, 10, -10, 0] },
  // 14. Elastic
  { y: '-10vh', scale: [1, 1.5, 0.7, 1.3, 0.9, 1.1, 1], x: [0, 20, -20, 0] },
  // 15. Slow drift
  { y: '-10vh', x: [0, 100, 50, 120, 80], opacity: [0.3, 0.6, 0.4, 0.7, 0.3] },
  // 16. Shooting star
  { y: [0, '-10vh'], x: [0, 150], rotate: [0, 45], scale: [1, 0.5] },
];

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [cursorHearts, setCursorHearts] = useState<CursorHeart[]>([]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const generateHearts = () => {
      const heartCount = isMobile ? 15 : 30;
      const newHearts: Heart[] = [];
      for (let i = 0; i < heartCount; i++) {
        newHearts.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * (isMobile ? 25 : 40) + 12,
          duration: Math.random() * 15 + 8,
          delay: Math.random() * 8,
          opacity: Math.random() * 0.5 + 0.2,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          animationType: Math.floor(Math.random() * animationPatterns.length),
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, [isMobile]);

  // Cursor heart trail - only on desktop
  useEffect(() => {
    if (isMobile) return;

    let heartId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.88) {
        const newHeart: CursorHeart = {
          id: heartId++,
          x: e.clientX,
          y: e.clientY,
          emoji: emojis[Math.floor(Math.random() * 5)],
        };
        setCursorHearts(prev => [...prev.slice(-12), newHeart]);
        
        setTimeout(() => {
          setCursorHearts(prev => prev.filter(h => h.id !== newHeart.id));
        }, 1500);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  const sparkleCount = isMobile ? 10 : 25;
  const glitterCount = isMobile ? 15 : 40;
  const bubbleCount = isMobile ? 4 : 10;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating hearts with varied animations */}
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
          animate={animationPatterns[heart.animationType]}
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

      {/* Sparkles with different animations */}
      {[...Array(sparkleCount)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-valentine-gold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: Math.random() * 18 + 8,
          }}
          animate={
            i % 3 === 0
              ? { scale: [1, 1.5, 1], opacity: [0.2, 1, 0.2], rotate: [0, 180, 360] }
              : i % 3 === 1
              ? { scale: [1, 1.8, 0.8, 1.4, 1], opacity: [0.3, 0.9, 0.3] }
              : { scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4], y: [0, -10, 0] }
          }
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 4,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Glitter dots with varied animations */}
      {[...Array(glitterCount)].map((_, i) => (
        <motion.div
          key={`glitter-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            background: i % 4 === 0 
              ? 'hsl(var(--valentine-gold))' 
              : i % 4 === 1 
              ? 'hsl(var(--primary))' 
              : i % 4 === 2
              ? 'hsl(var(--valentine-pink))'
              : 'hsl(var(--accent))',
          }}
          animate={
            i % 5 === 0
              ? { opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }
              : i % 5 === 1
              ? { opacity: [0.3, 0.8, 0.3], scale: [1, 2, 1], rotate: [0, 180, 360] }
              : i % 5 === 2
              ? { opacity: [0, 1, 0], y: [0, -20, 0] }
              : i % 5 === 3
              ? { opacity: [0.5, 1, 0.5], x: [0, 10, -10, 0] }
              : { opacity: [0, 0.8, 0], scale: [1, 1.8, 1] }
          }
          transition={{
            duration: 1.5 + Math.random() * 2.5,
            delay: Math.random() * 5,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Cursor heart trail - Desktop only */}
      <AnimatePresence>
        {cursorHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none"
            style={{
              left: heart.x,
              top: heart.y,
              fontSize: 18,
            }}
            initial={{ opacity: 1, scale: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1.5, 
              y: -60,
              x: (Math.random() - 0.5) * 50,
              rotate: (Math.random() - 0.5) * 90,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating bubbles with varied animations */}
      {[...Array(bubbleCount)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${8 + i * (100 / bubbleCount)}%`,
            width: 15 + Math.random() * 35,
            height: 15 + Math.random() * 35,
            borderColor: i % 2 === 0 ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--accent) / 0.3)',
          }}
          initial={{ y: '110vh', opacity: 0.2 }}
          animate={
            i % 3 === 0
              ? { y: '-10vh', opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1], x: [0, 20, -20, 0] }
              : i % 3 === 1
              ? { y: '-10vh', opacity: [0.3, 0.6, 0.3], rotate: [0, 180, 360] }
              : { y: '-10vh', opacity: [0.2, 0.4, 0.2], scale: [1, 1.5, 0.8, 1.2, 1] }
          }
          transition={{
            duration: 12 + Math.random() * 12,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Floating stars */}
      {[...Array(isMobile ? 5 : 12)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-valentine-gold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: 12 + Math.random() * 16,
          }}
          animate={
            i % 4 === 0
              ? { rotate: [0, 360], scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }
              : i % 4 === 1
              ? { y: [0, -15, 0], x: [0, 10, -10, 0], opacity: [0.5, 1, 0.5] }
              : i % 4 === 2
              ? { scale: [1, 1.5, 0.8, 1.2, 1], rotate: [0, 45, -45, 0] }
              : { opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }
          }
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        >
          ⭐
        </motion.div>
      ))}

      {/* Floating ribbons/bows */}
      {[...Array(isMobile ? 3 : 6)].map((_, i) => (
        <motion.div
          key={`ribbon-${i}`}
          className="absolute"
          style={{
            left: `${15 + i * 15}%`,
            fontSize: 20 + Math.random() * 15,
          }}
          initial={{ y: '110vh' }}
          animate={{
            y: '-10vh',
            rotate: [0, 30, -30, 15, -15, 0],
            x: [0, 25, -25, 0],
          }}
          transition={{
            duration: 18 + Math.random() * 10,
            delay: i * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🎀
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
