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
  senderPhone?: string;
}

const CelebrationScreen = ({ recipientName, customMessage, senderName, senderPhone }: CelebrationScreenProps) => {
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
  
  // Format phone number for WhatsApp (remove spaces, dashes, parentheses)
  const formatPhoneForWhatsApp = (phone: string): string => {
    return phone.replace(/[\s\-()]/g, '').replace(/^\+?/, '');
  };
  
  const senderWhatsappLink = senderPhone 
    ? `https://wa.me/${formatPhoneForWhatsApp(senderPhone)}?text=${encodeURIComponent(`Hi ${senderName}! Thanks for the Valentine's surprise! 💕`)}`
    : null;

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {/* Floating celebration messages */}
      <FloatingMessages />
      
      {/* Floating WhatsApp Contact Button - if sender phone available */}
      <AnimatePresence>
        {senderPhone && senderWhatsappLink && (
          <motion.a
            href={senderWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1 }}
            className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors cursor-pointer"
            whileHover={{ scale: 1.1, boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            title="Contact your wisher on WhatsApp"
          >
            <motion.svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </motion.svg>
            <span className="text-sm font-semibold hidden sm:inline">Contact Wisher</span>
            <span className="sm:hidden text-xs">Contact</span>
          </motion.a>
        )}
      </AnimatePresence>
      
      {/* Main Content - Flex column, natural stacking */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-6">
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
                className="text-3xl sm:text-4xl md:text-5xl mb-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎉💕🎉
              </motion.div>
              <motion.h1
                className="font-romantic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary mb-2 drop-shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
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
                className="text-3xl sm:text-4xl mb-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💕
              </motion.div>

              {/* Title */}
              <motion.h2 
                className="font-romantic text-lg sm:text-xl md:text-2xl text-primary mb-2 text-center"
              >
                {recipientName ? `${recipientName}, ${content.afterTitle}` : content.fallbackSubtitle}
              </motion.h2>

              {/* Custom message display */}
              {customMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full bg-primary/10 rounded-xl p-3 mb-3 border border-primary/20"
                >
                  <p className="text-foreground italic text-xs sm:text-sm text-center">"{customMessage}"</p>
                </motion.div>
              )}

              {/* Love message text */}
              <motion.p 
                className="text-xs sm:text-sm md:text-base text-foreground mb-3 leading-relaxed text-center px-2"
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
              <div className="flex flex-col items-center text-center w-full space-y-2">
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
                    className="pt-2 border-t border-primary/20 w-full max-w-xs"
                  >
                    <p className="text-xs sm:text-sm text-foreground">
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
            className="w-full py-2 px-3"
          >
            <div className="flex flex-col items-center justify-center">
            <motion.div
                className="flex flex-wrap items-center justify-center gap-2 bg-card/80 backdrop-blur-md border border-primary/30 rounded-xl px-3 py-2 shadow-valentine text-xs sm:text-sm"
                animate={{
                  x: [0, -3, 3, -2, 2, 0],
                  rotate: [0, -1.5, 1.5, -1, 1, 0],
                  boxShadow: [
                    "0 4px 20px rgba(255, 107, 138, 0.2)",
                    "0 4px 35px rgba(255, 107, 138, 0.5)",
                    "0 4px 20px rgba(255, 107, 138, 0.2)",
                  ],
                  scale: [1, 1.02, 1, 1.01, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <span className="text-primary/70 font-medium hidden sm:inline">
                  ✨ Made with love by
                </span>
                <motion.a
                  href="https://inspireddevs.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Inspired Devs</span>
                  <span className="sm:hidden">Devs</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </motion.div>
                </motion.a>
                <span className="text-primary/30 hidden sm:inline">•</span>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:text-[#128C7E] transition-colors flex items-center gap-1 font-medium"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Chat</span>
                </a>
                <a
                  href="tel:+2349019459804"
                  className="text-primary/70 hover:text-primary transition-colors flex items-center"
                >
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              </motion.div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationScreen;
