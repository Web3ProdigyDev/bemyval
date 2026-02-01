import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VisitorFormProps {
  onComplete: () => void;
}

const VisitorForm = ({ onComplete }: VisitorFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "We need your name and phone number 💕",
        variant: "destructive",
      });
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('valentine_visitors')
        .insert({
          name: name.trim().slice(0, 100),
          phone: phone.trim().slice(0, 20),
        });

      if (error) throw error;

      toast({
        title: "Welcome! 💕",
        description: "Now let's see if you'll be my Valentine...",
      });

      onComplete();
    } catch (error) {
      console.error('Error saving visitor:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong, but let's continue anyway! 💕",
      });
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ type: "spring", bounce: 0.4 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
    >
      <motion.div
        className="bg-card/95 backdrop-blur-md rounded-3xl p-8 shadow-valentine max-w-md w-full border-2 border-primary/20 relative overflow-hidden"
        initial={{ y: 50, rotateX: 10 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div
          className="text-6xl text-center mb-4"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💌
        </motion.div>
        
        <motion.h2 
          className="font-romantic text-3xl sm:text-4xl text-primary text-center mb-2"
          animate={{
            textShadow: [
              "0 0 10px rgba(255,107,138,0.3)",
              "0 0 20px rgba(255,107,138,0.5)",
              "0 0 10px rgba(255,107,138,0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Before we begin...
        </motion.h2>
        <p className="text-muted-foreground text-center mb-6 relative z-10">
          Let me know who's about to make my day! 🥰
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Your Name 💕
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Enter your lovely name"
              maxLength={100}
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              Phone Number 📱
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="So I can reach you later 😉"
              maxLength={20}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-valentine-gradient text-primary-foreground font-bold py-4 rounded-full shadow-valentine disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  💕
                </motion.span>
                Saving...
              </span>
            ) : (
              <span className="relative z-10">Continue to the Magic ✨</span>
            )}
          </motion.button>
        </form>

        <motion.p 
          className="text-xs text-muted-foreground text-center mt-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don't worry, I'll keep your info safe! 🤫
        </motion.p>

        {/* Decorative hearts */}
        <motion.div
          className="absolute -top-2 -right-2 text-2xl"
          animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💖
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -left-2 text-2xl"
          animate={{ rotate: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          💗
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VisitorForm;
