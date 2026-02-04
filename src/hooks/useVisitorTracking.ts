import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VisitorData {
  screen: string;
  action: string;
  recipientName?: string;
  senderName?: string;
}

// Lightweight, non-intrusive visitor tracking
export const useVisitorTracking = () => {
  const sessionId = useRef<string>('');
  const hasTrackedVisit = useRef(false);

  useEffect(() => {
    // Generate unique session ID
    sessionId.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const trackEvent = async (data: VisitorData) => {
    // Don't track if already tracked this session for basic visit
    if (data.action === 'page_view' && hasTrackedVisit.current) return;
    
    try {
      // Simple analytics - just increment a counter
      // Using the existing valentine_visitors table structure isn't ideal
      // So we'll use localStorage for basic analytics
      const analyticsKey = 'valentine_analytics';
      const existing = localStorage.getItem(analyticsKey);
      const analytics = existing ? JSON.parse(existing) : { visits: 0, yeses: 0, shares: 0 };
      
      if (data.action === 'page_view') {
        analytics.visits++;
        hasTrackedVisit.current = true;
      } else if (data.action === 'said_yes') {
        analytics.yeses++;
      } else if (data.action === 'shared') {
        analytics.shares++;
      }
      
      localStorage.setItem(analyticsKey, JSON.stringify(analytics));
      
      // Optional: Send to console for debugging (you can remove this)
      console.log('📊 Analytics:', analytics);
    } catch (e) {
      // Silently fail - analytics shouldn't break the experience
    }
  };

  const trackPageView = () => trackEvent({ screen: 'giftbox', action: 'page_view' });
  const trackYes = () => trackEvent({ screen: 'question', action: 'said_yes' });
  const trackShare = () => trackEvent({ screen: 'celebration', action: 'shared' });
  const trackScreenChange = (screen: string) => trackEvent({ screen, action: 'screen_view' });

  return {
    trackPageView,
    trackYes,
    trackShare,
    trackScreenChange,
    sessionId: sessionId.current,
  };
};

export default useVisitorTracking;
