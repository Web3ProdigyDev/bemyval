import { useState, useRef, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import GiftBoxScreen from '@/components/valentine/GiftBoxScreen';
import EnvelopeScreen from '@/components/valentine/EnvelopeScreen';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';
import ActionButtons, { ActionButtonsHandle } from '@/components/valentine/ActionButtons';
import ShareDialog from '@/components/valentine/ShareDialog';
import CursorSparkles from '@/components/valentine/CursorSparkles';
import useVisitorTracking from '@/hooks/useVisitorTracking';
import useMediaPreloader from '@/hooks/useMediaPreloader';

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
  const actionButtonsRef = useRef<ActionButtonsHandle>(null);
  const { trackPageView, trackYes, trackShare, trackScreenChange } = useVisitorTracking();
  
  // Preload all media assets on mount
  useMediaPreloader();

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
    actionButtonsRef.current?.play();
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

      {/* Action Buttons - Share & Mute grouped together with proper spacing */}
      <ActionButtons 
        ref={actionButtonsRef}
        showShareButton={currentScreen === 'celebration'}
        onShareClick={handleShareClick}
      />

      {/* Floating Hearts Background - only show after envelope opens */}
      {showHearts && <FloatingHearts />}

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
