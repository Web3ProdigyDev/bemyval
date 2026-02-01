import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import confetti from 'canvas-confetti';

interface ValentineQuestionProps {
  onYesClick: () => void;
  recipientName?: string;
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

const ValentineQuestion = ({ onYesClick, recipientName }: ValentineQuestionProps) => {
  const isMobile = useIsMobile();
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showDoubleYes, setShowDoubleYes] = useState(false);

  const yesScale = Math.min(1 + escapeCount * 0.18, 2.2);
  const noScale = Math.max(1 - escapeCount * 0.12, 0.4);

  const displayName = recipientName || "You";

  // Mini confetti burst when No escapes
  const burstConfetti = useCallback(() => {
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
      scalar: 0.6,
      gravity: 0.8,
    });
  }, []);

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
    
    burstConfetti();
    
    setTimeout(() => setShowMessage(false), 1200);
  }, [burstConfetti]);

  useEffect(() => {
    if (escapeCount >= 5) {
      setShowDoubleYes(true);
      // Celebration confetti when both yes buttons appear
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b8a', '#ff1744', '#ff8a65', '#ffc1e3'],
      });
    }
  }, [escapeCount]);

  const handleNoInteraction = () => {
    moveNoButton();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      {/* Personalized greeting */}
      {recipientName && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <motion.p
            className="text-xl sm:text-2xl text-foreground font-medium"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Hey <span className="text-primary font-bold">{recipientName}</span>! 👋
          </motion.p>
        </motion.div>
      )}

      {/* Main Question */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.6 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="font-romantic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary mb-4 drop-shadow-lg"
          animate={{ 
            scale: [1, 1.03, 1],
            textShadow: [
              "0 0 20px rgba(255,107,138,0.5)",
              "0 0 40px rgba(255,107,138,0.8)",
              "0 0 20px rgba(255,107,138,0.5)",
            ],
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
          className="text-5xl sm:text-6xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 10, -10, 5, -5, 0],
            y: [0, -10, 0],
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
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -30, rotate: 10 }}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-card text-card-foreground px-8 py-4 rounded-2xl shadow-valentine text-2xl font-bold z-50 border-2 border-primary/20"
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, repeat: 3 }}
            >
              {currentMessage}
            </motion.span>
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
              className="bg-valentine-gradient text-primary-foreground font-bold py-4 px-10 rounded-full shadow-valentine relative overflow-hidden"
              initial={{ scale: 1 }}
              animate={{ 
                scale: yesScale,
                boxShadow: `0 0 ${20 + escapeCount * 8}px hsl(var(--primary) / ${0.4 + escapeCount * 0.08})`,
              }}
              whileHover={{ scale: yesScale * 1.1 }}
              whileTap={{ scale: yesScale * 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="text-xl sm:text-2xl relative z-10">Yes 💖</span>
            </motion.button>

            {/* No Button */}
            <motion.button
              className="bg-muted text-muted-foreground font-bold py-3 px-8 rounded-full relative"
              animate={{ 
                x: noPosition.x, 
                y: noPosition.y,
                scale: noScale,
                opacity: Math.max(noScale, 0.5),
                rotate: escapeCount * 5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
              className="bg-valentine-gradient text-primary-foreground font-bold py-6 px-14 rounded-full shadow-valentine relative overflow-hidden"
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 30px hsl(var(--primary) / 0.5)",
                  "0 0 50px hsl(var(--primary) / 0.8)",
                  "0 0 30px hsl(var(--primary) / 0.5)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-2xl sm:text-3xl relative z-10">Yes 💖</span>
            </motion.button>
            
            <motion.button
              onClick={onYesClick}
              className="bg-valentine-gradient text-primary-foreground font-bold py-6 px-14 rounded-full shadow-valentine relative overflow-hidden"
              animate={{ 
                rotate: [3, -3, 3],
                y: [0, -5, 0],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
              <span className="text-2xl sm:text-3xl relative z-10">Absolutely Yes! 💕</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Hint text */}
      {escapeCount > 0 && escapeCount < 5 && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-foreground text-center font-medium"
        >
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            The Yes button is getting bigger... just saying! 😏
          </motion.span>
        </motion.p>
      )}

      {showDoubleYes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <motion.p 
            className="text-foreground text-xl font-medium"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            There's no escape now, {displayName}! 🥰
          </motion.p>
          <motion.div
            className="text-3xl mt-2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            💘
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ValentineQuestion;
