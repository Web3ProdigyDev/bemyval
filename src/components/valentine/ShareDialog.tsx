import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareDialog = ({ isOpen, onClose }: ShareDialogProps) => {
  const [recipientName, setRecipientName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareLink = () => {
    if (!recipientName.trim()) return '';
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    params.set('to', recipientName.trim());
    if (customMessage.trim()) {
      params.set('msg', customMessage.trim());
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const shareLink = generateShareLink();

  const copyToClipboard = async () => {
    if (!shareLink) {
      toast({
        title: "Enter a name first!",
        description: "Who are you sending this to? 💕",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "Link copied! 💕",
        description: `Send this to ${recipientName} and watch the magic happen!`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Couldn't copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    if (!shareLink) {
      toast({
        title: "Enter a name first!",
        description: "Who are you sending this to? 💕",
        variant: "destructive",
      });
      return;
    }
    const message = `Hey ${recipientName}! 💕 I have a little surprise for you... ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareNative = async () => {
    if (!shareLink) {
      toast({
        title: "Enter a name first!",
        description: "Who are you sending this to? 💕",
        variant: "destructive",
      });
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipientName}, I have a surprise for you! 💕`,
          text: `Hey ${recipientName}! Open this... it's special!`,
          url: shareLink,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      copyToClipboard();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="bg-card rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-valentine border-2 border-primary/20 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <motion.div
            className="text-4xl text-center mb-3"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💌
          </motion.div>

          <h3 className="font-romantic text-xl sm:text-2xl text-primary text-center mb-1">
            Share the Love!
          </h3>
          <p className="text-muted-foreground text-center text-xs sm:text-sm mb-4">
            Make it personal with their name & a message ✨
          </p>

          {/* Name input */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-foreground mb-1">
              Who's the lucky one? 💕
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Enter their name..."
              maxLength={30}
            />
          </div>

          {/* Custom message input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">
              Add a personal message (optional) 💬
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder="Write something sweet..."
              rows={2}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {customMessage.length}/100
            </p>
          </div>

          {/* Preview */}
          {recipientName.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/50 rounded-xl p-3 mb-3"
            >
              <p className="text-xs text-muted-foreground mb-1">They'll see:</p>
              <p className="text-sm text-foreground font-medium">
                "Hey {recipientName}! Will You Be My Valentine? 💕"
              </p>
              {customMessage.trim() && (
                <p className="text-xs text-foreground/70 mt-1 italic">
                  "{customMessage}"
                </p>
              )}
            </motion.div>
          )}

          {/* Link display */}
          {shareLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted rounded-xl p-2.5 mb-3 flex items-center gap-2"
            >
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-transparent text-xs text-foreground truncate outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-lg hover:bg-background transition-colors flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </motion.div>
          )}

          {/* Share buttons */}
          <div className="flex flex-col gap-2.5">
            <motion.button
              onClick={shareViaWhatsApp}
              className="w-full bg-[#25D366] text-white font-bold py-2.5 rounded-full flex items-center justify-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share via WhatsApp
            </motion.button>

            <motion.button
              onClick={shareNative}
              className="w-full bg-valentine-gradient text-primary-foreground font-bold py-2.5 rounded-full flex items-center justify-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Share Link
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareDialog;
