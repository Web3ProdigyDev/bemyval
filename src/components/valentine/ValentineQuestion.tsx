import { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
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

interface CustomWish {
  id: string;
  title: string;
  subtitle: string;
  main_message: string;
  heart_message: string;
  love_message: string;
  footer_message: string;
  website_name: string;
}

interface ValentineQuestionProps {
  onYesClick: () => void;
  recipientName?: string;
  customMessage?: string;
  senderName?: string;
  customWish?: CustomWish | null;
}

const ValentineQuestion = ({ onYesClick, recipientName, customMessage, senderName, customWish }: ValentineQuestionProps) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Random content - memoized
  const content = useMemo(() => ({
    mainQuestion: getRandomItem(mainQuestionTexts),
    yesButton: getRandomItem(yesButtonTexts),
    doubleYes: getRandomItem(doubleYesTexts),
    hintText: getRandomItem(hintAfterEscapeTexts),
    noEscape: getRandomItem(noEscapePhrases),
  }), []);

  const yesScale = Math.min(1 + escapeCount * 0.15, 2.0);
  // Hide No button after 4 escapes - it lands on top of Yes on the 4th
  const showNoButton = escapeCount < 4;

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

    const currentCount = escapeCount + 1;
    
    // On 4th click, No button is on top of Yes - clicking it means Yes!
    if (currentCount >= 4) {
      handleYesClick();
      return;
    }

    // Keep button in safe visible zones - tighter constraints
    const rect = container.getBoundingClientRect();
    const padding = isMobile ? 40 : 60;
    
    // Constrain to visible safe area in center of screen
    const maxX = Math.min(rect.width / 4, 80);
    const maxY = Math.min(rect.height / 4, 60);
    
    const newX = (Math.random() * 2 - 1) * maxX;
    const newY = (Math.random() * 2 - 1) * maxY;

    setNoPosition({ x: newX, y: newY });

    // On 3rd click, move No button on top of Yes button
    if (currentCount === 3) {
      setNoPosition({ x: 0, y: 0 });
    }

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
  }, [escapeCount, isMobile, handleYesClick]);



  // Build personalized question
  const questionText = recipientName 
    ? content.mainQuestion.replace(/You/gi, recipientName).replace(/My/gi, 'My')
    : content.mainQuestion;

  return (
    <div 
      ref={containerRef} 
      className="relative z-10 w-full h-screen flex flex-col px-3 py-4 sm:px-4 sm:py-6 overflow-x-hidden overflow-y-auto"
    >
      {/* Main Content - Flex column, natural stacking */}
      <main className="w-full max-w-lg mx-auto gap-2 flex flex-col items-center justify-center">
        {/* Personalized greeting */}
        {recipientName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center -mt-2"
          >
            <p className="text-sm sm:text-base text-foreground font-medium">
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
            className="text-center -mt-1"
          >
            <p className="text-xs text-muted-foreground">
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
            className="text-center w-full -mt-1"
          >
            <p className="text-xs sm:text-sm text-foreground/80 italic px-2">
              "{customMessage}"
            </p>
          </motion.div>
        )}

        {/* Main Question */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center w-full -mt-2"
        >
          <motion.h1
            className="font-romantic text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary mb-0.5 drop-shadow-lg leading-tight"
            animate={{ 
              scale: [1, 1.01, 1],
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {questionText}
          </motion.h1>
          <motion.div
            className="text-xl sm:text-2xl will-change-transform"
            animate={{ 
              scale: [1, 1.15, 1],
              y: [0, -5, 0],
            }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            💕
          </motion.div>
        </motion.div>

        {/* Video Player - Separate wrapper, fully responsive */}
        <div className="w-full -my-1">
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

        {/* Buttons Container - Flexbox with gap - responsive sizing */}
        <div className="flex flex-row gap-2 sm:gap-3 items-center justify-center w-full mt-0">
          {/* Yes Button */}
          <motion.button
            onClick={handleYesClick}
            className="bg-valentine-gradient text-primary-foreground font-bold py-1.5 px-4 sm:py-2.5 sm:px-7 rounded-full shadow-valentine relative overflow-hidden text-xs sm:text-base whitespace-nowrap"
            style={{ transform: `scale(${yesScale})` }}
            whileHover={{ scale: yesScale * 1.08 }}
            whileTap={{ scale: yesScale * 0.95 }}
          >
            <span className="relative z-10">{content.yesButton}</span>
          </motion.button>

          {/* No Button - moves on top of Yes after 3 clicks, clicking it = Yes */}
          {showNoButton && (
            <motion.button
              type="button"
              className="bg-muted text-muted-foreground font-bold py-1.5 px-4 sm:py-2 sm:px-5 rounded-full transition-all text-xs sm:text-sm whitespace-nowrap"
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
              }}
              onMouseEnter={!isMobile ? moveNoButton : undefined}
              onTouchStart={isMobile ? moveNoButton : undefined}
              onClick={moveNoButton}
            >
              <span>No 😢</span>
            </motion.button>
          )}
        </div>

        {/* Hint text */}
        {escapeCount > 0 && escapeCount < 4 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-0.5 text-foreground text-center font-medium text-xs"
          >
            {content.hintText}
          </motion.p>
        )}
      </main>
    </div>
  );
};

export default ValentineQuestion;
