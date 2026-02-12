import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Share2 } from 'lucide-react';

export interface ActionButtonsHandle {
  play: () => void;
  pause: () => void;
}

interface ActionButtonsProps {
  showShareButton?: boolean;
  onShareClick?: () => void;
}

const ActionButtons = forwardRef<ActionButtonsHandle, ActionButtonsProps>(
  ({ showShareButton = false, onShareClick }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showEntrance, setShowEntrance] = useState(false);
    const [entranceComplete, setEntranceComplete] = useState(false);

    // Show entrance animation when share button first appears
    useEffect(() => {
      if (showShareButton && !entranceComplete) {
        setShowEntrance(true);
        // After 3.5 seconds (text 2s + shrink/move 1.5s), hide entrance and show permanent button
        const timer = setTimeout(() => {
          setShowEntrance(false);
          setEntranceComplete(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    }, [showShareButton, entranceComplete]);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (audioRef.current) {
          audioRef.current.volume = 0.3;
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      },
    }));

    const toggleMute = () => {
      if (audioRef.current) {
        if (!isPlaying) {
          audioRef.current.volume = 0.3;
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(!isMuted);
      }
    };

    return (
      <>
        {/* Background Music */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="/audio/bg-music.mp3"
        />

        {/* Share Button Entrance Animation - Center of screen with typewriter effect */}
        <AnimatePresence>
          {showShareButton && showEntrance && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                className="bg-valentine-gradient text-primary-foreground px-8 py-6 rounded-full shadow-2xl flex flex-col items-center gap-4 pointer-events-auto cursor-pointer font-bold"
                onClick={onShareClick}
                initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="text-5xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Share2 className="w-12 h-12" />
                </motion.span>
                
                {/* Typewriter text */}
                <motion.h3 className="text-xl sm:text-2xl text-center">
                  <motion.span className="inline-block">
                    {"You can also share this with someone".split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.04 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.span>
                </motion.h3>

                {/* Shrink and move to top-right after text finishes (2s + 0.2s buffer) */}
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 1,
                    scale: 0.5,
                  }}
                  transition={{
                    delay: 2.2,
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Button - Fixed top-right, permanent after entrance animation */}
        <AnimatePresence>
          {showShareButton && entranceComplete && (
            <motion.button
              onClick={onShareClick}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-valentine-gradient text-primary-foreground px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-valentine flex items-center gap-2.5 font-bold text-sm sm:text-base"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -6, 0, -3, 0],
                x: [0, 4, 0, -4, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { type: "spring", stiffness: 300, damping: 15 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{ scale: 1.1, boxShadow: "0 8px 30px rgba(255, 107, 138, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.span>
              <span>Share the Love</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mute Button - Fixed bottom-right */}
        <AnimatePresence>
          {isPlaying && (
            <motion.button
              onClick={toggleMute}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-card/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-valentine border border-border hover:bg-card transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              title={isMuted ? "Unmute music" : "Mute music"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              ) : (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </motion.div>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </>
    );
  }
);

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
