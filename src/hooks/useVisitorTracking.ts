import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Initialize database record if possible
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      await supabase
        .from('valentine_analytics')
        .insert({
          session_id: sessionId.current,
          page_view: true,
          screen_changes: ['giftbox'],
        })
        .single()
        .catch(() => {
          // Table might not exist yet or DB is down - that's ok
          // We'll try again with next event
        });
    } catch (e) {
      // Silently fail - site should work without analytics
    }
  };

  const trackEvent = async (data: VisitorData) => {
    // Don't track duplicate page views in same session
    if (data.action === 'page_view' && hasTrackedVisit.current) return;
    
    try {
      // Track screen
      if (data.screen && !screenHistory.current.includes(data.screen)) {
        screenHistory.current.push(data.screen);
      }

      // Try to save to database (non-blocking)
      const updateData: any = {
        last_interaction: new Date().toISOString(),
        screen_changes: screenHistory.current,
      };

      if (data.action === 'page_view') {
        updateData.page_view = true;
        hasTrackedVisit.current = true;
      } else if (data.action === 'said_yes') {
        updateData.said_yes = true;
      } else if (data.action === 'shared') {
        updateData.shared = true;
      } else if (data.action === 'screen_view') {
        // Just tracking screen changes
      }

      if (data.recipientName) updateData.recipient_name = data.recipientName;
      if (data.senderName) updateData.sender_name = data.senderName;
      if (data.noCount !== undefined) updateData.said_no_count = data.noCount;

      // Fire and forget - don't wait for response
      supabase
        .from('valentine_analytics')
        .update(updateData)
        .eq('session_id', sessionId.current)
        .then()
        .catch(() => {
          // Database unavailable - that's fine, site continues to work
        });

      // Also store in localStorage as fallback
      storeLocalAnalytics(data.action);
    } catch (e) {
      // Silently fail - analytics shouldn't break the experience
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
