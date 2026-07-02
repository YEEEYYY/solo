import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { randomCenteredOffset } from '../utils/coords';

const FLEE_DURATION_MS = 10000;

type Phase = 'idle' | 'fleeing' | 'centered';

export default function RunawayButton({ onCaught }: { onCaught: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [catchable, setCatchable] = useState(false);
  const timerRef = useRef<number>();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function dodge() {
    setPos(randomCenteredOffset(140, 80));
  }

  function startFleeing() {
    setPhase('fleeing');
    dodge();
    timerRef.current = window.setTimeout(() => {
      setPos({ x: 0, y: 0 });
      setPhase('centered');
      setCatchable(true);
    }, FLEE_DURATION_MS);
  }

  function handleTrigger() {
    if (phase === 'idle') startFleeing();
    else if (phase === 'fleeing') dodge();
  }

  function handleClick() {
    if (phase === 'centered' && catchable) {
      onCaught();
    } else {
      handleTrigger();
    }
  }

  return (
    <>
      <AnimatePresence>
        {phase === 'fleeing' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl font-bold text-violet-700 select-none pointer-events-none"
          >
            run awayyyyyyy 🏃💨
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        onHoverStart={handleTrigger}
        onPointerDown={handleTrigger}
        onClick={handleClick}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 140, damping: 15, mass: 0.6 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none rounded-full px-10 py-4 text-xl font-bold text-white shadow-[0_6px_0_#5b21b6,0_8px_14px_rgba(0,0,0,0.2)] bg-gradient-to-b from-violet-600 to-violet-800"
      >
        <span className="relative inline-block">
          Purple 💜
          {phase === 'fleeing' && (
            <>
              <motion.span
                animate={{ rotate: [-35, 25] }}
                transition={{ duration: 0.28, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="absolute -bottom-5 left-[30%] w-2 h-5 rounded bg-violet-900"
              />
              <motion.span
                animate={{ rotate: [35, -25] }}
                transition={{ duration: 0.28, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="absolute -bottom-5 right-[30%] w-2 h-5 rounded bg-violet-900"
              />
            </>
          )}
        </span>
      </motion.button>
    </>
  );
}
