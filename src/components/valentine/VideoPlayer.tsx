import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-[260px] mx-auto"
    >
      {/* Video wrapper - fully responsive, rounded corners */}
      <div className="w-full rounded-2xl overflow-hidden shadow-valentine border-2 border-primary/20 bg-muted">
        <video
          ref={videoRef}
          src="/videos/video1.mp4"
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          className="w-full h-auto aspect-[3/4] object-cover"
        />
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
