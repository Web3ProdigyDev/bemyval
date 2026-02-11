import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playEnvelopeOpenSound } from '@/lib/romanticSounds';
import { getRandomItem, envelopeTitles, envelopeRevealTitles, letterPreviewTexts } from '@/lib/randomContent';

interface EnvelopeScreenProps {
  onOpen: () => void;
  onMusicStart: () => void;
  recipientName?: string;
}

const EnvelopeScreen = ({ onOpen, onMusicStart, recipientName }: EnvelopeScreenProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showVolumeHint, setShowVolumeHint] = useState(true);

  // Random content - memoized
  const content = useMemo(() => ({
    title: getRandomItem(envelopeTitles),
    revealTitle: getRandomItem(envelopeRevealTitles),
    letterPreview: getRandomItem(letterPreviewTexts),
  }), []);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);
    setShowVolumeHint(false);
    
    // Start music immediately when envelope opens
    onMusicStart();
    
    // Play romantic envelope sound
    playEnvelopeOpenSound();
    
    // Show letter rising
    setTimeout(() => {
      setShowLetter(true);
    }, 600);
    
    // Proceed to valentine question
    setTimeout(() => {
      onOpen();
    }, 2500);
  }, [isOpening, onMusicStart, onOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ type: "spring", bounce: 0.3 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-6 overflow-x-hidden"
    >
      {/* Title changes when opening */}
      <motion.h1
        className="text-lg sm:text-2xl md:text-3xl font-bold text-center mb-2 px-2"
        animate={{ 
          color: isOpening ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
        }}
      >
        {isOpening ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {content.revealTitle}
          </motion.span>
        ) : (
          content.title
        )}
      </motion.h1>

      {recipientName && (
        <motion.p
          className="text-base sm:text-lg text-muted-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Dear <span className="text-primary font-semibold">{recipientName}</span>
        </motion.p>
      )}

      {/* Envelope Container */}
      <motion.div
        className="relative cursor-pointer mt-2"
        onClick={handleOpen}
        whileHover={!isOpening ? { scale: 1.03, y: -5 } : {}}
        whileTap={!isOpening ? { scale: 0.98 } : {}}
      >
        {/* Shadow */}
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/15 rounded-full blur-xl will-change-transform"
          animate={isOpening ? { opacity: 0, scale: 1.5 } : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: isOpening ? 0 : Infinity }}
        />

        {/* Envelope */}
        <motion.div
          className="relative w-64 h-44 sm:w-80 sm:h-56 md:w-96 md:h-64"
          animate={isOpening ? { y: 20 } : {}}
        >
          {/* Envelope body */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-100 to-rose-200 rounded-lg shadow-xl overflow-hidden">
            {/* Inner shadow */}
            <div className="absolute inset-2 bg-gradient-to-b from-rose-50 to-rose-100 rounded" />
            
            {/* Heart seal */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-4xl sm:text-5xl will-change-transform"
              animate={isOpening ? { 
                scale: [1, 1.3, 0],
                opacity: 0 
              } : { 
                scale: [1, 1.1, 1]
              }}
              transition={isOpening ? { duration: 0.5 } : { duration: 2, repeat: Infinity }}
            >
              💌
            </motion.div>
          </div>

          {/* Envelope flap */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 origin-top"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            animate={isOpening ? { rotateX: 180 } : {}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div 
              className="w-full h-full bg-gradient-to-b from-rose-300 to-rose-200 rounded-t-lg"
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              }}
            />
            {/* Flap inner side (visible when opened) */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-rose-400 to-rose-300 rounded-t-lg"
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>

          {/* Letter rising from envelope */}
          <AnimatePresence>
            {showLetter && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-lg shadow-lg p-4 sm:p-6 z-30"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -120, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
              >
                {/* Letter content preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <motion.p
                    className="text-primary font-romantic text-xl sm:text-2xl md:text-3xl"
                    animate={{
                      textShadow: [
                        "0 0 8px rgba(255,107,138,0.2)",
                        "0 0 15px rgba(255,107,138,0.4)",
                        "0 0 8px rgba(255,107,138,0.2)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {content.letterPreview}
                  </motion.p>
                  
                  <motion.div
                    className="flex justify-center gap-2 mt-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {['💕', '💖'].map((heart, i) => (
                      <motion.span
                        key={i}
                        className="text-2xl will-change-transform"
                        animate={{ 
                          y: [0, -4, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity, 
                          delay: i * 0.2 
                        }}
                      >
                        {heart}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Volume hint */}
      <AnimatePresence>
        {showVolumeHint && !isOpening && (
          <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-muted-foreground text-xs flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔊
              </motion.span>
              Turn up volume
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              💌
            </motion.span>
            Tap to open the letter
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hearts appear when opening */}
      <AnimatePresence>
        {isOpening && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-lg sm:text-xl pointer-events-none will-change-transform"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 250,
                  y: (Math.random() - 0.5) * 250 - 80,
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0.3],
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.5 + i * 0.06,
                  ease: "easeOut"
                }}
              >
                {['💕', '💖', '💗', '❤️'][i % 4]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnvelopeScreen;
