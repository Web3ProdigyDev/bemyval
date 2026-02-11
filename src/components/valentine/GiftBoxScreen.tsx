import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playGiftOpenSound } from '@/lib/romanticSounds';
import { getRandomItem, giftBoxTitles, giftBoxSubtitles } from '@/lib/randomContent';

interface GiftBoxScreenProps {
  onOpen: () => void;
}

const GiftBoxScreen = ({ onOpen }: GiftBoxScreenProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Random content - memoized so it doesn't change on re-renders
  const content = useMemo(() => ({
    title: getRandomItem(giftBoxTitles),
    subtitle: getRandomItem(giftBoxSubtitles),
  }), []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    
    // Play romantic chime sound
    playGiftOpenSound();
    
    setTimeout(() => {
      onOpen();
    }, 1200);
  }, [isOpening, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-6"
    >
      {/* Mysterious title - NOT Valentine themed */}
      <motion.h1
        className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {content.title}
      </motion.h1>
      
      <motion.p
        className="text-muted-foreground text-center text-xs sm:text-sm mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {content.subtitle}
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
              className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg will-change-transform pointer-events-none"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
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
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl will-change-transform"
                animate={!isOpening ? { 
                  scale: [1, 1.05, 1],
                } : {
                  scale: 1.3,
                  opacity: 0
                }}
                transition={isOpening ? { duration: 0.5 } : { duration: 2.5, repeat: Infinity }}
              >
                🎀
              </motion.div>
            </div>
          </motion.div>

          {/* Sparkles when opening */}
          <AnimatePresence>
            {isOpening && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 text-lg sm:text-xl will-change-transform"
                    style={{
                      x: Math.cos((i / 8) * Math.PI * 2) * (70 + (i % 2) * 20),
                      y: Math.sin((i / 8) * Math.PI * 2) * (70 + (i % 2) * 20) - 40,
                    }}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.2,
                    }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  >
                    {['✨', '⭐', '🌟'][i % 3]}
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
            className="mt-4 text-muted-foreground text-xs sm:text-sm flex items-center gap-2"
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
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-base pointer-events-none will-change-transform"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [-8, 8, -8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut"
          }}
        >
          {['✨', '⭐'][i % 2]}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GiftBoxScreen;
