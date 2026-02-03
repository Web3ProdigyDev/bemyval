import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationScreenProps {
  recipientName?: string;
  customMessage?: string;
  senderName?: string;
}

const CelebrationScreen = ({ recipientName, customMessage, senderName }: CelebrationScreenProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const displayName = recipientName || "you";

  useEffect(() => {
    // Initial celebration confetti
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

  const whatsappLink = `https://wa.me/2349019459804?text=${encodeURIComponent("Hi! I saw your Valentine's website and I'd love something similar! 💕")}`;

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
              Yay!!!
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-foreground font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              I knew {displayName === "you" ? "you" : recipientName} would say yes! 💖
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
              {recipientName ? `${recipientName}, You're Amazing!` : "You Just Made Someone's Day!"}
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
              Love is in the air! May your day be filled with love, laughter, and endless joy. 💖
            </motion.p>
            <motion.p 
              className="text-xl sm:text-2xl text-primary font-semibold"
            >
              Happy Valentine's Day{recipientName ? `, ${recipientName}` : ""}! 🌹
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

      {/* Contact Card */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 text-center w-full px-4"
          >
            <motion.a
              href="https://inspireddevs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 max-w-xs mx-auto block hover:bg-card/90 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <p className="text-muted-foreground/60 text-[10px] mb-1">
                crafted with 💕
              </p>
              <p className="text-foreground/80 text-xs font-medium">
                Inspired Devs
              </p>
              <p className="text-muted-foreground/50 text-[10px] mt-1">
                inspireddevs.vercel.app
              </p>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
