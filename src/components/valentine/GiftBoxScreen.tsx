import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GiftBoxScreenProps {
  onOpen: () => void;
}

const GiftBoxScreen = ({ onOpen }: GiftBoxScreenProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Show hint after 2 seconds
  useState(() => {
    const timer = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(timer);
  });

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    
    // Wait for animation then proceed
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
    >
      {/* Mysterious title - NOT Valentine themed */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        You have a surprise! 🎁
      </motion.h1>
      
      <motion.p
        className="text-muted-foreground text-center text-sm sm:text-base mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Someone sent you something special...
      </motion.p>

      {/* Gift Box */}
      <motion.div
        className="relative cursor-pointer"
        onClick={handleOpen}
        whileHover={!isOpening ? { scale: 1.05 } : {}}
        whileTap={!isOpening ? { scale: 0.95 } : {}}
      >
        {/* Box shadow */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/20 rounded-full blur-xl"
          animate={!isOpening ? { scale: [1, 1.1, 1] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Gift box body */}
        <motion.div
          className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
          animate={isOpening ? { scale: 1.1, y: -20 } : {}}
          transition={{ duration: 0.3 }}
        >
          {/* Box base */}
          <motion.div
            className="absolute bottom-0 w-full h-3/4 bg-gradient-to-b from-amber-400 to-amber-500 rounded-lg shadow-lg"
            style={{ perspective: '1000px' }}
          >
            {/* Ribbon vertical */}
            <div className="absolute left-1/2 -translate-x-1/2 w-6 h-full bg-gradient-to-b from-rose-400 to-rose-500" />
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-lg"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Box lid */}
          <motion.div
            className="absolute top-0 w-full h-1/3 origin-bottom"
            animate={isOpening ? { 
              rotateX: -120,
              y: -30,
              opacity: 0
            } : {
              y: [0, -5, 0]
            }}
            transition={isOpening ? { duration: 0.8 } : { duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-b from-amber-300 to-amber-400 rounded-t-lg shadow-lg relative">
              {/* Ribbon horizontal */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400" />
              
              {/* Bow */}
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl"
                animate={!isOpening ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {
                  scale: 1.5,
                  rotate: 180,
                  opacity: 0
                }}
                transition={isOpening ? { duration: 0.5 } : { duration: 2, repeat: Infinity }}
              >
                🎀
              </motion.div>
            </div>
          </motion.div>

          {/* Sparkles when opening */}
          <AnimatePresence>
            {isOpening && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 text-xl sm:text-2xl"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      x: Math.cos((i / 12) * Math.PI * 2) * (80 + Math.random() * 40),
                      y: Math.sin((i / 12) * Math.PI * 2) * (80 + Math.random() * 40) - 50,
                      opacity: [1, 1, 0],
                      scale: [0, 1.5, 0],
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 0.8, delay: i * 0.03 }}
                  >
                    {['✨', '⭐', '🌟', '💫'][i % 4]}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Tap hint */}
      <AnimatePresence>
        {showHint && !isOpening && (
          <motion.p
            className="mt-8 text-muted-foreground text-sm sm:text-base flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              👆
            </motion.span>
            Tap to open!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Subtle floating particles - neutral, not Valentine themed */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg pointer-events-none"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {['✨', '⭐', '🌟'][i % 3]}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GiftBoxScreen;
