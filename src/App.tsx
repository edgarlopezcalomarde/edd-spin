import { useState, useEffect, useRef } from "react";

import confetti from "canvas-confetti";
import { useAppStore } from "./lib/store";
import WinnerBox from "./components/winner-box";
import BackgroundChangerModal from "./components/background-changer-modal";
import SkinChangerModal from "./components/skin-changer-modal";
import PaletteColorCreatorModal from "./components/palette-color-creator-modal";
import OptionsModal from "./components/options-modal";
import { Button } from "./components/ui/button";
import { getConicGradient } from "./lib/utils";

function App() {
  const [rotation, setRotation] = useState(0);
  const [isSpining, setIsSpining] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showPaletteCreator, setShowPaletteCreator] = useState(false);

  const [showSkinDrawer, setShowSkinDrawer] = useState(false);
  const [showBackgroundColorModal, setShowBackgroundColorModal] =
    useState(false);
  const [showWinner, setShowWinner] = useState(false);

  const {
    options,
    setOptions,
    addOption,
    removeOption,
    updateOption,
    predefinedPalettes,
    customPalettes,
    selectedPalette,
    setSelectedPalette,
    addCustomPalette,
    useCustomColors,
    setUseCustomColors,
    skins,
    currentSkinIndex,
    setCurrentSkinIndex,
    addSkin,
    pointerRotation,
    setPointerRotation,
    backgroundColor,
    customBackgroundColor,
    setCustomBackgroundColor,
    activeTab,
    setActiveTab,
  } = useAppStore();

  const lastTap = useRef<number>(0);
  const timer = useRef<number | null>(null);

  
  useEffect(() => {
    const hasModal = showOptionsModal || showPaletteCreator || showSkinDrawer;
    document.body.style.overflow = hasModal ? "hidden" : "";
  }, [showOptionsModal, showPaletteCreator, showSkinDrawer]);

  const enabledOptions = options.filter((option) => option.enabled);
  const conicGradients = getConicGradient(enabledOptions);

  const handlePointerClick = () => {
    setShowSkinDrawer(true);
  };

  return (
    <div
      className={`min-h-screen ${backgroundColor} flex flex-col items-center justify-center font-google-code `}
      style={
        customBackgroundColor ? { backgroundColor: customBackgroundColor } : {}
      }
      onClick={handleDoubleTapChangeBkg}
    >
      <div className="relative flex flex-col items-center ">
        <WinnerBox {...{ showWinner, winner }} />
        {/* Puntero */}
        <div
          className="absolute top-[-20px] sm:top-[-25px] left-1/2 -translate-x-1/2 w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] z-20 drop-shadow-md cursor-pointer "
          style={{
            background: skins[currentSkinIndex].src
              ? `url(${skins[currentSkinIndex].src})`
              : skins[currentSkinIndex].color!,
            backgroundSize: skins[currentSkinIndex].src ? "contain" : "cover",
            backgroundPosition: "center",
            backgroundRepeat: skins[currentSkinIndex].src
              ? "no-repeat"
              : "repeat",
            clipPath: skins[currentSkinIndex].src
              ? "none"
              : "polygon(0% 0%, 100% 0%, 50% 100%)",
            transform: `rotate(${pointerRotation}deg)`,
          }}
          onClick={handlePointerClick}
        />

        {/* Ruleta */}
        <div
          onClick={() => !isSpining && setShowOptionsModal(true)}
          className=" relative w-[min(80vw,80vh)] h-[min(80vw,80vh)] max-w-96 max-h-96 rounded-full shadow-2xl overflow-hidden cursor-pointer "
        >
          <div
            className=" absolute inset-0 transition-transform duration-[6000ms] ease-out"
            style={{
              background: `conic-gradient(${conicGradients})`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {options.length > 0 &&
              options
                .filter((option) => option.enabled)
                .map((option, i) => {
                  const enabledOptions = options.filter((opt) => opt.enabled);
                  const numOptions = enabledOptions.length;
                  const angle = (360 / numOptions) * i + 360 / numOptions / 2;

                  return (
                    <div
                      key={option.text}
                      className="absolute w-full h-full"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      {option.displayMode === "image" && option.src ? (
                        <div
                          className="absolute top-[8%] left-[50%] -translate-x-1/2 w-[80px] sm:w-[100px] h-[40px] sm:h-[50px] bg-contain bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${option.src})` }}
                        />
                      ) : option.displayMode === "text" ? (
                        <span className="absolute text-center text-white font-bold text-xs sm:text-sm md:text-base top-[8%] left-[50%] -translate-x-1/2 w-[80px] sm:w-[100px] break-all">
                          {option.text}
                        </span>
                      ) : option.displayMode === "both" && option.src ? (
                        <>
                          <div
                            className="absolute top-[8%] left-[50%] -translate-x-1/2 w-[80px] sm:w-[100px] h-[40px] sm:h-[50px] bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${option.src})` }}
                          />
                          <span className="absolute text-center text-white font-bold text-xs sm:text-sm md:text-base top-[8%] left-[50%] -translate-x-1/2 w-[80px] sm:w-[100px] break-all">
                            {option.text}
                          </span>
                        </>
                      ) : (
                        <span className="absolute text-center text-white font-bold text-xs sm:text-sm md:text-base top-[8%] left-[50%] -translate-x-1/2 w-[80px] sm:w-[100px] break-all">
                          {option.text}
                        </span>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-gray-200 shadow-inner" />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleSpin();
          }}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-[#AB87FF] rounded-full  text-white font-bold shadow-lg text-sm disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#453F78] z-10 cursor-pointer"
        >
          {isSpining ? "..." : "Girar"}
        </Button>
      </div>

      <OptionsModal
        {...{
          activeTab,
          addCustomPalette,
          addOption,
          applyPalette,
          customPalettes,
          options,
          predefinedPalettes,
          removeOption,
          selectedPalette,
          setActiveTab,
          setSelectedPalette,
          setShowOptionsModal,
          setShowPaletteCreator,
          setUseCustomColors,
          showOptionsModal,
          updateOption,
          useCustomColors,
        }}
      />

      <PaletteColorCreatorModal
        {...{
          addCustomPalette,
          applyPalette,
          setSelectedPalette,
          setShowPaletteCreator,
          showPaletteCreator,
          useCustomColors,
        }}
      />

      <SkinChangerModal
        {...{
          addSkin,
          currentSkinIndex,
          pointerRotation,
          setCurrentSkinIndex,
          setPointerRotation,
          setShowSkinDrawer,
          showSkinDrawer,
          skins,
        }}
      />

      <BackgroundChangerModal
        {...{
          customBackgroundColor,
          showBackgroundColorModal,
          setCustomBackgroundColor,
          setShowBackgroundColorModal,
        }}
      />
    </div>
  );

  function handleSpin() {
    if (isSpining || options.length < 2) return;
    setIsSpining(true);
    setWinner(null);
    setShowWinner(false);

    const winnerIdx = Math.floor(Math.random() * options.length);
    const segmentAngle = 360 / options.length;
    const winningAngle = winnerIdx * segmentAngle + segmentAngle / 2;
    const adjustment = -winningAngle;

    const randomSpins = 5 + Math.floor(Math.random() * 5);
    const totalRotation = randomSpins * 360 + adjustment;

    const currentAngle = rotation % 360;
    const newRotationValue = rotation - currentAngle + totalRotation;

    setRotation(newRotationValue);

    setTimeout(() => {
      setIsSpining(false);
      const winnerOption = options[winnerIdx];
      setWinner(winnerOption.text);
      triggerConfetti();
      setShowWinner(true);
      setTimeout(() => setShowWinner(false), 5000);
    }, 6000);
  }

  function triggerConfetti() {
    const end = Date.now() + 5 * 1000; // 5 segundos
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }

  function applyPalette(palette: { name: string; colors: string[] }) {
    const newOptions = options.map((opt, idx) => ({
      ...opt,
      color: palette.colors[idx % palette.colors.length],
    }));
    setOptions(newOptions);
  }


  function handleDoubleTapChangeBkg() {
    const now: number = Date.now();
    const DURATION_BETWEEN_TAPS: number = 300;

    if (now - lastTap.current < DURATION_BETWEEN_TAPS) {
      // Doble toque detectado
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setShowBackgroundColorModal(true);
      lastTap.current = 0; // Reiniciar
    } else {
      // Primer toque, establecer un temporizador
      lastTap.current = now;
      timer.current = setTimeout(() => {}, DURATION_BETWEEN_TAPS);
    }
  };

}

export default App;
