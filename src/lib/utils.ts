import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/Pizza' : '';

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
