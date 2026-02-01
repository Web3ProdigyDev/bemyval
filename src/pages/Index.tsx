import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';

const Index = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-blush-gradient overflow-hidden relative">
      {/* Floating Hearts Background */}
      <FloatingHearts />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!accepted ? (
          <ValentineQuestion 
            key="question"
            onYesClick={() => setAccepted(true)} 
          />
        ) : (
          <CelebrationScreen key="celebration" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
