import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle, Globe, Phone } from 'lucide-react';
import {
  getRandomItem,
  celebrationTitles,
  celebrationSubtitles,
  afterCelebrationTitles,
  fallbackSubtitles,
  loveMessages,
  valentineClosings
} from '@/lib/randomContent';
import { playConfettiSound } from '@/lib/romanticSounds';
import FloatingMessages from './FloatingMessages';
import CelebrationVideoPlayer from './CelebrationVideoPlayer';

interface CelebrationScreenProps {
  recipientName?: string;
  customMessage?: string;
  senderName?: string;
}

const CelebrationScreen = ({ recipientName, customMessage, senderName }: CelebrationScreenProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const displayName = recipientName || "you";

  // Random content - memoized
  const content = useMemo(() => ({
    celebrationTitle: getRandomItem(celebrationTitles),
    celebrationSubtitle: getRandomItem(celebrationSubtitles),
    afterTitle: getRandomItem(afterCelebrationTitles),
    fallbackSubtitle: getRandomItem(fallbackSubtitles),
    loveMessage: getRandomItem(loveMessages),
    closing: getRandomItem(valentineClosings),
  }), []);

  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    // Play initial confetti sound
    playConfettiSound();

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 25 * (timeLeft / duration);
      
      // Play sound on each burst
      if (Math.random() > 0.6) {
        playConfettiSound();
      }

      confetti({
        particleCount: Math.floor(particleCount),
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
      });

      confetti({
        particleCount: Math.floor(particleCount),
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
      });
    }, 200);

    setTimeout(() => setShowMessage(true), 2500);
    setTimeout(() => setShowContact(true), 6000);

    return () => clearInterval(interval);
  }, []);

  const whatsappLink = `https://wa.me/2349019459804?text=${encodeURIComponent("Hi Inspired Devs! I saw your Valentine's website and I'd love something similar! 💕")}`;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {/* Floating celebration messages */}
      <FloatingMessages />
      <AnimatePresence mode="wait">
        {!showMessage && (
          <motion.div
            key="celebration"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center px-4"
          >
            <motion.div
              className="text-6xl sm:text-7xl mb-4"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🎉💕🎉
            </motion.div>
            <motion.h1
              className="font-romantic text-4xl sm:text-5xl md:text-6xl text-primary mb-3 drop-shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              {content.celebrationTitle}
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-foreground font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {content.celebrationSubtitle.replace(/you/gi, displayName === "you" ? "you" : recipientName || "you")}
            </motion.p>
          </motion.div>
        )}

        {showMessage && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl px-4"
          >
            <motion.div
              className="text-5xl mb-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.div>
            <motion.h2 
              className="font-romantic text-2xl sm:text-3xl md:text-4xl text-primary mb-3"
            >
              {recipientName ? `${recipientName}, ${content.afterTitle}` : content.fallbackSubtitle}
            </motion.h2>

            {/* Custom message display */}
            {customMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-primary/10 rounded-xl p-3 mb-3 border border-primary/20"
              >
                <p className="text-foreground italic text-base sm:text-lg">"{customMessage}"</p>
              </motion.div>
            )}

            <motion.p 
              className="text-sm sm:text-base md:text-lg text-foreground mb-2 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {content.loveMessage}
            </motion.p>
            
            {/* Video Player - Celebration Videos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-4"
            >
              <CelebrationVideoPlayer />
            </motion.div>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-primary font-semibold"
            >
              {content.closing}{recipientName ? `, ${recipientName}` : ""}
            </motion.p>

            {/* Sender reveal */}
            {senderName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-3 pt-3 border-t border-primary/20"
              >
                <p className="text-sm sm:text-base text-foreground">
                  With love from <span className="text-primary font-bold">{senderName}</span> 💝
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Credit - Enhanced visibility with animation */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 120,
              damping: 15,
              duration: 0.8 
            }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2"
          >
            <motion.div
              className="flex items-center gap-3 bg-card/80 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 shadow-valentine"
              animate={{
                boxShadow: [
                  "0 4px 20px rgba(255, 107, 138, 0.2)",
                  "0 4px 30px rgba(255, 107, 138, 0.35)",
                  "0 4px 20px rgba(255, 107, 138, 0.2)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <motion.span 
                className="text-primary/70 text-xs sm:text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ✨ Made with love by
              </motion.span>
              <motion.a
                href="https://inspireddevs.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.08 }}
              >
                <Globe className="w-3.5 h-3.5" />
                Inspired Devs
              </motion.a>
              <motion.span 
                className="text-primary/30"
              >
                •
              </motion.span>
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-[#128C7E] transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium"
                whileHover={{ scale: 1.08 }}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chat with us</span>
              </motion.a>
              <motion.a
                href="tel:+2349019459804"
                className="text-primary/70 hover:text-primary transition-colors flex items-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Phone className="w-3.5 h-3.5" />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
