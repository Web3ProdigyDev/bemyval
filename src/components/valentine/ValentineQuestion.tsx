import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import confetti from 'canvas-confetti';

interface ValentineQuestionProps {
  onYesClick: () => void;
  recipientName?: string;
  customMessage?: string;
}

const noButtonMessages = [
  "Nope! 😜",
  "Can't catch me! 💨",
  "Try again! 😏",
  "Too slow! 🏃",
  "Hehe! 😂",
  "Nice try! 😎",
  "Almost! 🤭",
  "Keep trying! 💪",
  "Whoops! 🙈",
  "Not today! 😝",
];

// Sound effects using Web Audio API
const playBounceSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    // Audio not supported
  }
};

const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
      
      oscillator.start(audioContext.currentTime + i * 0.1);
      oscillator.stop(audioContext.currentTime + i * 0.1 + 0.3);
    });
  } catch (e) {
    // Audio not supported
  }
};

const ValentineQuestion = ({ onYesClick, recipientName, customMessage }: ValentineQuestionProps) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showDoubleYes, setShowDoubleYes] = useState(false);

  const yesScale = Math.min(1 + escapeCount * 0.15, 2);
  const noScale = Math.max(1 - escapeCount * 0.1, 0.5);

  const displayName = recipientName || "You";

  const handleYesClick = useCallback(() => {
    playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
    });
    onYesClick();
  }, [onYesClick]);

  const moveNoButton = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    // Prevent any default behavior
    e?.preventDefault();
    e?.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const padding = isMobile ? 40 : 60;
    
    // Calculate random position within container bounds
    const maxX = Math.min(rect.width / 2 - padding, 150);
    const maxY = Math.min(rect.height / 2 - padding, 100);
    
    const newX = (Math.random() * 2 - 1) * maxX;
    const newY = (Math.random() * 2 - 1) * maxY;

    setNoPosition({ x: newX, y: newY });
    setEscapeCount((prev) => prev + 1);
    
    // Play sound
    playBounceSound();
    
    // Show funny message
    const randomMessage = noButtonMessages[Math.floor(Math.random() * noButtonMessages.length)];
    setCurrentMessage(randomMessage);
    setShowMessage(true);
    
    // Small confetti burst
    confetti({
      particleCount: 8,
      spread: 30,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ff6b8a', '#ffc1e3'],
      scalar: 0.5,
    });
    
    setTimeout(() => setShowMessage(false), 1000);
  }, [isMobile]);

  useEffect(() => {
    if (escapeCount >= 5) {
      setShowDoubleYes(true);
      playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
      });
    }
  }, [escapeCount]);

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Personalized greeting */}
      {recipientName && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <p className="text-lg sm:text-xl text-foreground font-medium">
            Hey <span className="text-primary font-bold">{recipientName}</span>! 👋
          </p>
        </motion.div>
      )}

      {/* Custom Message */}
      {customMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-4 max-w-md"
        >
          <p className="text-base sm:text-lg text-foreground/80 italic">
            "{customMessage}"
          </p>
        </motion.div>
      )}

      {/* Main Question */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-8 sm:mb-10 px-2"
      >
        <motion.h1
          className="font-romantic text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary mb-3 drop-shadow-lg leading-tight"
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {recipientName ? (
            <>Will {recipientName} Be My Valentine?</>
          ) : (
            <>Will You Be My Valentine?</>
          )}
        </motion.h1>
        <motion.div
          className="text-4xl sm:text-5xl"
          animate={{ 
            scale: [1, 1.2, 1],
            y: [0, -8, 0],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💕
        </motion.div>
      </motion.div>

      {/* Funny message popup */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed top-[20%] left-1/2 transform -translate-x-1/2 bg-card text-card-foreground px-6 py-3 rounded-2xl shadow-valentine text-xl font-bold z-50 border-2 border-primary/20"
          >
            {currentMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full max-w-lg">
        {!showDoubleYes ? (
          <>
            {/* Yes Button */}
            <motion.button
              onClick={handleYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-3 px-8 rounded-full shadow-valentine relative overflow-hidden"
              style={{ transform: `scale(${yesScale})` }}
              whileHover={{ scale: yesScale * 1.08 }}
              whileTap={{ scale: yesScale * 0.95 }}
            >
              <span className="text-lg sm:text-xl relative z-10">Yes 💖</span>
            </motion.button>

            {/* No Button - Fixed: no page refresh */}
            <motion.button
              type="button"
              className="bg-muted text-muted-foreground font-bold py-2.5 px-6 rounded-full"
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                opacity: Math.max(noScale, 0.6),
              }}
              onMouseEnter={!isMobile ? (e) => moveNoButton(e) : undefined}
              onTouchStart={isMobile ? (e) => moveNoButton(e) : undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                moveNoButton(e);
              }}
            >
              <span className="text-base">No 😢</span>
            </motion.button>
          </>
        ) : (
          /* Double Yes Buttons */
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <motion.button
              onClick={handleYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-4 px-10 rounded-full shadow-valentine"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl relative z-10">Yes 💖</span>
            </motion.button>
            
            <motion.button
              onClick={handleYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-4 px-10 rounded-full shadow-valentine"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl relative z-10">Absolutely Yes! 💕</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Hint text */}
      {escapeCount > 0 && escapeCount < 5 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-foreground text-center font-medium text-sm px-4"
        >
          The Yes button is getting bigger... just saying! 😏
        </motion.p>
      )}

      {showDoubleYes && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-foreground text-lg font-medium text-center"
        >
          There's no escape now, {displayName}! 🥰
        </motion.p>
      )}
    </div>
  );
};

export default ValentineQuestion;
