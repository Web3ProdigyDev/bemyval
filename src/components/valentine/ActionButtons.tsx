import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Heart, Share2 } from 'lucide-react';

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
          audioRef.current.currentTime = 0; // Start from beginning
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(true)); // Mark as playing even if promise fails
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

        {/* Share Button - Fixed top-right, eye-catching floating animation */}
        <AnimatePresence>
          {showShareButton && (
            <motion.button
              onClick={onShareClick}
              className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 bg-valentine-gradient text-primary-foreground px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-valentine flex items-center gap-1.5 font-bold text-xs sm:text-sm"
              initial={{ opacity: 0, scale: 0, y: -20 }}
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
              title="Share this love surprise with someone special"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              </motion.span>
              <span className="whitespace-nowrap">Share the Love</span>
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
