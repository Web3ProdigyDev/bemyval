import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ValentineQuestionProps {
  onYesClick: () => void;
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
];

const ValentineQuestion = ({ onYesClick }: ValentineQuestionProps) => {
  const isMobile = useIsMobile();
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showDoubleYes, setShowDoubleYes] = useState(false);

  const yesScale = Math.min(1 + escapeCount * 0.15, 2);
  const noScale = Math.max(1 - escapeCount * 0.1, 0.5);

  const moveNoButton = useCallback(() => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 100;
    
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;

    setNoPosition({ x: newX, y: newY });
    setEscapeCount((prev) => prev + 1);
    
    // Show funny message
    const randomMessage = noButtonMessages[Math.floor(Math.random() * noButtonMessages.length)];
    setCurrentMessage(randomMessage);
    setShowMessage(true);
    
    setTimeout(() => setShowMessage(false), 1000);
  }, []);

  useEffect(() => {
    if (escapeCount >= 5) {
      setShowDoubleYes(true);
    }
  }, [escapeCount]);

  const handleNoInteraction = () => {
    moveNoButton();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Main Question */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="font-romantic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-4"
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Will You Be My Valentine?
        </motion.h1>
        <motion.div
          className="text-5xl sm:text-6xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
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
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-card text-card-foreground px-6 py-3 rounded-full shadow-valentine text-xl font-bold z-50"
          >
            {currentMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
        {!showDoubleYes ? (
          <>
            {/* Yes Button */}
            <motion.button
              onClick={onYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-4 px-10 rounded-full shadow-valentine glow-valentine"
              initial={{ scale: 1 }}
              animate={{ 
                scale: yesScale,
              }}
              whileHover={{ scale: yesScale * 1.1 }}
              whileTap={{ scale: yesScale * 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                boxShadow: escapeCount > 2 
                  ? `0 0 ${30 + escapeCount * 10}px hsl(var(--primary) / ${0.4 + escapeCount * 0.1})`
                  : undefined
              }}
            >
              <span className="text-xl sm:text-2xl">Yes 💖</span>
            </motion.button>

            {/* No Button */}
            <motion.button
              className="bg-muted text-muted-foreground font-bold py-3 px-8 rounded-full"
              animate={{ 
                x: noPosition.x, 
                y: noPosition.y,
                scale: noScale,
                opacity: noScale,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onMouseEnter={!isMobile ? handleNoInteraction : undefined}
              onClick={isMobile ? handleNoInteraction : undefined}
              whileHover={!isMobile ? {} : undefined}
            >
              <span className="text-lg">No 😢</span>
            </motion.button>
          </>
        ) : (
          /* Double Yes Buttons */
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <motion.button
              onClick={onYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-5 px-12 rounded-full shadow-valentine animate-pulse-glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl sm:text-3xl">Yes 💖</span>
            </motion.button>
            
            <motion.button
              onClick={onYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-5 px-12 rounded-full shadow-valentine animate-pulse-glow"
              initial={{ rotate: -5 }}
              animate={{ rotate: [5, -5, 5] }}
              transition={{ duration: 1, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl sm:text-3xl">Absolutely Yes! 💕</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Hint text */}
      {escapeCount > 0 && escapeCount < 5 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-muted-foreground text-center"
        >
          The Yes button is getting bigger... just saying! 😏
        </motion.p>
      )}

      {showDoubleYes && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-foreground text-xl text-center font-medium"
        >
          There's no escape now! 🥰
        </motion.p>
      )}
    </div>
  );
};

export default ValentineQuestion;
