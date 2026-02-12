import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Plus, Save, X } from 'lucide-react';

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

const DEFAULT_WISH: Omit<CustomWish, 'id'> = {
  title: 'This Moment Is Everything!',
  subtitle: "You're my favorite person, and now it's official!",
  main_message: 'My heart is yours!',
  heart_message: 'With all my love!',
  love_message: 'Made with love by Inspired Devs',
  footer_message: 'WebsiteChat',
  website_name: 'BeMyVal',
  is_default: false,
};

function loadWishes(): CustomWish[] {
  try {
    const raw = localStorage.getItem('custom_wishes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishes(wishes: CustomWish[]) {
  localStorage.setItem('custom_wishes', JSON.stringify(wishes));
}

export default function AdminDashboard() {
  const [wishes, setWishes] = useState<CustomWish[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Omit<CustomWish, 'id'>>(DEFAULT_WISH);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    setWishes(loadWishes());
  }, []);

  const handleCreate = () => {
    const newWish: CustomWish = {
      ...formData,
      id: crypto.randomUUID(),
      is_default: wishes.length === 0, // first wish is default
    };
    const updated = [...wishes, newWish];
    setWishes(updated);
    saveWishes(updated);
    setFormData(DEFAULT_WISH);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editingId) return;
    const updated = wishes.map(w => (w.id === editingId ? { ...w, ...formData } : w));
    setWishes(updated);
    saveWishes(updated);
    setEditingId(null);
    setFormData(DEFAULT_WISH);
  };

  const handleDelete = (id: string) => {
    const updated = wishes.filter(w => w.id !== id);
    // if deleted wish was default, make the first remaining one default
    if (updated.length > 0 && !updated.some(w => w.is_default)) {
      updated[0].is_default = true;
    }
    setWishes(updated);
    saveWishes(updated);
  };

  const handleSetDefault = (id: string) => {
    const updated = wishes.map(w => ({ ...w, is_default: w.id === id }));
    setWishes(updated);
    saveWishes(updated);
  };

  const startEdit = (wish: CustomWish) => {
    setEditingId(wish.id);
    setIsCreating(false);
    setFormData({
      title: wish.title,
      subtitle: wish.subtitle,
      main_message: wish.main_message,
      heart_message: wish.heart_message,
      love_message: wish.love_message,
      footer_message: wish.footer_message,
      website_name: wish.website_name,
      is_default: wish.is_default,
    });
  };

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormData(DEFAULT_WISH);
  };

  const cancelForm = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData(DEFAULT_WISH);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
  };

  const isFormOpen = isCreating || editingId !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 text-sm"
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 rounded-xl p-4 mb-6 border border-pink-200"
        >
          <p className="text-gray-700 text-sm">
            Create and manage personalized valentine messages here. The wish marked as <strong>Default</strong> will be shown to visitors.
            Each wish lets you customize the title, subtitle, love messages, and footer text that users see.
          </p>
        </motion.div>

        {/* Create Button */}
        {!isFormOpen && (
          <motion.button
            onClick={startCreate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Create New Wish
          </motion.button>
        )}

        {/* Form */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Wish' : 'Create New Wish'}
              </h2>
              <button onClick={cancelForm} className="p-2 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="This Moment Is Everything!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="You're my favorite person!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Message</label>
                <input
                  type="text"
                  value={formData.main_message}
                  onChange={(e) => setFormData({ ...formData, main_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="My heart is yours!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Message</label>
                <input
                  type="text"
                  value={formData.heart_message}
                  onChange={(e) => setFormData({ ...formData, heart_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="With all my love!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Love Message</label>
                <input
                  type="text"
                  value={formData.love_message}
                  onChange={(e) => setFormData({ ...formData, love_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="Made with love by Inspired Devs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Message</label>
                <input
                  type="text"
                  value={formData.footer_message}
                  onChange={(e) => setFormData({ ...formData, footer_message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="WebsiteChat"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
                <input
                  type="text"
                  value={formData.website_name}
                  onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="BeMyVal"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <motion.button
                onClick={editingId ? handleSave : handleCreate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Create Wish'}
              </motion.button>
              <motion.button
                onClick={cancelForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Wishes List */}
        <div className="space-y-4">
          {wishes.length === 0 && !isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <p className="text-5xl mb-3">💌</p>
              <p className="text-gray-500 text-lg">No custom wishes yet.</p>
              <p className="text-gray-400 text-sm mt-1">Click "Create New Wish" above to get started.</p>
            </motion.div>
          )}

          {wishes.map((wish) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{wish.title}</h3>
                    {wish.is_default && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{wish.subtitle}</p>
                  <p className="text-gray-400 text-xs">{wish.main_message} &middot; {wish.heart_message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!wish.is_default && (
                    <motion.button
                      onClick={() => handleSetDefault(wish.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition"
                    >
                      Set Default
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => startEdit(wish)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(wish.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
