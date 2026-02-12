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

    console.log('[v0] Starting media preload. Assets to load:', MEDIA_ASSETS);

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

    // Preload videos - use 'metadata' to avoid downloading full file on slow networks
    const preloadVideo = (src: string, name: string) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      
      const onLoad = () => {
        console.log('[v0] Video loaded:', name);
        updateProgress(name);
      };
      
      const onError = () => {
        console.warn('[v0] Video failed to load:', name, src);
        updateProgress(name); // Count as loaded even on error to not block app
      };
      
      video.addEventListener('canplaythrough', onLoad, { once: true });
      video.addEventListener('error', onError, { once: true });
      
      video.src = src;
      video.load();
    };

    // Preload audio
    const preloadAudio = (src: string, name: string) => {
      const audio = document.createElement('audio');
      audio.preload = 'auto';
      
      const onLoad = () => {
        console.log('[v0] Audio loaded:', name);
        updateProgress(name);
      };
      
      const onError = () => {
        console.warn('[v0] Audio failed to load:', name, src);
        updateProgress(name); // Count as loaded even on error to not block app
      };
      
      audio.addEventListener('canplaythrough', onLoad, { once: true });
      audio.addEventListener('error', onError, { once: true });
      
      audio.src = src;
      audio.load();
    };

    // Start preloading - prioritize video1 and music
    preloadVideo(MEDIA_ASSETS.video1, 'video1');
    preloadAudio(MEDIA_ASSETS.music, 'music');
    
    // Delay loading of celebration videos slightly
    setTimeout(() => {
      preloadVideo(MEDIA_ASSETS.video2, 'video2');
      preloadVideo(MEDIA_ASSETS.video3, 'video3');
    }, 100);

  }, []);

  return state;
};

export default useMediaPreloader;
