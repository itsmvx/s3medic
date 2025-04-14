import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // hilangkan karakter aneh
        .replace(/[\s_-]+/g, "-") // ganti spasi dan underscore jadi strip
        .replace(/^-+|-+$/g, ""); // hapus strip di awal/akhir
};
