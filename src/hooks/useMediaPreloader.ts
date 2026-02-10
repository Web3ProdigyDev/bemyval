import { useState, useEffect, useRef } from 'react';

interface PreloadState {
  isReady: boolean;
  progress: number;
  loadedAssets: string[];
}

const MEDIA_ASSETS = {
  video1: '/videos/video1.mp4',
  video2: '/videos/video2.mp4',
  video3: '/videos/video3.mp4',
  music: '/audio/bg-music.mp3',
};

export const useMediaPreloader = () => {
  const [state, setState] = useState<PreloadState>({
    isReady: false,
    progress: 0,
    loadedAssets: [],
  });
  
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const totalAssets = Object.keys(MEDIA_ASSETS).length;
    const loaded: string[] = [];

    const updateProgress = (assetName: string) => {
      if (!loaded.includes(assetName)) {
        loaded.push(assetName);
        const progress = (loaded.length / totalAssets) * 100;
        setState({
          isReady: loaded.length === totalAssets,
          progress,
          loadedAssets: [...loaded],
        });
      }
    };

    // Preload videos with optimized settings for low network
    const preloadVideo = (src: string, name: string) => {
      const video = document.createElement('video');
      video.preload = 'auto'; // Changed to auto for better low-network support
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      
      // Timeout: if not loaded in 3 seconds, count it as loaded anyway (important for low network)
      const timeoutId = setTimeout(() => updateProgress(name), 3000);
      
      const clearTimer = () => clearTimeout(timeoutId);
      video.addEventListener('canplaythrough', () => { clearTimer(); updateProgress(name); }, { once: true });
      video.addEventListener('canplay', () => { clearTimer(); updateProgress(name); }, { once: true }); // Also count canplay
      video.addEventListener('error', () => { clearTimer(); updateProgress(name); }, { once: true });
      
      video.src = src;
      video.load();
    };

    // Preload audio with optimized settings
    const preloadAudio = (src: string, name: string) => {
      const audio = document.createElement('audio');
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      // Timeout: if not loaded in 2 seconds, count it as loaded anyway
      const timeoutId = setTimeout(() => updateProgress(name), 2000);
      
      const clearTimer = () => clearTimeout(timeoutId);
      audio.addEventListener('canplaythrough', () => { clearTimer(); updateProgress(name); }, { once: true });
      audio.addEventListener('canplay', () => { clearTimer(); updateProgress(name); }, { once: true }); // Also count canplay
      audio.addEventListener('error', () => { clearTimer(); updateProgress(name); }, { once: true });
      
      audio.src = src;
      audio.load();
    };

    // Start preloading immediately - music is critical
    preloadAudio(MEDIA_ASSETS.music, 'music');
    preloadVideo(MEDIA_ASSETS.video1, 'video1');
    
    // Load celebration videos with slight delay to prioritize initial assets
    setTimeout(() => {
      preloadVideo(MEDIA_ASSETS.video2, 'video2');
      preloadVideo(MEDIA_ASSETS.video3, 'video3');
    }, 50);

  }, []);

  return state;
};

export default useMediaPreloader;
