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

// Memoized single floating message
const FloatingMessage = memo(({ msg }: { msg: SafePosition }) => {
  return (
    <motion.div
      key={msg.id}
      className="absolute text-primary/70 font-bold text-sm sm:text-base md:text-lg whitespace-nowrap will-change-transform"
      style={{
        left: `${msg.x}%`,
        top: `${msg.y}%`,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.7, 0.5, 0],
        scale: [0.8, 1.1, 1, 0.8],
        y: [0, -15, -28],
      }}
      transition={{
        delay: msg.delay,
        duration: msg.duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: msg.repeatDelay,
        ease: "easeOut",
      }}
    >
      {msg.text}
    </motion.div>
  );
});

FloatingMessage.displayName = 'FloatingMessage';

const FloatingMessages = () => {
  // Pre-generate all data with stable memoization
  const messages = useMemo(() => {
    const positions: SafePosition[] = [];
    const zones: SafePosition['zone'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right'];
    
    // Reduce message count for better performance (from 24 to 16)
    const messageCount = 16;
    
    for (let i = 0; i < messageCount; i++) {
      const zone = zones[i % zones.length];
      let x: number, y: number;
      
      // Position based on zone - keeping away from center content
      switch (zone) {
        case 'top-left':
          x = -5 + (Math.random() * 25);
          y = -8 + (Math.random() * 20);
          break;
        case 'top-right':
          x = 75 + (Math.random() * 25);
          y = -8 + (Math.random() * 20);
          break;
        case 'bottom-left':
          x = -5 + (Math.random() * 25);
          y = 75 + (Math.random() * 25);
          break;
        case 'bottom-right':
          x = 75 + (Math.random() * 25);
          y = 75 + (Math.random() * 25);
          break;
        case 'left':
          x = -8 + (Math.random() * 18);
          y = 25 + (Math.random() * 50);
          break;
        case 'right':
          x = 82 + (Math.random() * 18);
          y = 25 + (Math.random() * 50);
          break;
      }
      
      // Use consistent seed-based delay for better performance
      const delay = (i * 0.5) % 10;
      const duration = 6 + (i % 3);
      const repeatDelay = 2 + (i % 3);
      
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
