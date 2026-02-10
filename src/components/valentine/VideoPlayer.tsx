import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Timeout: if video can't play within 8s, show poster fallback
    const timeout = setTimeout(() => {
      if (video.readyState < 3) {
        setHasError(true);
      }
    }, 8000);

    video.play().catch(() => {});

    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-[260px] mx-auto"
    >
      <div className="w-full rounded-2xl overflow-hidden shadow-valentine border-2 border-primary/20 bg-muted">
        {hasError ? (
          <div className="w-full aspect-[3/4] flex items-center justify-center bg-primary/10 text-4xl">
            💕🎥
          </div>
        ) : (
          <video
            ref={videoRef}
            src="/videos/video1.mp4"
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            className="w-full h-auto aspect-[3/4] object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
