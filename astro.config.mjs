// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { i18n, filterSitemapByDefaultLocale } from 'astro-i18n-aut/integration';

const defaultLocale = 'fr';
const locales = {
  fr: 'fr-FR',
  en: 'en-US',
};

export default defineConfig({
  site: 'https://accordsenvalromey.fr',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { locales, defaultLocale },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
    i18n({
      locales,
      defaultLocale,
    }),
  ],
  vite: {
    // @ts-expect-error — Vite type mismatch: Astro bundles its own Vite with slightly
    // different Plugin types than the project-level Vite that @tailwindcss/vite targets.
    // This is a type-level only issue; builds and dev work correctly.
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
