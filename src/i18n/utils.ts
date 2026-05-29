import { ui, type UiKey } from './ui';

/**
 * Extract the current locale from the URL.
 * Returns 'fr' for root paths, 'en' for paths under /en/.
 */
export function getLangFromUrl(url: URL): 'fr' | 'en' {
  const pathname = url.pathname;
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }
  return 'fr';
}

/**
 * Get translation function for the current locale.
 */
export function useTranslations(locale: 'fr' | 'en') {
  return function t(key: UiKey): string {
    return ui[locale][key] || ui.fr[key] || key;
  };
}

/**
 * Get the page slug for the given locale based on current path.
 */
export function getLocalizedPath(path: string, targetLocale: 'fr' | 'en'): string {
  const currentLocale = path.startsWith('/en/') || path === '/en' ? 'en' : 'fr';

  if (currentLocale === 'en' && targetLocale === 'fr') {
    const slug = path.replace(/^\/en\/?/, '/');
    return translateSlug(slug, 'en', 'fr');
  }

  if (currentLocale === 'fr' && targetLocale === 'en') {
    const slug = translateSlug(path, 'fr', 'en');
    return `/en${slug}`;
  }

  return path;
}

/**
 * Map route slugs between locales.
 */
function translateSlug(slug: string, from: 'fr' | 'en', to: 'fr' | 'en'): string {
  const routeMap: Record<string, Record<string, string>> = {
    fr: {
      '/le-festival/': '/the-festival/',
      '/billetterie/': '/tickets/',
      '/programmation/': '/program/',
      '/musiciens/': '/musicians/',
      '/contact/': '/contact/',
      '/soutenir/': '/support-us/',
    },
    en: {
      '/the-festival/': '/le-festival/',
      '/tickets/': '/billetterie/',
      '/program/': '/programmation/',
      '/musicians/': '/musiciens/',
      '/contact/': '/contact/',
      '/support-us/': '/soutenir/',
    },
  };

  return routeMap[from]?.[slug] || slug;
}
