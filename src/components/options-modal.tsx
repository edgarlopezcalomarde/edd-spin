import type { Option, Palette } from "@/lib/model";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

interface OptionsModalProps {
  options: Option[];
  selectedPalette: Palette;
  showOptionsModal: boolean;
  activeTab: 'options' | 'palettes' | 'data';
  useCustomColors: boolean;
  customPalettes: Palette[];
  predefinedPalettes: Palette[];
  setShowOptionsModal: (value: boolean) => void;
  setShowPaletteCreator: (value: boolean) => void;
  setUseCustomColors: (value: boolean) => void;
  setActiveTab: (value: 'options' | 'palettes' | 'data') => void;
  setSelectedPalette: (value: Palette) => void;
  addOption: (value: Option) => void;
  addCustomPalette: (value: Palette) => void;
  applyPalette: (value: Palette) => void;
  updateOption: (index: number, value: Partial<Option>) => void;
  removeOption: (index: number) => void;
}

function OptionsModal({
  showOptionsModal,
  options,
  activeTab,
  useCustomColors,
  selectedPalette,
  predefinedPalettes,
  customPalettes,
  setShowOptionsModal,
  setShowPaletteCreator,
  setUseCustomColors,
  setActiveTab,
  setSelectedPalette,
  addOption,
  addCustomPalette,
  applyPalette,
  updateOption,
  removeOption,
}: OptionsModalProps) {
  const [newOption, setNewOption] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  return (
    <AnimatePresence>
      {showOptionsModal && (
        <motion.div
          className="absolute inset-0 bg-black/50  backdrop-blur-sm flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowOptionsModal(false)}
        >
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 h-[70vh] flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700">
              Configuración
            </h2>

            {/* Tabs */}
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab("options")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "options"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Opciones
              </button>
              <button
                onClick={() => setActiveTab("palettes")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "palettes"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Paletas
              </button>
              <button
                onClick={() => setActiveTab("data")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "data"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Datos
              </button>
            </div>

            {/* Contenido Tabs */}
            {activeTab === "options" && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={useCustomColors}
                      onChange={(e) => setUseCustomColors(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Usar colores personalizados por opción
                    </span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                    placeholder="Nueva opción..."
                    className="flex-grow p-3 text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddOption}
                    className="bg-indigo-500 text-white px-4 py-3 rounded-r-md hover:bg-indigo-600 transition-colors focus:outline-none min-w-[80px] text-base font-medium"
                  >
                    Añadir
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[35vh]">
                  <ul className="space-y-2 pr-2">
                    {options.map((option, index) => (
                      <li
                        key={option.text}
                        className="bg-gray-100 p-3 rounded-md gap-3 border"
                      >
                        {editingIndex === index ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSaveEdit(index)
                              }
                              className="flex-1 p-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="text-green-500 hover:text-green-700 font-bold text-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-500 hover:text-gray-700 font-bold text-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={option.color}
                              onChange={(e) =>
                                handleColorChange(index, e.target.value)
                              }
                              disabled={!useCustomColors}
                              className="w-10 h-10 rounded border border-gray-300 cursor-pointer disabled:opacity-50"
                            />
                            {!option.src ? (
                              <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                                📷
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleOptionImageChange(index, e)
                                  }
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <div
                                className="w-8 h-8 bg-cover bg-center rounded border"
                                style={{
                                  backgroundImage: `url(${option.src})`,
                                }}
                              />
                            )}
                            <span
                              className="text-gray-800 text-base flex-1 break-words cursor-pointer hover:text-blue-600"
                              onClick={() => handleEditText(index)}
                            >
                              {option.text}
                            </span>
                            <button
                              onClick={() => handleCycleDisplayMode(index)}
                              className="text-purple-500 hover:text-purple-700 text-sm min-w-[60px] min-h-[44px] flex items-center justify-center px-2"
                            >
                              {!option.enabled
                                ? "Deshab."
                                : option.displayMode === "both"
                                ? "Ambos"
                                : option.displayMode === "text"
                                ? "Texto"
                                : "Imagen"}
                            </button>
                            <button
                              onClick={() => handleRemoveOption(index)}
                              className="text-red-500 hover:text-red-700 font-bold text-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "palettes" && (
              <div className="space-y-4">
                {/* Paletas predefinidas */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Predefinidas
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {predefinedPalettes.map((palette) => (
                      <button
                        key={palette.name}
                        onClick={() => {
                          setSelectedPalette(palette);
                          if (!useCustomColors) {
                            applyPalette(palette);
                          }
                        }}
                        className={`p-2 rounded-md border-2 text-xs font-medium transition-colors ${
                          selectedPalette.name === palette.name
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex space-x-1 mb-1">
                          {palette.colors.slice(0, 4).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-3 h-3 rounded-sm border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {palette.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paletas personalizadas */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-600">
                      Personalizadas
                    </h4>
                    <button
                      onClick={() => setShowPaletteCreator(true)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      + Crear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {customPalettes.map((palette) => (
                      <button
                        key={palette.name}
                        onClick={() => {
                          setSelectedPalette(palette);
                          if (!useCustomColors) {
                            applyPalette(palette);
                          }
                        }}
                        className={`p-2 rounded-md border-2 text-xs font-medium transition-colors ${
                          selectedPalette.name === palette.name
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex space-x-1 mb-1">
                          {palette.colors.slice(0, 4).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-3 h-3 rounded-sm border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {palette.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Exportar e Importar
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={handleExportOptions}
                      className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Exportar Opciones
                    </button>
                    <button
                      onClick={handleExportPalettes}
                      className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      Exportar Paletas
                    </button>
                    <label className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium cursor-pointer text-center block">
                      Importar Paletas
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportPalettes}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4 mt-auto">
              <button
                onClick={() => setShowOptionsModal(false)}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors text-base font-medium min-h-[48px]"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  function handleCancelEdit() {
    setEditingIndex(null);
    setEditText("");
  }

  function handleAddOption() {
    if (
      newOption.trim() &&
      !options.some((opt) => opt.text === newOption.trim())
    ) {
      const defaultColor = useCustomColors
        ? "#000000"
        : selectedPalette.colors[
            options.length % selectedPalette.colors.length
          ];
      addOption({
        text: newOption.trim(),
        color: defaultColor,
        src: null,
        enabled: true,
        displayMode: "both",
      });
      setNewOption("");
    }
  }

  function handleImportPalettes(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedPalettes = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedPalettes)) {
            // Validate each palette
            const validPalettes = importedPalettes.filter(
              (p) =>
                p.name &&
                Array.isArray(p.colors) &&
                p.colors.length >= 2 &&
                p.colors.every(
                  (c: string) =>
                    typeof c === "string" && /^#[0-9A-F]{6}$/i.test(c)
                )
            );
            if (validPalettes.length > 0) {
              validPalettes.forEach((palette) => addCustomPalette(palette));
              toast.success(`${validPalettes.length} paletas importadas`);
            } else {
              toast.error("No se encontraron paletas válidas en el archivo");
            }
          } else {
            toast.error("Formato de archivo inválido");
          }
        } catch {
          toast.error("Error al leer el archivo");
        }
      };
      reader.readAsText(file);
    }
  }

  function handleEditText(index: number) {
    setEditingIndex(index);
    setEditText(options[index].text);
  }

  function handleSaveEdit(index: number) {
    if (
      editText.trim() &&
      !options.some((opt, i) => i !== index && opt.text === editText.trim())
    ) {
      updateOption(index, { text: editText.trim() });
      setEditingIndex(null);
      setEditText("");
    }
  }

  function handleExportOptions() {
    const dataStr = JSON.stringify(options, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "opciones_ruleta.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.success("Opciones exportadas");
  }

  function handleColorChange(index: number, color: string) {
    updateOption(index, { color });
  }

  function handleOptionImageChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateOption(index, { src: url });
    }
  }

  function handleCycleDisplayMode(index: number) {
    const current = options[index];
    if (!current.enabled) {
      updateOption(index, { enabled: true, displayMode: "both" });
    } else if (current.displayMode === "both") {
      updateOption(index, { displayMode: "text" });
    } else if (current.displayMode === "text") {
      updateOption(index, { displayMode: "image" });
    } else {
      updateOption(index, { enabled: false });
    }
  }

  function handleExportPalettes() {
    const dataStr = JSON.stringify(customPalettes, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "paletas_personalizadas.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.success("Paletas exportadas");
  }

  function handleRemoveOption(index: number) {
    removeOption(index);
  }
}

export default OptionsModal;
