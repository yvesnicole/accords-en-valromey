import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

// ── Types ──────────────────────────────────────────────────────────────────

export interface CmsConcert {
  title: string;
  date: string;
  locale: string;
  translationKey: string;
  program: string; // MDX body (isBody)
  description?: string;
  image?: string;
  helloAssoLink?: string;
  mapsLink?: string;
  mapsLabel?: string;
  ticketLabel?: string;
}

export interface CmsMusician {
  name: string;
  locale: string;
  translationKey: string;
  instrument: string;
  photo: string;
  photoCredit?: string;
  bio: string; // MDX body (isBody)
}

export interface CmsPage {
  title: string;
  locale: string;
  translationKey: string;
  subtitle?: string;
  image?: string;
  imageCaption?: string;
  email?: string;
  address?: string;
  phone?: string;
  mapEmbedUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  membershipUrl?: string;
  donationUrl?: string;
  body: string; // MDX body (isBody)
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function readMdxFiles(collectionPath: string): { data: Record<string, unknown>; content: string; filePath: string }[] {
  const fullCollectionPath = path.join(projectRoot, collectionPath);
  const results: { data: Record<string, unknown>; content: string; filePath: string }[] = [];

  // Walk locale subdirectories (fr/, en/)
  const localeDirs = fs.readdirSync(fullCollectionPath, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const localeDir of localeDirs) {
    const localePath = path.join(fullCollectionPath, localeDir.name);
    const files = fs.readdirSync(localePath).filter(f => f.endsWith('.mdx'));

    for (const file of files) {
      const filePath = path.join(localePath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      results.push({ data, content, filePath });
    }
  }

  return results;
}

// ── Concert ─────────────────────────────────────────────────────────────────

export async function getConcerts(locale?: string): Promise<CmsConcert[]> {
  const files = readMdxFiles('src/content/concerts');

  const concerts: CmsConcert[] = files.map(({ data, content }) => ({
    title: (data.title as string) || '',
    date: (data.date as string) || '',
    locale: (data.locale as string) || 'fr',
    translationKey: (data.translationKey as string) || '',
    program: content.trim(),
    description: (data.description as string) || undefined,
    image: (data.image as string) || undefined,
    helloAssoLink: (data.helloAssoLink as string) || undefined,
    mapsLink: (data.mapsLink as string) || undefined,
    mapsLabel: (data.mapsLabel as string) || undefined,
    ticketLabel: (data.ticketLabel as string) || undefined,
  }));

  return concerts
    .filter(c => !locale || c.locale === locale)
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
}

export async function getConcert(translationKey: string, locale: string): Promise<CmsConcert | null> {
  const concerts = await getConcerts(locale);
  return concerts.find(c => c.translationKey === translationKey) ?? null;
}

// ── Musician ────────────────────────────────────────────────────────────────

export async function getMusicians(locale?: string): Promise<CmsMusician[]> {
  const files = readMdxFiles('src/content/musicians');

  const musicians: CmsMusician[] = files.map(({ data, content }) => ({
    name: (data.name as string) || '',
    locale: (data.locale as string) || 'fr',
    translationKey: (data.translationKey as string) || '',
    instrument: (data.instrument as string) || '',
    photo: (data.photo as string) || '',
    photoCredit: (data.photoCredit as string) || undefined,
    bio: content.trim(),
  }));

  return musicians.filter(m => !locale || m.locale === locale);
}

// ── Page ────────────────────────────────────────────────────────────────────

export async function getPage(translationKey: string, locale: string): Promise<CmsPage | null> {
  const files = readMdxFiles('src/content/pages');

  const pages: CmsPage[] = files.map(({ data, content }) => ({
    title: (data.title as string) || '',
    locale: (data.locale as string) || 'fr',
    translationKey: (data.translationKey as string) || '',
    subtitle: (data.subtitle as string) || undefined,
    image: (data.image as string) || undefined,
    imageCaption: (data.imageCaption as string) || undefined,
    email: (data.email as string) || undefined,
    address: (data.address as string) || undefined,
    phone: (data.phone as string) || undefined,
    mapEmbedUrl: (data.mapEmbedUrl as string) || undefined,
    facebookUrl: (data.facebookUrl as string) || undefined,
    instagramUrl: (data.instagramUrl as string) || undefined,
    membershipUrl: (data.membershipUrl as string) || undefined,
    donationUrl: (data.donationUrl as string) || undefined,
    body: content.trim(),
  }));

  return pages.find(p => p.translationKey === translationKey && p.locale === locale) ?? null;
}