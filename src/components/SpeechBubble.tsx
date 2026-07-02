import { motion, AnimatePresence } from 'motion/react';

export default function SpeechBubble({
  text,
  showYes,
  onYes,
}: {
  text: string;
  showYes: boolean;
  onYes: () => void;
}) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-[310px] z-30 max-w-[260px] min-w-[180px] rounded-2xl border-[3px] border-gray-800 bg-white px-4 py-3 text-center text-[15px] leading-snug text-gray-800 shadow-lg"
        >
          <p className="m-0 mb-2">{text}</p>
          {showYes && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onYes}
              className="rounded-full bg-green-600 px-5 py-1.5 text-sm font-bold text-white"
            >
              Yes
            </motion.button>
          )}
          <span className="absolute left-1/2 -bottom-[14px] -translate-x-1/2 border-x-[10px] border-t-[14px] border-x-transparent border-t-gray-800" />
          <span className="absolute left-1/2 -bottom-[10px] -translate-x-1/2 border-x-[8px] border-t-[11px] border-x-transparent border-t-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
