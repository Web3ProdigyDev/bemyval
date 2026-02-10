import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type VideoPhase = 'video2-1' | 'video2-2' | 'video3';

const CelebrationVideoPlayer = () => {
  const [currentPhase, setCurrentPhase] = useState<VideoPhase>('video2-1');
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSources: Record<VideoPhase, string> = {
    'video2-1': '/videos/video2.mp4',
    'video2-2': '/videos/video2.mp4',
    'video3': '/videos/video3.mp4',
  };

  const handleVideoEnd = useCallback(() => {
    console.log("[v0] Video ended, currentPhase:", currentPhase);
    switch (currentPhase) {
      case 'video2-1':
        setCurrentPhase('video2-2');
        break;
      case 'video2-2':
        setCurrentPhase('video3');
        break;
      case 'video3':
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(err => console.log("[v0] Play error:", err));
        }
        break;
    }
  }, [currentPhase]);

  const handleError = (e: Event) => {
    console.log("[v0] Video error:", e);
    setHasError(true);
  };

  const handleCanPlay = () => {
    console.log("[v0] Video can play, phase:", currentPhase);
    setHasError(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);

    // Add event listeners
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    // Timeout for slow network
    const timeout = setTimeout(() => {
      if (video.readyState < 3) {
        console.log("[v0] Video timeout - readyState:", video.readyState, "phase:", currentPhase);
        setHasError(true);
      }
    }, 10000);

    video.load();
    video.play().catch((err) => {
      console.log("[v0] Play error:", err);
    });

    return () => {
      clearTimeout(timeout);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentPhase]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[260px] mx-auto"
    >
      <div className="w-full rounded-2xl overflow-hidden shadow-valentine border-2 border-primary/20 bg-muted">
        {hasError ? (
          <div className="w-full aspect-[3/4] flex items-center justify-center bg-primary/10 text-4xl">
            💕🎬
          </div>
        ) : (
          <video
            ref={videoRef}
            src={videoSources[currentPhase]}
            muted
            playsInline
            autoPlay
            preload="auto"
            crossOrigin="anonymous"
            onEnded={handleVideoEnd}
            onError={() => setHasError(true)}
            className="w-full h-auto aspect-[3/4] object-cover"
          />
        )}
      </div>
    </motion.div>
  );
};

export default CelebrationVideoPlayer;
