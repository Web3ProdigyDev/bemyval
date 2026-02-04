import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
}

const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '✦', '✧'];

const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  const addSparkle = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isEnabled) return;

    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    // Random offset for more natural feel
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    const newSparkle: Sparkle = {
      id: Date.now() + Math.random(),
      x: x + offsetX,
      y: y + offsetY,
      size: Math.random() * 12 + 8,
      emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)],
    };

    setSparkles((prev) => [...prev.slice(-15), newSparkle]); // Keep max 16 sparkles
  }, [isEnabled]);

  const removeSparkle = useCallback((id: number) => {
    setSparkles((prev) => prev.filter((s) => s.id !== id));
  }, []);

  useEffect(() => {
    // Throttle to avoid too many sparkles
    let lastTime = 0;
    const throttleMs = 80;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastTime >= throttleMs) {
        lastTime = now;
        addSparkle(e);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [addSparkle]);

  // Disable on mobile for performance
  useEffect(() => {
    setIsEnabled(window.innerWidth >= 768);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              fontSize: sparkle.size,
            }}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1.5, 
              rotate: 180,
              y: -20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() => removeSparkle(sparkle.id)}
          >
            {sparkle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorSparkles;