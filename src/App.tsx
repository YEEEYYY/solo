import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RunawayButton from './components/RunawayButton';
import MinionScene, { MinionPhase } from './components/Minion3D';
import SpeechBubble from './components/SpeechBubble';

export default function App() {
  const [caught, setCaught] = useState(false);
  const [showMinion, setShowMinion] = useState(false);
  const [minionPhase, setMinionPhase] = useState<MinionPhase>('entering');
  const [dialogueStep, setDialogueStep] = useState<0 | 1 | 2>(0);
  const [yesPressed, setYesPressed] = useState(false);

  function handleCaught() {
    setCaught(true);
  }

  function handlePinkComplete() {
    if (caught && !showMinion) setShowMinion(true);
  }

  function handleMinionEntered() {
    setMinionPhase('resting');
    window.setTimeout(() => setDialogueStep(1), 400);
    window.setTimeout(() => setDialogueStep(2), 1800);
  }

  function handleYes() {
    setYesPressed(true);
    setDialogueStep(0);
    setMinionPhase('running');
  }

  const bubbleText =
    dialogueStep === 1 ? 'hey mila' : dialogueStep === 2 ? 'I am here by order of the fish, do you have a problem?' : '';

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ backgroundColor: '#ffffff' }}
        animate={{ backgroundColor: caught ? '#ffb3d9' : '#ffffff' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        onAnimationComplete={handlePinkComplete}
      />

      {!caught && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="mb-7 text-2xl sm:text-4xl text-gray-800">What's your favorite color? 🎨</p>
        </div>
      )}

      {!caught && <RunawayButton onCaught={handleCaught} />}

      {showMinion && <MinionScene phase={minionPhase} onEntered={handleMinionEntered} />}

      <SpeechBubble text={bubbleText} showYes={dialogueStep === 2} onYes={handleYes} />

      <AnimatePresence>
        {yesPressed && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-30 text-2xl sm:text-3xl font-bold text-pink-700 select-none pointer-events-none"
          >
            eeee Bana ne!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
