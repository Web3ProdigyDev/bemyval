import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationScreenProps {
  recipientName?: string;
}

// Different text animation patterns
const textAnimations = [
  { scale: [1, 1.15, 1] },
  { y: [0, -10, 0], scale: [1, 1.1, 1] },
  { rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] },
  { x: [0, 5, -5, 0], scale: [1, 1.1, 1] },
];

const CelebrationScreen = ({ recipientName }: CelebrationScreenProps) => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const displayName = recipientName || "you";

  useEffect(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const heart = confetti.shapeFromPath({
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    });

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff6b8a', '#ff1744', '#ff8a65', '#ffc1e3', '#f50057', '#ffeb3b'],
      shapes: ['circle', heart],
      scalar: 1.2,
    });

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 30 * (timeLeft / duration);

      confetti({
        particleCount: Math.floor(particleCount),
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff6b8a', '#ff1744', '#ffc1e3', '#ffeb3b'],
        shapes: ['circle', heart],
      });

      confetti({
        particleCount: Math.floor(particleCount),
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff6b8a', '#ff1744', '#ffc1e3', '#ffeb3b'],
        shapes: ['circle', heart],
      });

      if (Math.random() > 0.7) {
        confetti({
          particleCount: 20,
          spread: 360,
          origin: { x: randomInRange(0.2, 0.8), y: randomInRange(0.2, 0.6) },
          colors: ['#ff6b8a', '#ff1744', '#ff8a65', '#ffc1e3'],
          scalar: 0.8,
        });
      }
    }, 150);

    setTimeout(() => {
      setShowCelebration(false);
      setShowMessage(true);
    }, 4000);

    setTimeout(() => {
      setShowContact(true);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const whatsappLink = `https://wa.me/2348142659673?text=${encodeURIComponent("Hi Godwin! I saw your Valentine's website and loved it! 💕")}`;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-3 sm:px-4 md:px-6 py-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="text-center px-4"
          >
            <motion.div
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-6"
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              🎉💕🎉
            </motion.div>
            <motion.h1
              className="font-romantic text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary mb-3 sm:mb-4 drop-shadow-lg"
              animate={{
                scale: [1, 1.15, 1],
                textShadow: [
                  "0 0 20px rgba(255,107,138,0.5)",
                  "0 0 60px rgba(255,107,138,1)",
                  "0 0 20px rgba(255,107,138,0.5)",
                ],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              Yay!!!
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              I knew {displayName === "you" ? "you" : recipientName} would say yes! 💖
            </motion.p>
            <motion.div
              className="flex justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl flex-wrap"
            >
              {['💖', '💕', '💗', '💓', '💝'].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {showMessage && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center max-w-2xl px-4"
          >
            <motion.div
              className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.div>
            <motion.h2 
              className="font-romantic text-3xl sm:text-4xl md:text-5xl text-primary mb-4 sm:mb-6"
              animate={textAnimations[0]}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {recipientName ? `${recipientName}, You're Amazing!` : "You Just Made Someone's Day!"}
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-foreground mb-3 sm:mb-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Love is in the air, and {displayName === "you" ? "you" : recipientName} just made this moment magical! 
              Whether it's your first Valentine together or your 50th, 
              may your day be filled with love, laughter, and endless joy. 💖
            </motion.p>
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl text-primary font-semibold"
              animate={textAnimations[1]}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Happy Valentine's Day{recipientName ? `, ${recipientName}` : ""}! 🌹
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Card */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.3 }}
            className="mt-8 sm:mt-12 text-center w-full px-3 sm:px-4"
          >
            <motion.div
              className="bg-card/95 backdrop-blur-md border-2 border-primary/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-valentine max-w-md mx-auto relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.div 
                className="text-3xl sm:text-4xl mb-2 sm:mb-3"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 relative z-10">
                This magical moment was crafted with love...
              </p>
              <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1.5 sm:mb-2 relative z-10">
                Want something special like this for your loved one?
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 relative z-10">
                Custom Valentine's websites, surprise pages, digital love letters & more!
              </p>
              
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg hover:shadow-xl transition-all relative z-10 text-sm sm:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Godwin
              </motion.a>
              
              <motion.p 
                className="text-muted-foreground text-xs mt-3 sm:mt-4 relative z-10"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +234 814 265 9673
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
