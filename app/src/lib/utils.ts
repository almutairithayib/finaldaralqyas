import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetPath(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  if (path.startsWith("/")) {
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    return `${cleanBase}${path.slice(1)}`;
  }
  return path;
}
