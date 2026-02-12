import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

const celebrationMessages = [
  "I love you", "You make me happy", "My heart is yours",
  "I adore you", "You're beautiful", "Forever with you",
  "I cherish you", "You're my person", "My soulmate",
  "I need you", "You're my everything", "I'm so lucky",
  "You're incredible", "I'm blessed", "You complete me",
  "I'm yours", "Always and forever", "You're my dream",
  "I trust you", "You inspire me", "I'm so proud of you",
];

interface SafePosition {
  x: number;
  y: number;
  zone: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  id: number;
  text: string;
  delay: number;
  duration: number;
  repeatDelay: number;
}

// Memoized single floating message with staggered appearance
const FloatingMessage = memo(({ msg }: { msg: SafePosition }) => {
  return (
    <motion.div
      key={msg.id}
      className="absolute text-primary/60 font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap will-change-transform"
      style={{
        left: `${msg.x}%`,
        top: `${msg.y}%`,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0.4, 0],
        scale: [0.7, 1, 0.9, 0.7],
        y: [0, -12, -20, -25],
      }}
      transition={{
        delay: msg.delay,
        duration: msg.duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: msg.repeatDelay,
        ease: "easeInOut",
      }}
    >
      {msg.text}
    </motion.div>
  );
});

FloatingMessage.displayName = 'FloatingMessage';

const FloatingMessages = () => {
  // Pre-generate all data with stable memoization and randomized intervals
  const messages = useMemo(() => {
    const positions: SafePosition[] = [];
    const zones: SafePosition['zone'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right'];
    
    // Optimized message count for performance
    const messageCount = 14;
    
    for (let i = 0; i < messageCount; i++) {
      const zone = zones[i % zones.length];
      let x: number, y: number;
      
      // Position across entire screen including center (behind video)
      switch (zone) {
        case 'top-left':
          x = -5 + (Math.random() * 35);
          y = -8 + (Math.random() * 25);
          break;
        case 'top-right':
          x = 70 + (Math.random() * 30);
          y = -8 + (Math.random() * 25);
          break;
        case 'bottom-left':
          x = -5 + (Math.random() * 35);
          y = 75 + (Math.random() * 25);
          break;
        case 'bottom-right':
          x = 70 + (Math.random() * 30);
          y = 75 + (Math.random() * 25);
          break;
        case 'left':
          x = -8 + (Math.random() * 25);
          y = 20 + (Math.random() * 60);
          break;
        case 'right':
          x = 80 + (Math.random() * 20);
          y = 20 + (Math.random() * 60);
          break;
      }
      
      // Randomized delays and durations for staggered appearance
      const delay = Math.random() * 8; // Random start time 0-8s
      const duration = 5 + Math.random() * 3; // Duration 5-8s
      const repeatDelay = 1 + Math.random() * 4; // Pause 1-5s between repeats
      
      const text = celebrationMessages[i % celebrationMessages.length];
      
      positions.push({ 
        x, 
        y, 
        zone,
        id: i,
        text,
        delay,
        duration,
        repeatDelay
      });
    }
    
    return positions;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {messages.map((msg) => (
        <FloatingMessage key={msg.id} msg={msg} />
      ))}
    </div>
  );
};

export default memo(FloatingMessages);
