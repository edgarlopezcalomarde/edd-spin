import { AnimatePresence, motion } from "framer-motion";

interface WinnerBoxProps {
  showWinner: boolean;
  winner: string | null;
}

function WinnerBox({ showWinner, winner }: WinnerBoxProps) {
  return (
    <AnimatePresence>
      {showWinner && winner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed top-[20px] left-1/2 -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-30 text-center"
        >
          <h2 className="text-2xl font-bold">{winner}</h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WinnerBox;
