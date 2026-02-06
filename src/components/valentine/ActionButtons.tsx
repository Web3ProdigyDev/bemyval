import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Send } from 'lucide-react';

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

        {/* Buttons Container - Flexbox with gap, proper stacking */}
        <AnimatePresence>
          {(isPlaying || showShareButton) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-row items-center gap-3"
            >
              {/* Share Button */}
              {showShareButton && (
                <motion.button
                  onClick={onShareClick}
                  className="bg-valentine-gradient text-primary-foreground px-4 py-2.5 rounded-full shadow-valentine flex items-center gap-2 font-semibold text-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255, 107, 138, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.span>
                  <span className="hidden sm:inline">Share the Love</span>
                  <motion.span
                    className="text-xs"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💕
                  </motion.span>
                </motion.button>
              )}

              {/* Mute Button */}
              {isPlaying && (
                <motion.button
                  onClick={toggleMute}
                  className="bg-card/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-valentine border border-border hover:bg-card transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
