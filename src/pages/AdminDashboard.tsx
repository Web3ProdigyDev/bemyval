import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface CustomWish {
  id: string;
  title: string;
  subtitle: string;
  main_message: string;
  heart_message: string;
  love_message: string;
  footer_message: string;
  website_name: string;
  is_default: boolean;
}

interface AnalyticsData {
  totalVisits: number;
  totalYesClicks: number;
  totalShares: number;
  totalInteractions: number;
}

export default function AdminDashboard() {
  const [wishes, setWishes] = useState<CustomWish[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    totalYesClicks: 0,
    totalShares: 0,
    totalInteractions: 0,
  });
  const [activeTab, setActiveTab] = useState<'wishes' | 'analytics'>('wishes');
  const [formData, setFormData] = useState<Partial<CustomWish>>({
    title: '',
    subtitle: '',
    main_message: '',
    heart_message: '',
    love_message: '',
    footer_message: '',
    website_name: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/supersecretadminloginplace';
    } else {
      loadWishes();
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('event_type');

      if (error) throw error;

      const visits = data?.filter(d => d.event_type === 'visit').length || 0;
      const yesClicks = data?.filter(d => d.event_type === 'yes_click').length || 0;
      const shares = data?.filter(d => d.event_type === 'share').length || 0;
      const interactions = data?.filter(d => d.event_type === 'interaction').length || 0;

      setAnalytics({
        totalVisits: visits,
        totalYesClicks: yesClicks,
        totalShares: shares,
        totalInteractions: interactions,
      });
    } catch (error) {
      console.error('[v0] Error loading analytics:', error);
    }
  };

  const loadWishes = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishes(data || []);
    } catch (error) {
      console.error('[v0] Error loading wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wish: CustomWish) => {
    setEditingId(wish.id);
    setFormData(wish);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('custom_wishes')
        .update(formData)
        .eq('id', editingId);

      if (error) throw error;
      await loadWishes();
      setEditingId(null);
      setFormData({
        title: '',
        subtitle: '',
        main_message: '',
        heart_message: '',
        love_message: '',
        footer_message: '',
        website_name: '',
      });
    } catch (error) {
      console.error('[v0] Error saving wish:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('custom_wishes').insert([formData]);
      if (error) throw error;
      await loadWishes();
      setFormData({
        title: '',
        subtitle: '',
        main_message: '',
        heart_message: '',
        love_message: '',
        footer_message: '',
        website_name: '',
      });
    } catch (error) {
      console.error('[v0] Error creating wish:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/supersecretadminloginplace';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-4xl"
        >
          ⏳
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <motion.button
            onClick={() => setActiveTab('wishes')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'wishes'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Custom Wishes
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('analytics')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Analytics
          </motion.button>
        </div>

        {activeTab === 'analytics' && (
          <div className="grid gap-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Visits</h3>
                  <span className="text-3xl">👀</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{analytics.totalVisits}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Yes Clicks</h3>
                  <span className="text-3xl">💕</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{analytics.totalYesClicks}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Shares</h3>
                  <span className="text-3xl">🔗</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{analytics.totalShares}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Interactions</h3>
                  <span className="text-3xl">✨</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{analytics.totalInteractions}</p>
              </motion.div>
            </div>

            {/* Analytics Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Engagement Overview</h2>
              <p className="text-gray-600 mb-4">
                Track visitor engagement and interactions with your valentine site. All data is stored
                efficiently and the site gracefully handles storage limits.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-pink-50 rounded-lg">
                  <p className="font-semibold text-gray-700">Conversion Rate</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {analytics.totalVisits > 0
                      ? Math.round((analytics.totalYesClicks / analytics.totalVisits) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-gray-700">Share Rate</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics.totalYesClicks > 0
                      ? Math.round((analytics.totalShares / analytics.totalYesClicks) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId ? 'Edit Wish' : 'Create New Wish'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="This Moment Is Everything!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="You're my favorite person, and now it's official! 💖"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Message</label>
                <input
                  type="text"
                  value={formData.main_message || ''}
                  onChange={(e) => setFormData({ ...formData, main_message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="My heart is yours! 🌹"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heart Message</label>
                <input
                  type="text"
                  value={formData.heart_message || ''}
                  onChange={(e) => setFormData({ ...formData, heart_message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="With all my love! 🌹"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Love Message</label>
                <input
                  type="text"
                  value={formData.love_message || ''}
                  onChange={(e) => setFormData({ ...formData, love_message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Made with 💕 by Inspired Devs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Message</label>
                <input
                  type="text"
                  value={formData.footer_message || ''}
                  onChange={(e) => setFormData({ ...formData, footer_message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="WebsiteChat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
                <input
                  type="text"
                  value={formData.website_name || ''}
                  onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="BeMyVal"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  onClick={editingId ? handleSave : handleCreate}
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Wish'}
                </motion.button>

                {editingId && (
                  <motion.button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({});
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Custom Wishes</h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {wishes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No wishes yet. Create one!</p>
              ) : (
                wishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{wish.title}</h3>
                      {wish.is_default && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{wish.subtitle}</p>

                    <motion.button
                      onClick={() => handleEdit(wish)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Edit
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
        )}
      </div>
    </div>
  );
}
