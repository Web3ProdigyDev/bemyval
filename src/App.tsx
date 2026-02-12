import { useState, useRef, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import GiftBoxScreen from '@/components/valentine/GiftBoxScreen';
import EnvelopeScreen from '@/components/valentine/EnvelopeScreen';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';
import ActionButtons, { ActionButtonsHandle } from '@/components/valentine/ActionButtons';
import ShareDialog from '@/components/valentine/ShareDialog';
import CursorSparkles from '@/components/valentine/CursorSparkles';
import FloatingMessages from '@/components/valentine/FloatingMessages';
import useVisitorTracking from '@/hooks/useVisitorTracking';
import useMediaPreloader from '@/hooks/useMediaPreloader';

type Screen = 'giftbox' | 'envelope' | 'question' | 'celebration';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('giftbox');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [customWish, setCustomWish] = useState<CustomWish | null>(null);
  const actionButtonsRef = useRef<ActionButtonsHandle>(null);
  const { trackPageView, trackYes, trackShare, trackScreenChange } = useVisitorTracking();
  
  // Preload all media assets on mount
  useMediaPreloader();

  // Fetch custom wishes on mount
  useEffect(() => {
    const fetchCustomWish = async () => {
      try {
        // Try to get the default wish or first wish
        const { data } = await supabase
          .from('custom_wishes')
          .select('*')
          .eq('is_default', true)
          .single();

        if (data) {
          setCustomWish(data as CustomWish);
        } else {
          // If no default, get the first wish
          const { data: allData } = await supabase
            .from('custom_wishes')
            .select('*')
            .limit(1)
            .single();
          if (allData) {
            setCustomWish(allData as CustomWish);
          }
        }
      } catch (error) {
        console.log('[v0] Using default wish - custom wishes not available');
      }
    };

    fetchCustomWish();
  }, []);

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
  }, [currentScreen, trackScreenChange, trackYes]);

  // Parse URL params using standard URLSearchParams
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const recipientName = params.get('to') ? decodeParam(params.get('to')!) : undefined;
    const customMessage = params.get('msg') ? decodeParam(params.get('msg')!) : undefined;
    const senderName = params.get('from') ? decodeParam(params.get('from')!) : undefined;
    return { recipientName, customMessage, senderName };
  }, []);

  const handleMusicStart = () => {
    setShowHearts(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 overflow-hidden">
      {/* Animated background */}
      <FloatingHearts />
      <FloatingMessages />
      <CursorSparkles />

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
            customWish={customWish}
          />
        )}
        {currentScreen === 'question' && (
          <ValentineQuestion 
            key="question"
            onYesClick={() => setCurrentScreen('celebration')}
            recipientName={urlParams.recipientName}
            customMessage={urlParams.customMessage}
            senderName={urlParams.senderName}
            customWish={customWish}
          />
        )}
        {currentScreen === 'celebration' && (
          <CelebrationScreen 
            key="celebration" 
            recipientName={urlParams.recipientName}
            customMessage={urlParams.customMessage}
            senderName={urlParams.senderName}
            customWish={customWish}
          />
        )}
      </AnimatePresence>

      {/* Action Buttons - Fixed at bottom */}
      <ActionButtons 
        ref={actionButtonsRef}
        onShareClick={() => setShowShareDialog(true)}
        showShareButton={currentScreen === 'celebration'}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        recipientName={urlParams.recipientName}
        customMessage={urlParams.customMessage}
        senderName={urlParams.senderName}
      />
    </div>
  );
}
