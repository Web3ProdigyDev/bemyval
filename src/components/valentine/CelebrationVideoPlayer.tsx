import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type VideoPhase = 'video2-1' | 'video2-2' | 'video3';

const CelebrationVideoPlayer = () => {
  const [currentPhase, setCurrentPhase] = useState<VideoPhase>('video2-1');
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSources: Record<VideoPhase, string> = {
    'video2-1': '/videos/video2.mp4',
    'video2-2': '/videos/video2.mp4',
    'video3': '/videos/video3.mp4',
  };

  const handleVideoEnd = useCallback(() => {
    switch (currentPhase) {
      case 'video2-1':
        setCurrentPhase('video2-2');
        break;
      case 'video2-2':
        setCurrentPhase('video3');
        break;
      case 'video3':
        // Loop video3
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
        break;
    }
  }, [currentPhase]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, [currentPhase]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Video wrapper - fully responsive */}
      <div className="w-full rounded-2xl overflow-hidden shadow-valentine border-2 border-primary/20 bg-muted">
        <video
          ref={videoRef}
          src={videoSources[currentPhase]}
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={handleVideoEnd}
          className="w-full h-auto aspect-[4/5] object-cover"
        />
      </div>
    </motion.div>
  );
};

export default CelebrationVideoPlayer;
