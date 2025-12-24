export type Language = { code: string; name: string; flag?: string };

function codeToFlag(code: string): string {
  const cc = code.toUpperCase();
  return cc.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: codeToFlag('US') }, // Defaulting flag to US for English
  { code: 'de', name: 'German', flag: codeToFlag('DE') },
  { code: 'pt', name: 'Portuguese', flag: codeToFlag('PT') },
  { code: 'fr', name: 'French', flag: codeToFlag('FR') },
  { code: 'es', name: 'Spanish', flag: codeToFlag('ES') },
  { code: 'pl', name: 'Polish', flag: codeToFlag('PL') },
  { code: 'ru', name: 'Russian', flag: codeToFlag('RU') },
];
