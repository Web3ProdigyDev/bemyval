import { useMemo } from 'react';

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
  // Pre-generate positions in safe zones using useMemo with grid to prevent overlaps
  const messagePositions = useMemo(() => {
    const positions: SafePosition[] = [];
    const GRID_SIZE = 15; // Percentage units for grid cells
    const SPACING = 18; // Minimum spacing between items
    
    // Define grid positions systematically - no random overlap
    const gridPositions = [
      // Top-left zone
      { x: 3, y: 8, zone: 'top-left' as const },
      { x: 10, y: 12, zone: 'top-left' as const },
      { x: 5, y: 20, zone: 'top-left' as const },
      
      // Top-right zone
      { x: 82, y: 8, zone: 'top-right' as const },
      { x: 87, y: 15, zone: 'top-right' as const },
      { x: 78, y: 22, zone: 'top-right' as const },
      
      // Left side
      { x: 2, y: 32, zone: 'left' as const },
      { x: 4, y: 45, zone: 'left' as const },
      { x: 3, y: 58, zone: 'left' as const },
      
      // Right side
      { x: 85, y: 35, zone: 'right' as const },
      { x: 88, y: 48, zone: 'right' as const },
      { x: 86, y: 62, zone: 'right' as const },
      
      // Bottom-left zone
      { x: 6, y: 72, zone: 'bottom-left' as const },
      { x: 12, y: 80, zone: 'bottom-left' as const },
      { x: 3, y: 85, zone: 'bottom-left' as const },
      
      // Bottom-right zone
      { x: 81, y: 75, zone: 'bottom-right' as const },
      { x: 88, y: 82, zone: 'bottom-right' as const },
      { x: 84, y: 88, zone: 'bottom-right' as const },
      
      // Additional spacing positions
      { x: 8, y: 5, zone: 'top-left' as const },
      { x: 75, y: 10, zone: 'top-right' as const },
      { x: 5, y: 68, zone: 'left' as const },
      { x: 90, y: 72, zone: 'right' as const },
      { x: 10, y: 90, zone: 'bottom-left' as const },
      { x: 80, y: 92, zone: 'bottom-right' as const },
    ];
    
    return gridPositions.slice(0, 24); // Use 24 positions
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

  // Create CSS keyframes dynamically
  const style = `
    @keyframes floatMessage {
      0% { opacity: 0; transform: scale(0.7) translateY(0); }
      20% { opacity: 0.85; transform: scale(1) translateY(-5px); }
      40% { opacity: 0.85; transform: scale(1) translateY(-10px); }
      50% { opacity: 0.7; transform: scale(1) translateY(-15px); }
      60% { opacity: 0.85; transform: scale(1) translateY(-10px); }
      80% { opacity: 0.85; transform: scale(1) translateY(-5px); }
      100% { opacity: 0; transform: scale(0.7) translateY(0); }
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {messages.map((msg, index) => {
          // Randomize delay so they don't start at the same time
          const randomDelay = Math.random() * 3;
          // Randomize duration between 6-8 seconds for variety
          const randomDuration = 6 + Math.random() * 2;
          
          return (
            <div
              key={msg.id}
              className="absolute text-primary/75 font-extrabold text-base sm:text-2xl md:text-3xl whitespace-nowrap drop-shadow-lg"
              style={{
                left: `${msg.x}%`,
                top: `${msg.y}%`,
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                animation: `floatMessage ${randomDuration}s ease-in-out ${randomDelay}s infinite`,
              }}
            >
              {msg.text}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FloatingMessages;
