import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const CelebrationScreen = () => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    // Fire confetti
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Heart-shaped confetti
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff6b8a', '#ff1744', '#ff8a65', '#ffc1e3', '#f50057'],
        shapes: ['circle'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff6b8a', '#ff1744', '#ff8a65', '#ffc1e3', '#f50057'],
        shapes: ['circle'],
      });
    }, 250);

    // Show personal message after celebration
    setTimeout(() => {
      setShowCelebration(false);
      setShowMessage(true);
    }, 3500);

    // Show contact card after message
    setTimeout(() => {
      setShowContact(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const whatsappLink = `https://wa.me/2348142659673?text=${encodeURIComponent("Hi Godwin! I saw your Valentine's website and loved it! 💕")}`;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <motion.div
              className="text-6xl sm:text-8xl mb-6"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🎉💕🎉
            </motion.div>
            <motion.h1
              className="font-romantic text-4xl sm:text-6xl md:text-7xl text-primary mb-4"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              Yay!!!
            </motion.h1>
            <motion.p
              className="text-2xl sm:text-3xl text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              I knew you'd say yes! 💖
            </motion.p>
          </motion.div>
        )}

        {showMessage && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center max-w-2xl"
          >
            <motion.div
              className="text-5xl sm:text-6xl mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.div>
            <h2 className="font-romantic text-3xl sm:text-5xl text-primary mb-6">
              You Just Made Someone's Day!
            </h2>
            <p className="text-lg sm:text-xl text-foreground mb-4 leading-relaxed">
              Love is in the air, and you just made this moment magical! 
              Whether it's your first Valentine together or your 50th, 
              may your day be filled with love, laughter, and endless joy. 💖
            </p>
            <p className="text-xl sm:text-2xl text-primary font-semibold">
              Happy Valentine's Day! 🌹
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Card */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
            className="mt-12 text-center"
          >
            <motion.div
              className="bg-card/90 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-valentine max-w-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl mb-3">✨</div>
              <p className="text-muted-foreground text-sm mb-3">
                This magical moment was crafted with love...
              </p>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Want something special like this for your loved one?
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Custom Valentine's websites, surprise pages, digital love letters & more!
              </p>
              
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Godwin
              </motion.a>
              
              <p className="text-muted-foreground text-xs mt-4">
                +234 814 265 9673
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
