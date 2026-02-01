import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {
          // Autoplay was blocked, user needs to click
        });
      }
    };

    // Try to play on any user interaction
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (!hasInteracted) {
        setHasInteracted(true);
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {});
      }
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {/* Background Music - Romantic Piano Loop */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0ef98ba9e.mp3"
      />

      {/* Mute/Unmute Button */}
      <motion.button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 bg-card/90 backdrop-blur-sm p-3 rounded-full shadow-valentine border border-border hover:bg-card transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        title={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary" />
        )}
      </motion.button>

      {/* Hint to enable sound */}
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-6 right-20 z-50 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm text-muted-foreground"
        >
          🎵 Tap for music
        </motion.div>
      )}
    </>
  );
};

export default BackgroundMusic;
