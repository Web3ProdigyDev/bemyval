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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto rounded-2xl overflow-hidden shadow-valentine border-2 border-primary/20"
    >
      <video
        ref={videoRef}
        src="/videos/video1.mp4"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="w-full h-auto aspect-[4/5] object-cover"
      />
    </motion.div>
  );
};

export default VideoPlayer;
