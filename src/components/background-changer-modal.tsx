import { AnimatePresence, motion } from "framer-motion";

interface BackgorundChangerModalProps {
  showBackgroundColorModal: boolean;
  customBackgroundColor: string |null
  setShowBackgroundColorModal: (value: boolean) => void;
  setCustomBackgroundColor: (value: string) => void;
  
}

function BackgroundChangerModal({
  showBackgroundColorModal,
  customBackgroundColor,
  setShowBackgroundColorModal,
  setCustomBackgroundColor
}: BackgorundChangerModalProps) {
  return (
    <AnimatePresence>
      {showBackgroundColorModal && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowBackgroundColorModal(false)}
        >
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
              Color de Fondo
            </h2>
            <div className="mb-6">
              <input
                type="color"
                value={customBackgroundColor || "#f9fafb"}
                onChange={(e) => {
                  setCustomBackgroundColor(e.target.value);
                }}
                className="w-full h-48 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>
            <button
              onClick={() => setShowBackgroundColorModal(false)}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors text-base font-medium min-h-[48px]"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BackgroundChangerModal;
