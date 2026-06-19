export const APP_NAME = 'Waggli';
export const APP_DOMAIN = 'waggli.app';
export const APP_WEBSITE_URL = `https://${APP_DOMAIN}`;
export const APP_APPLICATION_HEADER = 'waggli-mobile';

export function getPublicBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:${port || '8081'}`;
    }

    if (hostname.includes('waggli.eu')) {
      return 'https://waggli.eu';
    }
  }

  return APP_WEBSITE_URL;
}
