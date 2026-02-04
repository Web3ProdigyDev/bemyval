import { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Send } from 'lucide-react';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import GiftBoxScreen from '@/components/valentine/GiftBoxScreen';
import EnvelopeScreen from '@/components/valentine/EnvelopeScreen';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';
import BackgroundMusic, { BackgroundMusicHandle } from '@/components/valentine/BackgroundMusic';
import ShareDialog from '@/components/valentine/ShareDialog';
import CursorSparkles from '@/components/valentine/CursorSparkles';
import useVisitorTracking from '@/hooks/useVisitorTracking';

type Screen = 'giftbox' | 'envelope' | 'question' | 'celebration';

// Decode URL params (reverse of encodeParam in ShareDialog)
const decodeParam = (str: string): string => {
  try {
    // Restore base64 padding and chars
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return decodeURIComponent(atob(base64));
  } catch {
    // Fallback: try direct decode (old format)
    try {
      return decodeURIComponent(str);
    } catch {
      return str;
    }
  }
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState<Screen>('giftbox');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const musicRef = useRef<BackgroundMusicHandle>(null);
  const { trackPageView, trackYes, trackShare, trackScreenChange } = useVisitorTracking();

  // Track page view on mount
  useEffect(() => {
    trackPageView();
  }, []);

  // Track screen changes
  useEffect(() => {
    trackScreenChange(currentScreen);
    if (currentScreen === 'celebration') {
      trackYes();
    }
  }, [currentScreen]);

  // Parse URL parameters - support both old and new encoded format
  const urlParams = useMemo(() => {
    // Try new encoded format first (r, m, s)
    let recipientName = searchParams.get('r') ? decodeParam(searchParams.get('r')!) : null;
    let customMessage = searchParams.get('m') ? decodeParam(searchParams.get('m')!) : null;
    let senderName = searchParams.get('s') ? decodeParam(searchParams.get('s')!) : null;
    
    // Fallback to old format (to, msg, from)
    if (!recipientName) recipientName = searchParams.get('to');
    if (!customMessage) customMessage = searchParams.get('msg');
    if (!senderName) senderName = searchParams.get('from');
    
    return {
      recipientName: recipientName || undefined,
      customMessage: customMessage || undefined,
      senderName: senderName || undefined,
    };
  }, [searchParams]);

  // Start music when envelope opens
  const handleMusicStart = () => {
    musicRef.current?.play();
    setShowHearts(true); // Show valentine hearts when music starts
  };

  // Handle share dialog with tracking
  const handleShareClick = () => {
    trackShare();
    setShowShareDialog(true);
  };

  return (
    <div className={`min-h-screen overflow-hidden relative transition-colors duration-1000 ${
      showHearts ? 'bg-blush-gradient' : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
    }`}>
      {/* Cursor Sparkles Effect */}
      <CursorSparkles />

      {/* Background Music - controlled programmatically */}
      <BackgroundMusic ref={musicRef} />

      {/* Floating Hearts Background - only show after envelope opens */}
      {showHearts && <FloatingHearts />}

      {/* Share Button - only shows on celebration screen with enhanced animation */}
      <AnimatePresence>
        {currentScreen === 'celebration' && (
          <motion.button
            onClick={handleShareClick}
            className="fixed top-4 right-4 z-50 bg-valentine-gradient text-primary-foreground px-4 py-2 rounded-full shadow-valentine flex items-center gap-2 font-semibold text-sm"
            initial={{ opacity: 0, scale: 0, y: -20, rotate: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              rotate: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ 
              delay: 3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ scale: 1.08, boxShadow: "0 8px 25px rgba(255, 107, 138, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Send className="w-4 h-4" />
            </motion.span>
            <span>Share the Love</span>
            <motion.span
              className="text-xs"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              💕
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Share Dialog */}
      <ShareDialog 
        isOpen={showShareDialog} 
        onClose={() => setShowShareDialog(false)} 
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentScreen === 'giftbox' && (
          <GiftBoxScreen 
            key="giftbox"
            onOpen={() => setCurrentScreen('envelope')} 
          />
        )}
        {currentScreen === 'envelope' && (
          <EnvelopeScreen 
            key="envelope"
            onOpen={() => setCurrentScreen('question')}
            onMusicStart={handleMusicStart}
            recipientName={urlParams.recipientName}
          />
        )}
        {currentScreen === 'question' && (
          <ValentineQuestion 
            key="question"
            onYesClick={() => setCurrentScreen('celebration')}
            recipientName={urlParams.recipientName}
            customMessage={urlParams.customMessage}
            senderName={urlParams.senderName}
          />
        )}
        {currentScreen === 'celebration' && (
          <CelebrationScreen 
            key="celebration" 
            recipientName={urlParams.recipientName}
            customMessage={urlParams.customMessage}
            senderName={urlParams.senderName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
