import { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  emoji: string;
}

const emojis = ['💕', '💖', '💗', '💝', '❤️', '🩷', '✨'];

const FloatingHearts = memo(() => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Significantly reduced particle counts for performance
    const heartCount = isMobile ? 8 : 12;
    const newHearts: Heart[] = [];
    
    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 24 + 14,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.2,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setHearts(newHearts);
  }, [isMobile]);

  const sparkleCount = isMobile ? 5 : 8;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating hearts - simplified animation */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute will-change-transform"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          initial={{ y: '110vh' }}
          animate={{ 
            y: '-10vh',
            x: [0, 20, -20, 0],
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

      {/* Minimal sparkles */}
      {[...Array(sparkleCount)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-valentine-gold will-change-transform"
          style={{
            left: `${10 + i * (80 / sparkleCount)}%`,
            top: `${20 + (i % 3) * 25}%`,
            fontSize: 14,
          }}
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.5,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
});

FloatingHearts.displayName = 'FloatingHearts';

export default FloatingHearts;
