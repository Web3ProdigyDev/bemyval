import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import confetti from 'canvas-confetti';
import { playBounceSound, playSuccessSound } from '@/lib/romanticSounds';
import { 
  getRandomItem, 
  noButtonMessages, 
  mainQuestionTexts,
  yesButtonTexts,
  doubleYesTexts,
  hintAfterEscapeTexts,
  noEscapePhrases 
} from '@/lib/randomContent';
import VideoPlayer from './VideoPlayer';

interface ValentineQuestionProps {
  onYesClick: () => void;
  recipientName?: string;
  customMessage?: string;
  senderName?: string;
}

const ValentineQuestion = ({ onYesClick, recipientName, customMessage, senderName }: ValentineQuestionProps) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showDoubleYes, setShowDoubleYes] = useState(false);

  // Random content - memoized
  const content = useMemo(() => ({
    mainQuestion: getRandomItem(mainQuestionTexts),
    yesButton: getRandomItem(yesButtonTexts),
    doubleYes: getRandomItem(doubleYesTexts),
    hintText: getRandomItem(hintAfterEscapeTexts),
    noEscape: getRandomItem(noEscapePhrases),
  }), []);

  const yesScale = Math.min(1 + escapeCount * 0.15, 2);
  const noScale = Math.max(1 - escapeCount * 0.1, 0.5);

  const displayName = recipientName || "You";

  const handleYesClick = useCallback(() => {
    playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
    });
    onYesClick();
  }, [onYesClick]);

  const moveNoButton = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const padding = isMobile ? 40 : 60;
    
    const maxX = Math.min(rect.width / 2 - padding, 150);
    const maxY = Math.min(rect.height / 2 - padding, 100);
    
    const newX = (Math.random() * 2 - 1) * maxX;
    const newY = (Math.random() * 2 - 1) * maxY;

    setNoPosition({ x: newX, y: newY });
    setEscapeCount((prev) => prev + 1);
    
    playBounceSound();
    
    const randomMessage = getRandomItem(noButtonMessages);
    setCurrentMessage(randomMessage);
    setShowMessage(true);
    
    confetti({
      particleCount: 8,
      spread: 30,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ff6b8a', '#ffc1e3'],
      scalar: 0.5,
    });
    
    setTimeout(() => setShowMessage(false), 1000);
  }, [isMobile]);

  useEffect(() => {
    if (escapeCount >= 5) {
      setShowDoubleYes(true);
      playSuccessSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff6b8a', '#ff1744', '#ffc1e3'],
      });
    }
  }, [escapeCount]);

  // Build personalized question
  const questionText = recipientName 
    ? content.mainQuestion.replace(/You/gi, recipientName).replace(/My/gi, 'My')
    : content.mainQuestion;

  return (
    <div 
      ref={containerRef} 
      className="relative z-10 flex flex-col min-h-screen px-3 py-4 sm:px-4 sm:py-6 overflow-x-hidden"
    >
      {/* Main Content - Flex column, natural stacking */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        {/* Personalized greeting */}
        {recipientName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-1"
          >
            <p className="text-base sm:text-lg text-foreground font-medium">
              Hey <span className="text-primary font-bold">{recipientName}</span>! 👋
            </p>
          </motion.div>
        )}

        {/* Sender Name */}
        {senderName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-center mb-1"
          >
            <p className="text-xs sm:text-sm text-muted-foreground">
              From <span className="text-primary font-semibold">{senderName}</span> 💌
            </p>
          </motion.div>
        )}

        {/* Custom Message */}
        {customMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-center mb-2 w-full"
          >
            <p className="text-sm sm:text-base text-foreground/80 italic">
              "{customMessage}"
            </p>
          </motion.div>
        )}

        {/* Main Question */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-3 w-full"
        >
          <motion.h1
            className="font-romantic text-lg sm:text-2xl md:text-3xl lg:text-4xl text-primary mb-1 drop-shadow-lg leading-snug"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {questionText}
          </motion.h1>
          <motion.div
            className="text-2xl sm:text-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              y: [0, -6, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💕
          </motion.div>
        </motion.div>

        {/* Video Player - Separate wrapper, fully responsive */}
        <div className="w-full mb-2">
          <VideoPlayer />
        </div>

        {/* Funny message popup */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="fixed top-[20%] left-1/2 transform -translate-x-1/2 bg-card text-card-foreground px-6 py-3 rounded-2xl shadow-valentine text-xl font-bold z-50 border-2 border-primary/20"
            >
              {currentMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons Container - Flexbox with gap */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full mt-1">
          {!showDoubleYes ? (
            <>
              {/* Yes Button */}
              <motion.button
                onClick={handleYesClick}
                className="bg-valentine-gradient text-primary-foreground font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-valentine relative overflow-hidden text-sm sm:text-base"
                style={{ transform: `scale(${yesScale})` }}
                whileHover={{ scale: yesScale * 1.08 }}
                whileTap={{ scale: yesScale * 0.95 }}
              >
                <span className="relative z-10">{content.yesButton}</span>
              </motion.button>

              {/* No Button */}
              <motion.button
                type="button"
                className="bg-muted text-muted-foreground font-bold py-2 px-4 rounded-full text-sm"
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                  opacity: Math.max(noScale, 0.6),
                }}
                onMouseEnter={!isMobile ? (e) => moveNoButton(e) : undefined}
                onTouchStart={isMobile ? (e) => moveNoButton(e) : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  moveNoButton(e);
                }}
              >
                <span>No 😢</span>
              </motion.button>
            </>
          ) : (
            /* Double Yes Buttons */
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center"
            >
              <motion.button
                onClick={handleYesClick}
                className="bg-valentine-gradient text-primary-foreground font-bold py-2.5 px-6 rounded-full shadow-valentine text-sm sm:text-base"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{content.doubleYes[0]}</span>
              </motion.button>
              
              <motion.button
                onClick={handleYesClick}
                className="bg-valentine-gradient text-primary-foreground font-bold py-2.5 px-6 rounded-full shadow-valentine text-sm sm:text-base"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{content.doubleYes[1]}</span>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Hint text */}
        {escapeCount > 0 && escapeCount < 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-foreground text-center font-medium text-xs sm:text-sm"
          >
            {content.hintText}
          </motion.p>
        )}

        {showDoubleYes && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-foreground text-sm sm:text-base font-medium text-center"
          >
            {content.noEscape.replace(/!/, `, ${displayName}!`)}
          </motion.p>
        )}
      </main>
    </div>
  );
};

export default ValentineQuestion;
