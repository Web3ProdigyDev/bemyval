import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle, ExternalLink } from 'lucide-react';
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

      {/* Developer Credit Card - More visible but elegant */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 w-full max-w-sm px-4"
          >
            {/* Lovely message */}
            <motion.p
              className="text-center text-muted-foreground text-sm mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ✨ Want to make someone's heart flutter too? ✨
            </motion.p>

            <motion.div
              className="bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-5 shadow-lg"
              whileHover={{ scale: 1.02, borderColor: 'hsl(var(--primary) / 0.4)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-4">
                <p className="text-primary font-bold text-lg mb-1">
                  Inspired Devs 💕
                </p>
                <p className="text-muted-foreground text-sm">
                  We craft magical digital experiences for love
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-2.5 px-4 rounded-full text-sm hover:bg-[#1da851] transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </motion.a>

                <motion.a
                  href="https://inspireddevs.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary/10 text-primary font-semibold py-2.5 px-4 rounded-full text-sm hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Our Website
                </motion.a>
              </div>

              <p className="text-center text-muted-foreground/60 text-xs mt-3">
                📞 +234 901 945 9804
              </p>
            </motion.div>

            {/* Subtle credit */}
            <motion.p
              className="text-center text-muted-foreground/40 text-xs mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              crafted with 💕 by Inspired Devs
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
