import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Option, Palette, Skin } from './model';


interface AppState {
  // Options
  options: Option[];
  setOptions: (options: Option[]) => void;
  addOption: (option: Option) => void;
  removeOption: (index: number) => void;
  updateOption: (index: number, option: Partial<Option>) => void;

  // Palettes
  predefinedPalettes: Palette[];
  customPalettes: Palette[];
  selectedPalette: Palette;
  setSelectedPalette: (palette: Palette) => void;
  addCustomPalette: (palette: Palette) => void;
  removeCustomPalette: (name: string) => void;

  // Colors
  useCustomColors: boolean;
  setUseCustomColors: (use: boolean) => void;

  // Skins
  skins: Skin[];
  currentSkinIndex: number;
  setCurrentSkinIndex: (index: number) => void;
  addSkin: (skin: Skin) => void;
  updateSkin: (index: number, skin: Partial<Skin>) => void;

  // Pointer
  pointerRotation: number;
  setPointerRotation: (rotation: number) => void;

  // Background
  backgroundColor: string;
  customBackgroundColor: string | null;
  setBackgroundColor: (color: string) => void;
  setCustomBackgroundColor: (color: string | null) => void;

  // UI
  activeTab: 'options' | 'palettes' | 'data';
  setActiveTab: (tab: 'options' | 'palettes' | 'data') => void;
}

const initialOptions: Option[] = [
  { text: "Hola", color: "#3066BE", src: null, enabled: true, displayMode: 'both' },
  { text: "Boom", color: "#119DA4", src: null, enabled: true, displayMode: 'both' },
  { text: "Dia", color: "#6D9DC5", src: null, enabled: true, displayMode: 'both' },
  { text: "Xiquets", color: "#80DED9", src: null, enabled: true, displayMode: 'both' },
];

const initialPredefinedPalettes: Palette[] = [
  { name: "Ocean", colors: ["#3066BE", "#119DA4", "#6D9DC5", "#80DED9", "#AEECEF"] },
  { name: "Fire", colors: ["#FF6B35", "#F7931E", "#FFD23F", "#FF8C42", "#FF6B35"] },
  { name: "Pastel", colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFBA", "#BAE1FF"] },
  { name: "Forest", colors: ["#2D5016", "#4A7C59", "#7CB342", "#AED581", "#DCEDC8"] },
  { name: "Sunset", colors: ["#FF6B6B", "#FFE66D", "#FF8E53", "#FF6B9D", "#C06C84"] },
];

const initialCustomPalettes: Palette[] = [
  { name: "Mi Paleta", colors: ["#AB87FF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"] },
];

const initialSkins: Skin[] = [
  { name: "Rojo", color: "#ff0000", src: null },
  { name: "Azul", color: "#3066BE", src: null },
  { name: "Verde", color: "#119DA4", src: null },
  { name: "Morado", color: "#AB87FF", src: null },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Options
      options: initialOptions,
      setOptions: (options) => set({ options }),
      addOption: (option) => set((state) => ({ options: [...state.options, option] })),
      removeOption: (index) => set((state) => ({
        options: state.options.filter((_, i) => i !== index)
      })),
      updateOption: (index, updates) => set((state) => ({
        options: state.options.map((opt, i) => i === index ? { ...opt, ...updates } : opt)
      })),

      // Palettes
      predefinedPalettes: initialPredefinedPalettes,
      customPalettes: initialCustomPalettes,
      selectedPalette: initialPredefinedPalettes[0],
      setSelectedPalette: (palette) => set({ selectedPalette: palette }),
      addCustomPalette: (palette) => set((state) => ({
        customPalettes: [...state.customPalettes, palette]
      })),
      removeCustomPalette: (name) => set((state) => ({
        customPalettes: state.customPalettes.filter(p => p.name !== name)
      })),

      // Colors
      useCustomColors: false,
      setUseCustomColors: (use) => set({ useCustomColors: use }),

      // Skins
      skins: initialSkins,
      currentSkinIndex: 0,
      setCurrentSkinIndex: (index) => set({ currentSkinIndex: index }),
      addSkin: (skin) => set((state) => ({ skins: [...state.skins, skin] })),
      updateSkin: (index, updates) => set((state) => ({
        skins: state.skins.map((skin, i) => i === index ? { ...skin, ...updates } : skin)
      })),

      // Pointer
      pointerRotation: 0,
      setPointerRotation: (rotation) => set({ pointerRotation: rotation }),

      // Background
      backgroundColor: "bg-gray-50",
      customBackgroundColor: null,
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      setCustomBackgroundColor: (color) => set({ customBackgroundColor: color }),

      // UI
      activeTab: 'options',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'spin-app-storage',
      // Only persist certain state, not volatile UI state
      partialize: (state) => ({
        options: state.options,
        customPalettes: state.customPalettes,
        selectedPalette: state.selectedPalette,
        useCustomColors: state.useCustomColors,
        skins: state.skins,
        currentSkinIndex: state.currentSkinIndex,
        pointerRotation: state.pointerRotation,
        backgroundColor: state.backgroundColor,
        customBackgroundColor: state.customBackgroundColor,
      }),
    }
  )
);
