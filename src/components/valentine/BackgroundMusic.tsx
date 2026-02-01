import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = 0.25;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay was blocked
          });
      }
    };

    // Try to play on any user interaction
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (!hasInteracted) {
        setHasInteracted(true);
        audioRef.current.volume = 0.25;
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
      {/* Background Music - Romantic track */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      {/* Mute/Unmute Button - Responsive positioning */}
      <motion.button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-card/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-valentine border border-border hover:bg-card transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        title={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        ) : (
          <motion.div
            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </motion.div>
        )}
      </motion.button>

      {/* Hint to enable sound - Responsive */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 2 }}
            className="fixed bottom-4 right-14 sm:bottom-6 sm:right-20 z-50 bg-card/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Music className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.span>
            <span className="hidden xs:inline">Tap for music</span>
            <span className="xs:hidden">🎵</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackgroundMusic;
