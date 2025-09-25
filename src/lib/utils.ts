import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getConicGradient(options: { text: string; color: string }[]) {
  if (options.length === 0) return "white";

  const segmentAngle = 360 / options.length; //Numero de segmentos de la ruleta

  return options.map((opt, idx) => {
    const color = opt.color;
    return `${color} ${idx * segmentAngle}deg ${(idx + 1) * segmentAngle}deg`;
  });
}
