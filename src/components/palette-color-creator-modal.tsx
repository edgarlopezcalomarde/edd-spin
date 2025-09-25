import type { Palette } from "@/lib/model";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface PaletteColorCreatorModalProps {
  showPaletteCreator: boolean;
  useCustomColors: boolean;
  setShowPaletteCreator: (value: boolean) => void;
  setSelectedPalette : (value:Palette)=> void;
  addCustomPalette : (value:Palette)=> void;
  applyPalette : (value:Palette)=> void;
}

function PaletteColorCreatorModal({
  showPaletteCreator,
  useCustomColors,
  setShowPaletteCreator,
setSelectedPalette,
addCustomPalette,
applyPalette
}: PaletteColorCreatorModalProps) {
  const [newPaletteName, setNewPaletteName] = useState("");
    const [paletteColors, setPaletteColors] = useState([
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
  ]);

  return (
    <AnimatePresence>
      {showPaletteCreator && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPaletteCreator(false)}
        >
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
              Crear Paleta Personalizada
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la paleta
              </label>
              <input
                type="text"
                value={newPaletteName}
                onChange={(e) => setNewPaletteName(e.target.value)}
                placeholder="Mi paleta personalizada"
                className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Colores (mínimo 2, máximo 8)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {paletteColors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...paletteColors];
                        newColors[index] = e.target.value;
                        setPaletteColors(newColors);
                      }}
                      className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                    />
                    <button
                      onClick={() => {
                        if (paletteColors.length > 2) {
                          setPaletteColors(
                            paletteColors.filter((_, i) => i !== index)
                          );
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-xs mt-1"
                      disabled={paletteColors.length <= 2}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {paletteColors.length < 8 && (
                  <button
                    onClick={() =>
                      setPaletteColors([...paletteColors, "#000000"])
                    }
                    className="w-12 h-12 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                  >
                    +
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (newPaletteName.trim() && paletteColors.length >= 2) {
                    const newPalette = {
                      name: newPaletteName.trim(),
                      colors: [...paletteColors],
                    };
                    addCustomPalette(newPalette);
                    setSelectedPalette(newPalette);
                    if (!useCustomColors) {
                      applyPalette(newPalette);
                    }
                    setNewPaletteName("");
                    setPaletteColors([
                      "#FF0000",
                      "#00FF00",
                      "#0000FF",
                      "#FFFF00",
                      "#FF00FF",
                    ]);
                    setShowPaletteCreator(false);
                  }
                }}
                disabled={!newPaletteName.trim() || paletteColors.length < 2}
                className="flex-1 bg-indigo-500 text-white px-4 py-3 rounded-md hover:bg-indigo-600 transition-colors text-base font-medium min-h-[48px] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Crear Paleta
              </button>
              <button
                onClick={() => setShowPaletteCreator(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-md hover:bg-gray-600 transition-colors text-base font-medium min-h-[48px]"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PaletteColorCreatorModal;
