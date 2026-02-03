// Romantic sound effects using Web Audio API

// Soft, melodic chime for gift box opening
export const playGiftOpenSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a magical chime sequence
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99]; // C5, E5, G5, C6, G5
    
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const startTime = audioContext.currentTime + i * 0.12;
      oscillator.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
    
    // Add a soft shimmer overlay
    const shimmer = audioContext.createOscillator();
    const shimmerGain = audioContext.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(1200, audioContext.currentTime);
    shimmer.frequency.exponentialRampToValueAtTime(2400, audioContext.currentTime + 0.3);
    shimmerGain.gain.setValueAtTime(0.05, audioContext.currentTime);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(audioContext.destination);
    shimmer.start();
    shimmer.stop(audioContext.currentTime + 0.5);
    
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Gentle, romantic envelope opening sound
export const playEnvelopeOpenSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Soft rising melody for the reveal
    const notes = [392, 440, 523.25, 587.33, 659.25]; // G4, A4, C5, D5, E5
    
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      const startTime = audioContext.currentTime + i * 0.15;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
    
    // Add a gentle "reveal" sweep
    const sweep = audioContext.createOscillator();
    const sweepGain = audioContext.createGain();
    sweep.type = 'triangle';
    sweep.frequency.setValueAtTime(200, audioContext.currentTime);
    sweep.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.4);
    sweepGain.gain.setValueAtTime(0.03, audioContext.currentTime);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    sweep.connect(sweepGain);
    sweepGain.connect(audioContext.destination);
    sweep.start();
    sweep.stop(audioContext.currentTime + 0.5);
    
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Playful bounce for No button escape
export const playBounceSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Quick playful boop
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(600, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.12);
    
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Triumphant sound for Yes click
export const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Happy ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (C major)
    
    notes.forEach((freq, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      const startTime = audioContext.currentTime + i * 0.1;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
    
    // Add sparkle on top
    setTimeout(() => {
      const sparkle = audioContext.createOscillator();
      const sparkleGain = audioContext.createGain();
      sparkle.type = 'triangle';
      sparkle.frequency.setValueAtTime(2000, audioContext.currentTime);
      sparkle.frequency.exponentialRampToValueAtTime(3000, audioContext.currentTime + 0.2);
      sparkleGain.gain.setValueAtTime(0.05, audioContext.currentTime);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      sparkle.connect(sparkleGain);
      sparkleGain.connect(audioContext.destination);
      sparkle.start();
      sparkle.stop(audioContext.currentTime + 0.3);
    }, 300);
    
  } catch (e) {
    console.log('Audio not supported');
  }
};
