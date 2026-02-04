import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle } from 'lucide-react';
import {
  getRandomItem,
  celebrationTitles,
  celebrationSubtitles,
  afterCelebrationTitles,
  fallbackSubtitles,
  loveMessages,
  valentineClosings
} from '@/lib/randomContent';

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

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 25 * (timeLeft / duration);

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
    setTimeout(() => setShowContact(true), 5000);

    return () => clearInterval(interval);
  }, []);

  const whatsappLink = `https://wa.me/2349019459804?text=${encodeURIComponent("Hi Inspired Devs! I saw your Valentine's website and I'd love something similar for my special someone! 💕")}`;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
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
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.div>
            <motion.h2 
              className="font-romantic text-3xl sm:text-4xl text-primary mb-4"
            >
              {recipientName ? `${recipientName}, ${content.afterTitle}` : content.fallbackSubtitle}
            </motion.h2>

            {/* Custom message display */}
            {customMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-primary/10 rounded-xl p-4 mb-4 border border-primary/20"
              >
                <p className="text-foreground italic text-lg">"{customMessage}"</p>
              </motion.div>
            )}

            <motion.p 
              className="text-base sm:text-lg text-foreground mb-3 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {content.loveMessage}
            </motion.p>
            <motion.p 
              className="text-xl sm:text-2xl text-primary font-semibold"
            >
              {content.closing}{recipientName ? `, ${recipientName}` : ""}
            </motion.p>

            {/* Sender reveal */}
            {senderName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-primary/20"
              >
                <p className="text-base text-foreground">
                  With love from <span className="text-primary font-bold">{senderName}</span> 💝
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Developer Credit - Subtle footer */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2"
          >
            <motion.div
              className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border/30 rounded-full px-4 py-2 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-muted-foreground/60 text-xs">made with ✨ by</span>
              <a
                href="https://inspireddevs.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/80 hover:text-primary text-xs font-medium transition-colors"
              >
                Inspired Devs
              </a>
              <span className="text-muted-foreground/30">•</span>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366]/80 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
