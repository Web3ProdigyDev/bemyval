import { useEffect, useRef } from 'react';

interface VisitorData {
  screen: string;
  action: string;
  recipientName?: string;
  senderName?: string;
  noCount?: number;
}

// Lightweight, non-intrusive visitor tracking
// Gracefully degrades if database is unavailable
export const useVisitorTracking = () => {
  const sessionId = useRef<string>('');
  const hasTrackedVisit = useRef(false);
  const screenHistory = useRef<string[]>([]);

  useEffect(() => {
    // Generate unique session ID
    sessionId.current = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
  }, []);

  const trackEvent = (data: VisitorData) => {
    // Don't track duplicate page views in same session
    if (data.action === 'page_view' && hasTrackedVisit.current) return;
    
    // Track screen
    if (data.screen && !screenHistory.current.includes(data.screen)) {
      screenHistory.current.push(data.screen);
    }

    // Track locally first - always succeeds
    storeLocalAnalytics(data.action);
    
    if (data.action === 'page_view') {
      hasTrackedVisit.current = true;
    }


  };

  const storeLocalAnalytics = (action: string) => {
    try {
      const analyticsKey = 'valentine_analytics';
      const existing = localStorage.getItem(analyticsKey);
      const analytics = existing ? JSON.parse(existing) : { visits: 0, yeses: 0, shares: 0, sessions: [] };
      
      if (action === 'page_view') {
        analytics.visits++;
      } else if (action === 'said_yes') {
        analytics.yeses++;
      } else if (action === 'shared') {
        analytics.shares++;
      }
      
      analytics.sessions.push({
        sessionId: sessionId.current,
        timestamp: new Date().toISOString(),
        action
      });

      localStorage.setItem(analyticsKey, JSON.stringify(analytics));
    } catch (e) {
      // LocalStorage might be full or disabled - ignore
    }
  };

  const trackPageView = () => trackEvent({ screen: 'giftbox', action: 'page_view' });
  const trackYes = () => trackEvent({ screen: 'question', action: 'said_yes' });
  const trackShare = () => trackEvent({ screen: 'celebration', action: 'shared' });
  const trackScreenChange = (screen: string) => trackEvent({ screen, action: 'screen_view' });
  const trackNoCount = (count: number) => trackEvent({ screen: 'question', action: 'page_view', noCount: count });

  return {
    trackPageView,
    trackYes,
    trackShare,
    trackScreenChange,
    trackNoCount,
    sessionId: sessionId.current,
  };
};

export default useVisitorTracking;
