import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import GiftBoxScreen from '@/components/valentine/GiftBoxScreen';
import EnvelopeScreen from '@/components/valentine/EnvelopeScreen';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';
import BackgroundMusic, { BackgroundMusicHandle } from '@/components/valentine/BackgroundMusic';
import ShareDialog from '@/components/valentine/ShareDialog';

type Screen = 'giftbox' | 'envelope' | 'question' | 'celebration';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState<Screen>('giftbox');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const musicRef = useRef<BackgroundMusicHandle>(null);

  // Get recipient name, custom message, and sender from URL if present
  const recipientName = searchParams.get('to') || undefined;
  const customMessage = searchParams.get('msg') || undefined;
  const senderName = searchParams.get('from') || undefined;

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

      {/* Share Button - Show on question and celebration screens */}
      {(currentScreen === 'question' || currentScreen === 'celebration') && (
        <motion.button
          onClick={() => setShowShareDialog(true)}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 bg-card/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-valentine border border-border hover:bg-card transition-colors flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-foreground pr-1">Share</span>
        </motion.button>
      )}

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
            recipientName={recipientName}
          />
        )}
        {currentScreen === 'question' && (
          <ValentineQuestion 
            key="question"
            onYesClick={() => setCurrentScreen('celebration')}
            recipientName={recipientName}
            customMessage={customMessage}
            senderName={senderName}
          />
        )}
        {currentScreen === 'celebration' && (
          <CelebrationScreen 
            key="celebration" 
            recipientName={recipientName}
            customMessage={customMessage}
            senderName={senderName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
