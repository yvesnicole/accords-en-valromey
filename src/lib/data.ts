import client from '../../tina/__generated__/client';
import type { Concert, Musician, Page } from '../../tina/__generated__/types';

export type CmsConcert = Concert;
export type CmsMusician = Musician;
export type CmsPage = Page;

/**
 * Fetch all concerts, sorted by date ascending.
 * Pass `locale` to filter by language (e.g. 'fr', 'en').
 */
export async function getConcerts(locale?: string) {
  const result = await client.queries.concertConnection();
  const edges = result.data.concertConnection.edges ?? [];
  const concerts = edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .filter((c) => !locale || c.locale === locale)
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
  return concerts;
}

/**
 * Fetch a single concert by its translationKey + locale.
 */
export async function getConcert(translationKey: string, locale: string) {
  const concerts = await getConcerts(locale);
  return concerts.find((c) => c.translationKey === translationKey) ?? null;
}

/**
 * Fetch all musicians, optionally filtered by locale.
 */
export async function getMusicians(locale?: string) {
  const result = await client.queries.musicianConnection();
  const edges = result.data.musicianConnection.edges ?? [];
  const musicians = edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .filter((m) => !locale || m.locale === locale);
  return musicians;
}

/**
 * Fetch a single page by its translationKey + locale.
 */
export async function getPage(translationKey: string, locale: string) {
  const result = await client.queries.pageConnection();
  const edges = result.data.pageConnection.edges ?? [];
  const pages = edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .filter((p) => p.locale === locale);
  return pages.find((p) => p.translationKey === translationKey) ?? null;
}
