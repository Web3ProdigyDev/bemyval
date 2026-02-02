import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import VisitorForm from '@/components/valentine/VisitorForm';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';
import BackgroundMusic from '@/components/valentine/BackgroundMusic';
import ShareDialog from '@/components/valentine/ShareDialog';

type Screen = 'form' | 'question' | 'celebration';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [currentScreen, setCurrentScreen] = useState<Screen>('form');
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Get recipient name and custom message from URL if present
  const recipientName = searchParams.get('to') || undefined;
  const customMessage = searchParams.get('msg') || undefined;

  // If there's a recipient name in URL, skip the form
  useEffect(() => {
    if (recipientName) {
      setCurrentScreen('question');
    }
  }, [recipientName]);

  return (
    <div className="min-h-screen bg-blush-gradient overflow-hidden relative">
      {/* Background Music */}
      <BackgroundMusic />

      {/* Floating Hearts Background */}
      <FloatingHearts />

      {/* Share Button - Only show when not on form */}
      {currentScreen !== 'form' && !recipientName && (
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
        {currentScreen === 'form' && !recipientName && (
          <VisitorForm 
            key="form"
            onComplete={() => setCurrentScreen('question')} 
          />
        )}
        {currentScreen === 'question' && (
          <ValentineQuestion 
            key="question"
            onYesClick={() => setCurrentScreen('celebration')}
            recipientName={recipientName}
            customMessage={customMessage}
          />
        )}
        {currentScreen === 'celebration' && (
          <CelebrationScreen 
            key="celebration" 
            recipientName={recipientName}
            customMessage={customMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
