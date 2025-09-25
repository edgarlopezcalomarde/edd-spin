export interface Option {
  text: string;
  color: string;
  src: string | null;
  enabled: boolean;
  displayMode: 'both' | 'text' | 'image';
}

export interface Palette {
  name: string;
  colors: string[];
}

export interface Skin {
  name: string;
  color: string | null;
  src: string | null;
}
