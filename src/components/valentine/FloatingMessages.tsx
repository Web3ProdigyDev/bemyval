import { useMemo } from 'react';
import { motion } from 'framer-motion';

const celebrationMessages = [
  "💕", "You're mine!", "Forever yours", "❤️", "My heart! 💗",
  "So happy!", "Love wins 💖", "Finally!", "Yay!", "Best day ever",
  "💝", "You + Me", "Soulmates", "My love", "✨", "Perfect!",
  "💘", "I knew it!", "Dream come true", "Together 💕", "Lucky me!",
  "🥰", "Heart eyes!", "Can't wait", "Always", "My Valentine 💌",
  "Truly love you", "You're my everything", "So in love 💖", "Happy heart",
  "Made for each other", "Pure love", "My soulmate", "Happiest ever",
  "You complete me", "My whole world", "Forever and always", "Endless love",
  "You're perfect", "My greatest joy", "Heart is full", "Love this feeling",
  "Beautiful love", "My safe place", "You own my heart", "Meant to be",
  "Deeply grateful", "My forever", "Never letting go", "This is home"
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
    
    // Generate more messages for better coverage
    const messageCount = 24;
    
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
      {messages.map((msg, index) => {
        // Randomize delay for each message so they don't start at the same time
        const randomDelay = Math.random() * 3;
        // Randomize duration between 6-8 seconds for variety
        const randomDuration = 6 + Math.random() * 2;
        
        return (
          <motion.div
            key={msg.id}
            className="absolute text-primary/75 font-extrabold text-base sm:text-2xl md:text-3xl whitespace-nowrap drop-shadow-lg"
            style={{
              left: `${msg.x}%`,
              top: `${msg.y}%`,
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ 
              opacity: [0, 0.85, 0.7, 0.85, 0],
              scale: [0.7, 1, 1, 1, 0.7],
              y: [0, -20, 0, -20, 0],
            }}
            transition={{
              delay: randomDelay,
              duration: randomDuration,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 0.5,
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
