export function isDateYYYYMMDD(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [yStr, mStr, dStr] = value.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const d = parseInt(dStr, 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  const iso = `${yStr}-${mStr}-${dStr}`;
  const dt = new Date(iso);
  return (
    !isNaN(dt.getTime()) &&
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() + 1 === m &&
    dt.getUTCDate() === d
  );
}

export function isDDMMYYYY(value: string): boolean {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;
  const [d, m, y] = value.split('-').map((x) => parseInt(x, 10));
  const iso = `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  const dt = new Date(iso);
  return !isNaN(dt.getTime()) && dt.getUTCFullYear() === y;
}

export function formatDDMMYYYY(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('-');
}

export function isPositiveNumber(value: string): boolean {
  const n = parseFloat(value);
  return !isNaN(n) && n > 0;
}

export function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return options.includes(value as T);
}

export function required(value: string | undefined | null): boolean {
  return !!value && String(value).trim().length > 0;
}
