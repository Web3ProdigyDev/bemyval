import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import VisitorForm from '@/components/valentine/VisitorForm';
import ValentineQuestion from '@/components/valentine/ValentineQuestion';
import CelebrationScreen from '@/components/valentine/CelebrationScreen';
import BackgroundMusic from '@/components/valentine/BackgroundMusic';

type Screen = 'form' | 'question' | 'celebration';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('form');

  return (
    <div className="min-h-screen bg-blush-gradient overflow-hidden relative">
      {/* Background Music */}
      <BackgroundMusic />

      {/* Floating Hearts Background */}
      <FloatingHearts />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentScreen === 'form' && (
          <VisitorForm 
            key="form"
            onComplete={() => setCurrentScreen('question')} 
          />
        )}
        {currentScreen === 'question' && (
          <ValentineQuestion 
            key="question"
            onYesClick={() => setCurrentScreen('celebration')} 
          />
        )}
        {currentScreen === 'celebration' && (
          <CelebrationScreen key="celebration" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
