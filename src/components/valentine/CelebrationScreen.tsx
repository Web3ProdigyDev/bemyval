import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle, Globe, Phone, ExternalLink } from 'lucide-react';
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

// Inspired Devs contact information
const INSPIRED_DEVS_WHATSAPP = "+2349019459804";

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

  const whatsappLink = `https://wa.me/${INSPIRED_DEVS_WHATSAPP.replace("+", "")}?text=${encodeURIComponent("Hi Inspired Devs! I saw your Valentine's website and I'd love something similar! 💕")}`;

  return (
    <div className="relative z-10 w-full h-screen flex flex-col overflow-y-auto">
      {/* Floating celebration messages */}
      <FloatingMessages />

      {/* Main Content - Flex column, natural stacking */}
      <main className="w-full flex flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
        <AnimatePresence mode="wait">
          {!showMessage && (
            <motion.div
              key="celebration"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center text-center w-full max-w-xl"
            >
              <motion.div
                className="text-4xl sm:text-5xl md:text-6xl mb-2 will-change-transform"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              >
                🎉💕🎉
              </motion.div>
              <motion.h1
                className="font-romantic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary mb-1 drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {content.celebrationTitle}
              </motion.h1>
              <motion.p
                className="text-sm sm:text-base md:text-lg text-foreground font-medium"
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
              className="flex flex-col items-center w-full max-w-xl"
            >
              {/* Emoji Header */}
              <motion.div
                className="text-2xl sm:text-3xl mb-1 will-change-transform"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                💕
              </motion.div>

              {/* Title */}
              <motion.h2
                className="font-romantic text-lg sm:text-xl md:text-2xl text-primary mb-1 text-center"
              >
                {recipientName ? `${recipientName}, ${content.afterTitle}` : content.fallbackSubtitle}
              </motion.h2>

              {/* Custom message display */}
              {customMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full bg-primary/10 rounded-lg p-2 mb-2 border border-primary/20"
                >
                  <p className="text-foreground italic text-xs sm:text-sm text-center">"{customMessage}"</p>
                </motion.div>
              )}

              {/* Love message text */}
              <motion.p
                className="text-xs text-foreground mb-2 leading-relaxed text-center px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {content.loveMessage}
              </motion.p>

              {/* Video Player - Separate wrapper, fully responsive */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full mb-2"
              >
                <CelebrationVideoPlayer />
              </motion.div>

              {/* Text Container - All copy below the video */}
              <div className="flex flex-col items-center text-center w-full space-y-1">
                {/* Closing message */}
                <motion.p
                  className="text-sm sm:text-base md:text-lg text-primary font-semibold"
                >
                  {content.closing}{recipientName ? `, ${recipientName}` : ""}
                </motion.p>

                {/* With all my love message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs sm:text-sm text-foreground/80 font-medium"
                >
                  With all my love! 🌹
                </motion.p>

                {/* Sender reveal */}
                {senderName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-1 border-t border-primary/20 w-full max-w-xs"
                  >
                    <p className="text-xs text-foreground">
                      With love from <span className="text-primary font-bold">{senderName}</span> 💝
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Proper section, not floating */}
      <AnimatePresence>
        {showContact && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
            className="w-full py-2 px-3 sm:px-4 mb-1"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              {/* WhatsApp Floating Button - Only if sender has phone */}
              {senderName && (
                <motion.a
                  href={`https://wa.me/${INSPIRED_DEVS_WHATSAPP.replace("+", "")}?text=${encodeURIComponent(`Hi! I received a Valentine's surprise from ${senderName} and I love your work! 💕`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 bg-[#25D366] text-white rounded-full p-3 shadow-valentine flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.15, boxShadow: "0 8px 30px rgba(37, 211, 102, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  title="Contact via WhatsApp"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.div>
                </motion.a>
              )}

              {/* Contact Card */}
              <motion.div
                className="flex flex-col items-center justify-center gap-2 bg-card/80 backdrop-blur-md border border-primary/30 rounded-xl px-3 py-2 shadow-valentine w-full max-w-sm will-change-transform"
                animate={{
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              >
                <span className="text-primary/70 text-xs font-medium">
                  Made with 💕 by Inspired Devs
                </span>
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <a
                    href="https://inspireddevs.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-xs font-bold transition-colors flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Website</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={`https://wa.me/${INSPIRED_DEVS_WHATSAPP.replace("+", "")}?text=${encodeURIComponent("Hi Inspired Devs! I love your Valentine's website! 💕")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] hover:text-[#128C7E] text-xs font-bold transition-colors flex items-center gap-1 bg-[#25D366]/10 px-2 py-1 rounded-lg hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Chat</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
