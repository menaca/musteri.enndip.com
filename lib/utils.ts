/**
 * Basit className birleştirici (clsx/tailwind-merge bağımlılığı olmadan).
 * Falsy değerleri eler, boşlukla birleştirir.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Verilen ms kadar bekler (mock/stub akışlarda kullanılır). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
