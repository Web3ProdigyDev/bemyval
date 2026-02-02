import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export interface BackgroundMusicHandle {
  play: () => void;
  pause: () => void;
}

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(
  ({ autoPlay = false }, ref) => {
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

        {/* Only show control when music has started */}
        {isPlaying && (
          <motion.button
            onClick={toggleMute}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-card/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-valentine border border-border hover:bg-card transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
      </>
    );
  }
);

BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;
