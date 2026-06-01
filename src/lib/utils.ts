import { marked } from 'marked';

/**
 * Render MDX/markdown content to HTML.
 * Used to render TinaCMS isBody fields (bio, program, body) in Astro components.
 */
export async function renderMarkdown(content: string): Promise<string> {
  if (!content) return '';
  const html = await marked(content);
  return html.trim();
}

/**
 * Format a concert date for display.
 * @param dateStr - ISO date string from TinaCMS (e.g. "2026-08-20T19:00:00.000Z")
 * @param locale - 'fr' or 'en'
 */
export function formatConcertDate(dateStr: string, locale: 'fr' | 'en'): string {
  const date = new Date(dateStr);
  if (locale === 'fr') {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ' — ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' — ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Map TinaCMS concert data to the shape expected by ConcertCarousel.
 * Handles field name differences between CMS schema and component props.
 */
export async function mapConcertToProps(concert: {
  title: string;
  date: string;
  description?: string | null;
  program?: string | null;
  image?: string | null;
  helloAssoLink?: string | null;
  mapsLink?: string | null;
  mapsLabel?: string | null;
  ticketLabel?: string | null;
  locale: string;
}, locale: 'fr' | 'en') {
  const ticketLink = concert.helloAssoLink || (locale === 'fr' ? '/billetterie/' : '/en/tickets/');
  const programHtml = concert.program ? await renderMarkdown(concert.program) : '';
  return {
    title: concert.title,
    date: formatConcertDate(concert.date, locale),
    description: concert.description || '',
    programHtml,
    poster: concert.image || '/images/concerts/ouverture.jpg',
    mapsLink: concert.mapsLink || '',
    ticketLink,
    mapsLabel: concert.mapsLabel || (locale === 'fr' ? 'Voir sur Google Maps' : 'View on Google Maps'),
    ticketLabel: concert.ticketLabel || (locale === 'fr' ? 'Réserver' : 'Book tickets'),
  };
}

/**
 * Map TinaCMS musician data to the shape expected by MusicianGrid/Card/Bio.
 * Handles field name differences between CMS schema and component props.
 */
export function mapMusicianToProps(musician: {
  name: string;
  instrument: string;
  photo: string;
  photoCredit?: string | null;
  bio?: string | null;
}) {
  return {
    name: musician.name,
    instrument: musician.instrument,
    photo: musician.photo,
    photoCredit: musician.photoCredit || undefined,
    biography: musician.bio || '',
  };
}