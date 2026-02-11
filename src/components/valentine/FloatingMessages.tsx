import { useMemo } from 'react';
import { motion } from 'framer-motion';

const celebrationMessages = [
  "I love you", "You make me happy", "My heart is yours",
  "I adore you", "You're beautiful", "Forever with you",
  "I cherish you", "You're my person", "My soulmate",
  "I need you", "You're my everything", "I'm so lucky",
  "You're incredible", "I'm blessed", "You complete me",
  "I'm yours", "Always and forever", "You're my dream",
  "I trust you", "You inspire me", "I'm so proud of you",
  "You make me better", "I appreciate you", "You're my sunshine",
  "I admire you", "You're worth it", "I choose you",
  "You're perfect", "I'm grateful", "You're my peace"
];

interface SafePosition {
  x: number;
  y: number;
  zone: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
}

const FloatingMessages = () => {
  // Pre-generate positions in safe zones using useMemo
  const messagePositions = useMemo(() => {
    const positions: SafePosition[] = [];
    const zones: SafePosition['zone'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right'];
    
    // Generate more messages for endless feel
    const messageCount = 24;
    
    for (let i = 0; i < messageCount; i++) {
      const zone = zones[i % zones.length];
      let x: number, y: number;
      
      // Position based on zone - keeping away from center content
      switch (zone) {
        case 'top-left':
          x = -5 + Math.random() * 25;
          y = -10 + Math.random() * 25;
          break;
        case 'top-right':
          x = 75 + Math.random() * 25;
          y = -10 + Math.random() * 25;
          break;
        case 'bottom-left':
          x = -5 + Math.random() * 25;
          y = 75 + Math.random() * 25;
          break;
        case 'bottom-right':
          x = 75 + Math.random() * 25;
          y = 75 + Math.random() * 25;
          break;
        case 'left':
          x = -10 + Math.random() * 20;
          y = 20 + Math.random() * 50;
          break;
        case 'right':
          x = 80 + Math.random() * 20;
          y = 20 + Math.random() * 50;
          break;
      }
      
      positions.push({ x, y, zone });
    }
    
    return positions;
  }, []);

  // Shuffle and pick messages
  const messages = useMemo(() => {
    const shuffled = [...celebrationMessages].sort(() => Math.random() - 0.5);
    return messagePositions.map((pos, i) => ({
      ...pos,
      text: shuffled[i % shuffled.length],
      id: i,
    }));
  }, [messagePositions]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {messages.map((msg, index) => {
        // Stagger delays for endless effect
        const baseDelay = (index % 8) * 0.15;
        const cycle = Math.floor(index / 8);
        const totalDelay = cycle * 3 + baseDelay;
        
        return (
          <motion.div
            key={msg.id}
            className="absolute text-primary/70 font-bold text-sm sm:text-base md:text-lg whitespace-nowrap"
            style={{
              left: `${msg.x}%`,
              top: `${msg.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0.6, 0],
              scale: [0.8, 1.1, 1, 0.9],
              y: [0, -15, -25],
            }}
            transition={{
              delay: baseDelay,
              duration: 6,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          >
            {msg.text}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingMessages;
