import type { Skin } from "@/lib/model";
import { AnimatePresence, motion } from "framer-motion";

interface SkinChangerModalProps {
  showSkinDrawer: boolean;
  skins: Skin[];
  currentSkinIndex: number;
  pointerRotation: number;
  setShowSkinDrawer: (value: boolean) => void;
  setCurrentSkinIndex: (value: number) => void;
  setPointerRotation: (value: number) => void;
  addSkin: (value:Skin)=> void;
}

function SkinChangerModal({
  showSkinDrawer,
  skins,
  currentSkinIndex,
  pointerRotation,
  setCurrentSkinIndex,
  setPointerRotation,
  setShowSkinDrawer,
  addSkin
}: SkinChangerModalProps) {
  return (
    <AnimatePresence>
      {showSkinDrawer && (
        <motion.div
          className="absolute inset-0 bg-black/50  backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSkinDrawer(false)}
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
              Skins del Puntero
            </h2>
            <div className="mb-4 flex justify-center">
              <div
                className="w-[60px] h-[60px] border-2 border-gray-300 rounded-md"
                style={{
                  background: skins[currentSkinIndex].src
                    ? `url(${skins[currentSkinIndex].src})`
                    : skins[currentSkinIndex].color!,
                  backgroundSize: skins[currentSkinIndex].src
                    ? "contain"
                    : "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: skins[currentSkinIndex].src
                    ? "no-repeat"
                    : "repeat",
                  clipPath: skins[currentSkinIndex].src
                    ? "none"
                    : "polygon(0% 0%, 100% 0%, 50% 100%)",
                  transform: `rotate(${pointerRotation}deg)`,
                }}
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {skins.map((skin, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded-md border-2 cursor-pointer ${
                    index === currentSkinIndex
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  style={{
                    background: skin.src ? `url(${skin.src})` : skin.color!,
                    backgroundSize: skin.src ? "contain" : "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: skin.src ? "no-repeat" : "repeat",
                    clipPath: skin.src
                      ? "none"
                      : "polygon(0% 0%, 100% 0%, 50% 100%)",
                  }}
                  onClick={() => setCurrentSkinIndex(index)}
                />
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotación del puntero: {pointerRotation}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={pointerRotation}
                onChange={(e) => setPointerRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button
              onClick={() => setShowSkinDrawer(false)}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors text-base font-medium min-h-[48px]"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addSkin({ name: file.name, color: null, src: url });
      setCurrentSkinIndex(skins.length);
    }
  }
}

export default SkinChangerModal;
