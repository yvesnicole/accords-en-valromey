import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Tina CMS owns the content — this stub suppresses Astro's warnings
// about orphaned src/content subdirectories.
const stub = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/.stub' }),
});

export const collections = { stub };
