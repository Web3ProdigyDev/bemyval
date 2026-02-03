import { useState, useRef, useMemo } from 'react';
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

  return (
    <div className={`min-h-screen overflow-hidden relative transition-colors duration-1000 ${
      showHearts ? 'bg-blush-gradient' : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
    }`}>
      {/* Background Music - controlled programmatically */}
      <BackgroundMusic ref={musicRef} />

      {/* Floating Hearts Background - only show after envelope opens */}
      {showHearts && <FloatingHearts />}

      {/* Share Button - Show on all screens, labeled "Send Love" */}
      <motion.button
        onClick={() => setShowShareDialog(true)}
        className="fixed bottom-6 right-6 z-50 bg-valentine-gradient text-primary-foreground px-4 py-2.5 rounded-full shadow-valentine flex items-center gap-2 font-semibold text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">Send Love</span>
        <Heart className="w-4 h-4 sm:hidden" />
      </motion.button>

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
