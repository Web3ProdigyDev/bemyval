import { useMemo } from 'react';
import { motion } from 'framer-motion';

const celebrationMessages = [
  "💕", "You're mine!", "Forever yours", "❤️", "My heart! 💗",
  "So happy!", "Love wins 💖", "Finally!", "Yay!", "Best day ever",
  "💝", "You + Me", "Soulmates", "My love", "✨", "Perfect!",
  "💘", "I knew it!", "Dream come true", "Together 💕", "Lucky me!",
  "🥰", "Heart eyes!", "Can't wait", "Always", "My Valentine 💌"
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
    
    // Generate 12-16 messages
    const messageCount = 14;
    
    for (let i = 0; i < messageCount; i++) {
      const zone = zones[i % zones.length];
      let x: number, y: number;
      
      // Position based on zone - keeping away from center content
      switch (zone) {
        case 'top-left':
          x = 2 + Math.random() * 18;
          y = 5 + Math.random() * 15;
          break;
        case 'top-right':
          x = 80 + Math.random() * 18;
          y = 5 + Math.random() * 15;
          break;
        case 'bottom-left':
          x = 2 + Math.random() * 18;
          y = 70 + Math.random() * 20;
          break;
        case 'bottom-right':
          x = 80 + Math.random() * 18;
          y = 70 + Math.random() * 20;
          break;
        case 'left':
          x = 1 + Math.random() * 12;
          y = 25 + Math.random() * 40;
          break;
        case 'right':
          x = 87 + Math.random() * 12;
          y = 25 + Math.random() * 40;
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
      {messages.map((msg, index) => (
        <motion.div
          key={msg.id}
          className="absolute text-primary/60 font-medium text-xs sm:text-sm whitespace-nowrap"
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0.5, 0.7],
            scale: 1,
            y: [0, -10, 0, -10, 0],
          }}
          transition={{
            delay: index * 0.08,
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          {msg.text}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingMessages;
