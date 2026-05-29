# Weezevent Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace HelloAsso external ticket links with an embedded Weezevent iFrame widget on the billetterie/tickets pages, centralize pricing data, and fix i18n gaps.

**Architecture:** New `TicketWidget.astro` lazy-loads a Weezevent iFrame; `pricing.ts` centralizes ticket prices; `PricingCard` and `ConcertCard` receive `locale` props for i18n; `helloAssoLink` renamed to `ticketUrl` in TinaCMS schema; `HelloAssoButton` deleted (unused after migration). Support pages (adhesion/donations) stay on HelloAsso — untouched.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, TinaCMS 3.8+, TypeScript, vanilla JS (no React)

---

### Task 1: Create centralized pricing data

**Files:**
- Create: `src/data/pricing.ts`

- [ ] **Step 1: Write the file**

```typescript
// src/data/pricing.ts
// Source unique des tarifs de billetterie — plus de hardcoding dans les pages

export interface PricingTier {
  key: 'single' | 'pass2' | 'pass3';
  fullPrice: number;
  reducedPrice: number;
  includesKeys: string[];
  count: number;
  highlighted: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    key: 'single',
    fullPrice: 24,
    reducedPrice: 21,
    includesKeys: ['concert', 'program', 'cocktail'],
    count: 1,
    highlighted: false,
  },
  {
    key: 'pass2',
    fullPrice: 45,
    reducedPrice: 39,
    includesKeys: ['concerts', 'programs', 'cocktails'],
    count: 2,
    highlighted: true,
  },
  {
    key: 'pass3',
    fullPrice: 63,
    reducedPrice: 54,
    includesKeys: ['concerts', 'programs', 'cocktails'],
    count: 3,
    highlighted: false,
  },
];

export interface PricingDisplay {
  name: string;
  fullPrice: string;
  reducedPrice: string;
  includes: string[];
  highlighted: boolean;
}

/**
 * Format pricing tiers for display with translated labels.
 * @param locale - 'fr' or 'en'
 * @param t - translation function from useTranslations(locale)
 */
export function getPricing(
  locale: 'fr' | 'en',
  t: (key: string) => string,
): PricingDisplay[] {
  return pricingTiers.map((tier) => {
    const nameKey = `tickets.${tier.key}` as string;
    const priceSuffix = locale === 'fr' ? ' €' : '€';
    return {
      name: t(nameKey),
      fullPrice: `${tier.fullPrice}${priceSuffix}`,
      reducedPrice: `${tier.reducedPrice}${priceSuffix}`,
      includes: tier.includesKeys.map((k) => t(`tickets.${k}`)),
      highlighted: tier.highlighted,
    };
  });
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx astro check`
Expected: PASS (no errors from this file — existing errors may appear from other files before migration, that's OK)

- [ ] **Step 3: Commit**

```bash
git add src/data/pricing.ts
git commit -m "feat: add centralized pricing data for ticket tiers"
```

---

### Task 2: Add new i18n keys

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add 5 new keys to both `fr` and `en` objects**

In `src/i18n/ui.ts`, add after existing `tickets.*` keys (after `tickets.buy` / `tickets.programs`):

```typescript
// In the `fr` object, add after 'tickets.programs':
'tickets.book': 'Réserver',
'tickets.full': 'Plein tarif',
'tickets.reduced': 'Tarif réduit',
'tickets.loading': 'Chargement de la billetterie…',
'tickets.widget.title': 'Achetez vos billets',

// In the `en` object, add after 'tickets.programs':
'tickets.book': 'Book',
'tickets.full': 'Full price',
'tickets.reduced': 'Reduced price',
'tickets.loading': 'Loading tickets…',
'tickets.widget.title': 'Buy your tickets',
```

- [ ] **Step 2: Verify TypeScript compiles with new keys**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat(i18n): add ticket booking, pricing label, and widget keys"
```

---

### Task 3: Create TicketButton.astro (replaces HelloAssoButton)

**Files:**
- Create: `src/components/tickets/TicketButton.astro`

- [ ] **Step 1: Write the component**

```astro
---
// src/components/tickets/TicketButton.astro
// Generic ticket button — replaces HelloAssoButton.astro
interface Props {
  href: string;
  variant?: 'primary' | 'secondary';
}

const { href, variant = 'primary' } = Astro.props;

const base = 'inline-flex items-center justify-center px-8 py-4 rounded-card font-semibold text-lg transition-colors';

const variants: Record<string, string> = {
  primary: 'bg-sage text-[#1A1A1A] hover:bg-sage/80',
  secondary: 'border border-sage text-sage hover:bg-sage/10',
};
---

<a
  href={href}
  class={`${base} ${variants[variant]}`}
>
  <slot />
</a>
```

- [ ] **Step 2: Verify no errors**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/tickets/TicketButton.astro
git commit -m "feat: add TicketButton component replacing HelloAssoButton"
```

---

### Task 4: Update PricingCard with i18n support

**Files:**
- Modify: `src/components/tickets/PricingCard.astro`

- [ ] **Step 1: Replace the entire file**

```astro
---
// src/components/tickets/PricingCard.astro
import { useTranslations } from '../../i18n/utils';

interface Props {
  name: string;
  fullPrice: string;
  reducedPrice: string;
  includes: string[];
  highlighted?: boolean;
  locale: 'fr' | 'en';
  href?: string;
}

const { name, fullPrice, reducedPrice, includes, highlighted = false, locale, href } = Astro.props;
const t = useTranslations(locale);
---

<div class={`rounded-card p-8 ${highlighted ? 'bg-sage/20 border-2 border-sage' : 'bg-contrast'} ${href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
  {...(href ? { 'data-ticket-href': href } : {})}>
  <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-6">{name}</h3>

  <div class="mb-6">
    <div class="flex items-baseline gap-2 mb-2">
      <span class="font-serif text-3xl font-bold text-[#1A1A1A]">{fullPrice}</span>
      <span class="font-sans text-sm text-gray-500">{t('tickets.full')}</span>
    </div>
    <div class="flex items-baseline gap-2">
      <span class="font-serif text-xl font-semibold text-gray-700">{reducedPrice}</span>
      <span class="font-sans text-sm text-gray-500">{t('tickets.reduced')}</span>
    </div>
  </div>

  <div class="border-t border-gray-200 pt-4 mb-6">
    <p class="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('tickets.includes')}</p>
    <ul class="space-y-2">
      {includes.map((item) => (
        <li class="flex items-start gap-2 font-sans text-sm text-gray-700">
          <span class="text-sage mt-0.5">✓</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
</div>
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx astro check`
Expected: PASS (pages using PricingCard without `locale` prop will error — we fix those in Tasks 8-9)

- [ ] **Step 3: Commit**

```bash
git add src/components/tickets/PricingCard.astro
git commit -m "feat: add locale prop and i18n labels to PricingCard"
```

---

### Task 5: Create TicketWidget.astro (Weezevent iFrame)

**Files:**
- Create: `src/components/tickets/TicketWidget.astro`

- [ ] **Step 1: Write the component**

```astro
---
// src/components/tickets/TicketWidget.astro
// Embedded Weezevent ticket widget via iFrame with lazy-loading
// TODO: Replace WEEZEVENT_EVENT_ID with actual Weezevent multi-event module ID

interface Props {
  eventId: string;
  locale: 'fr' | 'en';
}

const { eventId, locale } = Astro.props;

// Weezevent widget URL — color C4E0C4 is the site's sage green (hex without #)
const widgetUrl = `https://www.weezevent.com/widget_billeterie.php?id_evenement=${eventId}&locale=${locale}&color=C4E0C4`;
const isFrench = locale === 'fr';

const loadingText = isFrench ? 'Chargement de la billetterie…' : 'Loading tickets…';
const errorText = isFrench
  ? 'La billetterie met du temps à charger. Vous pouvez aussi réserver directement.'
  : 'The ticket widget is taking a while. You can also book directly.';
const fallbackLabel = isFrench ? 'Ouvrir la billetterie Weezevent' : 'Open Weezevent ticketing';
const widgetTitle = isFrench ? 'Achetez vos billets' : 'Buy your tickets';
---

<div
  id="tickets"
  class="weezevent-widget w-full min-h-[600px]"
  data-widget-url={widgetUrl}
  data-fallback-url={`https://www.weezevent.com/widget_billeterie.php?id_evenement=${eventId}`}
>
  <!-- Skeleton loader (visible until iFrame loads) -->
  <div class="weezevent-skeleton w-full min-h-[600px] bg-gray-100 rounded-card animate-pulse flex items-center justify-center">
    <p class="font-sans text-gray-400">{loadingText}</p>
  </div>

  <!-- Error fallback (hidden by default, shown on timeout) -->
  <div class="weezevent-error hidden w-full text-center py-12">
    <p class="font-sans text-gray-600 mb-4">{errorText}</p>
    <a
      href={`https://www.weezevent.com/widget_billeterie.php?id_evenement=${eventId}`}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center px-6 py-3 bg-sage text-[#1A1A1A] rounded-card font-semibold text-sm hover:bg-sage/80 transition-colors"
    >
      {fallbackLabel}
    </a>
  </div>
</div>

<script>
  const widgetEl = document.querySelector('.weezevent-widget') as HTMLElement | null;
  if (!widgetEl) throw new Error('TicketWidget root not found');

  const widgetUrl = widgetEl.dataset.widgetUrl!;
  const skeleton = widgetEl.querySelector('.weezevent-skeleton') as HTMLElement;
  const errorEl = widgetEl.querySelector('.weezevent-error') as HTMLElement;

  // Lazy-load iFrame when user scrolls near the widget
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          loadIframe();
          observer.disconnect();
        }
      }
    },
    { rootMargin: '200px' },
  );

  let timeoutId: ReturnType<typeof setTimeout>;

  function loadIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = widgetUrl + '&o=site';
    iframe.width = '100%';
    iframe.height = '700';
    iframe.frameBorder = '0';
    iframe.scrolling = 'auto';
    iframe.setAttribute('title', widgetEl.closest('[data-widget-title]')?.getAttribute('data-widget-title') || 'Ticket widget');
    iframe.setAttribute('loading', 'lazy');
    iframe.style.border = 'none';

    // Show error fallback after 10s timeout
    timeoutId = setTimeout(() => {
      skeleton.classList.add('hidden');
      errorEl.classList.remove('hidden');
    }, 10000);

    iframe.addEventListener('load', () => {
      clearTimeout(timeoutId);
      skeleton.classList.add('hidden');
      if (iframe.parentNode) {
        // iFrame loaded successfully
      }
    });

    iframe.addEventListener('error', () => {
      clearTimeout(timeoutId);
      skeleton.classList.add('hidden');
      errorEl.classList.remove('hidden');
    });

    widgetEl.appendChild(iframe);
  }

  // Start observing immediately
  observer.observe(widgetEl);
</script>
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/tickets/TicketWidget.astro
git commit -m "feat: add TicketWidget with lazy-loaded Weezevent iFrame"
```

---

### Task 6: Update ConcertCard (helloAssoLink → ticketUrl, i18n)

**Files:**
- Modify: `src/components/concerts/ConcertCard.astro`

- [ ] **Step 1: Replace the entire file**

```astro
---
// src/components/concerts/ConcertCard.astro
interface Props {
  title: string;
  date: string;
  summary: string;
  image?: string;
  ticketUrl?: string;
  ticketLabel?: string;
}

const { title, date, summary, image, ticketUrl, ticketLabel } = Astro.props;

const defaultLabel = ticketLabel || 'Réserver';
const href = ticketUrl || '/billetterie/#tickets';
---

<div class="bg-contrast rounded-card overflow-hidden">
  {image && (
    <img src={image} alt={title} class="w-full h-48 object-cover" />
  )}
  <div class="p-6">
    <span class="inline-block px-3 py-1 bg-sage/30 rounded-full text-xs font-sans font-semibold text-[#1A1A1A] mb-3">
      {date}
    </span>
    <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-3">{title}</h3>
    <p class="font-sans text-sm text-gray-700 leading-relaxed mb-4">{summary}</p>
    <a
      href={href}
      class="inline-flex items-center justify-center px-4 py-2 bg-sage text-[#1A1A1A] rounded-card font-semibold text-sm hover:bg-sage/80 transition-colors"
    >
      {defaultLabel}
    </a>
  </div>
</div>
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/concerts/ConcertCard.astro
git commit -m "feat: rename helloAssoLink to ticketUrl in ConcertCard, add ticketLabel prop"
```

---

### Task 7: Update ConcertList (prop rename helloAssoLink → ticketUrl)

**Files:**
- Modify: `src/components/concerts/ConcertList.astro`

- [ ] **Step 1: Replace the entire file**

```astro
---
// src/components/concerts/ConcertList.astro
import ConcertCard from './ConcertCard.astro';

interface Concert {
  title: string;
  date: string;
  summary: string;
  image?: string;
  ticketUrl?: string;
}

interface Props {
  concerts: Concert[];
}

const { concerts } = Astro.props;
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {concerts.map((concert) => (
    <ConcertCard
      title={concert.title}
      date={concert.date}
      summary={concert.summary}
      image={concert.image}
      ticketUrl={concert.ticketUrl}
    />
  ))}
</div>
```

- [ ] **Step 2: Verify no errors**

Run: `npx astro check`
Expected: PASS (callers may have errors until Tasks 12 fixes MDX schema)

- [ ] **Step 3: Commit**

```bash
git add src/components/concerts/ConcertList.astro
git commit -m "feat: rename helloAssoLink to ticketUrl in ConcertList"
```

---

### Task 8: Update billetterie.astro (FR) and en/tickets.astro (EN)

**Files:**
- Modify: `src/pages/billetterie.astro`
- Modify: `src/pages/en/tickets.astro`

- [ ] **Step 1: Replace billetterie.astro**

```astro
---
// src/pages/billetterie.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import SectionTitle from '../components/ui/SectionTitle.astro';
import PricingCard from '../components/tickets/PricingCard.astro';
import TicketWidget from '../components/tickets/TicketWidget.astro';
import Card from '../components/ui/Card.astro';
import { useTranslations } from '../i18n/utils';
import { getPricing } from '../data/pricing';

const locale = 'fr' as const;
const t = useTranslations(locale);
const pricing = getPricing(locale, t as (key: string) => string);

// TODO: Replace with actual Weezevent multi-event module ID
const WEEZEVENT_EVENT_ID = 'WEEZEVENT_EVENT_ID';
---

<BaseLayout title="Billetterie — Accords en Valromey" description="Achetez vos billets pour le festival Accords en Valromey">
  <section class="relative h-64 md:h-80 overflow-hidden">
    <div class="absolute inset-0 bg-[#1A1A1A]/40 z-10"></div>
    <img
      src="/images/scenery/eglise.jpg"
      alt="Concert"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="relative z-20 flex items-center justify-center h-full">
      <h1 class="font-serif text-4xl md:text-5xl font-bold text-contrast">Billetterie</h1>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-6 py-section">
    <SectionTitle
      title="Tarifs"
      subtitle="Choisissez la formule qui vous convient et réservez en ligne."
    />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {pricing.map((tier) => (
        <PricingCard
          name={tier.name}
          fullPrice={tier.fullPrice}
          reducedPrice={tier.reducedPrice}
          includes={tier.includes}
          highlighted={tier.highlighted}
          locale={locale}
        />
      ))}
    </div>
    <p class="text-center font-sans text-sm text-gray-500 mt-6">Gratuit pour les moins de 18 ans. Tarif réduit pour les étudiants et les demandeurs d'emploi.</p>
  </section>

  <section class="bg-contrast py-section">
    <div class="max-w-2xl mx-auto px-6">
      <TicketWidget eventId={WEEZEVENT_EVENT_ID} locale={locale} />
    </div>
  </section>

  <section class="max-w-3xl mx-auto px-6 py-section">
    <div class="grid grid-cols-1 gap-8">
    <Card>
      <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">Réservation</h3>
      <p class="font-sans text-gray-700 leading-relaxed">
        Il est vivement recommandé de réserver vos billets en ligne. Une billetterie sur place
        sera également disponible dans la limite des places restantes. Pour toute question, vous pouvez nous
        écrire à <a href="mailto:contact@accordsenvalromey.com" class="underline">contact@accordsenvalromey.com</a>.
      </p>
    </Card>
    <Card>
      <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">Ce que comprend votre billet</h3>
      <p class="font-sans text-gray-700 leading-relaxed">
        Chaque billet comprend un livret programme imprimé ainsi qu'une boisson de votre choix lors du cocktail
        d'après-concert. Les cocktails dînatoires sont assurés par notre partenaire La Barque dans la salle des
        fêtes de la Maison de Pays, juste en face de l'église Saint-Pierre.
      </p>
    </Card>
    <Card>
      <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">Déroulé d'un concert</h3>
      <p class="font-sans text-gray-700 leading-relaxed">
        Chaque concert dure environ 90 minutes. Les enfants sont les bienvenus : des coloriages et des jeux
        musicaux sont prévus pour les plus jeunes. Si vous souhaitez prolonger la soirée, le restaurant La
        Barque vous accueille avant ou après le concert.
      </p>
    </Card>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Replace en/tickets.astro**

```astro
---
// src/pages/en/tickets.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import SectionTitle from '../../components/ui/SectionTitle.astro';
import PricingCard from '../../components/tickets/PricingCard.astro';
import TicketWidget from '../../components/tickets/TicketWidget.astro';
import Card from '../../components/ui/Card.astro';
import { useTranslations } from '../../i18n/utils';
import { getPricing } from '../../data/pricing';

const locale = 'en' as const;
const t = useTranslations(locale);
const pricing = getPricing(locale, t as (key: string) => string);

// TODO: Replace with actual Weezevent multi-event module ID
const WEEZEVENT_EVENT_ID = 'WEEZEVENT_EVENT_ID';
---

<BaseLayout title="Tickets — Accords en Valromey" description="Buy tickets for the Accords en Valromey festival" lang="en">
  <section class="relative h-64 md:h-80 overflow-hidden">
    <div class="absolute inset-0 bg-[#1A1A1A]/40 z-10"></div>
    <img
      src="/images/scenery/eglise.jpg"
      alt="Concert"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <div class="relative z-20 flex items-center justify-center h-full">
      <h1 class="font-serif text-4xl md:text-5xl font-bold text-contrast">Tickets</h1>
    </div>
  </section>

  <section class="max-w-7xl mx-auto px-6 py-section">
    <SectionTitle
      title="Pricing"
      subtitle="Choose the package that suits you and book online."
    />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {pricing.map((tier) => (
        <PricingCard
          name={tier.name}
          fullPrice={tier.fullPrice}
          reducedPrice={tier.reducedPrice}
          includes={tier.includes}
          highlighted={tier.highlighted}
          locale={locale}
        />
      ))}
    </div>
    <p class="text-center font-sans text-sm text-gray-500 mt-6">Free for under-18s. Reduced pricing is available for students and unemployed audience members.</p>
  </section>

  <section class="bg-contrast py-section">
    <div class="max-w-2xl mx-auto px-6">
      <TicketWidget eventId={WEEZEVENT_EVENT_ID} locale={locale} />
    </div>
  </section>

  <section class="max-w-3xl mx-auto px-6 py-section">
    <div class="grid grid-cols-1 gap-8">
    <Card>
      <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">Booking</h3>
      <p class="font-sans text-gray-700 leading-relaxed">
        Online booking is strongly recommended. Tickets will also be sold on site subject to
        availability. For any question, contact <a href="mailto:contact@accordsenvalromey.com" class="underline">contact@accordsenvalromey.com</a>.
      </p>
    </Card>
    <Card>
      <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">What your ticket includes</h3>
      <p class="font-sans text-gray-700 leading-relaxed">
        Every ticket includes a printed program booklet and one drink at the post-concert cocktail. These
        cocktail receptions are prepared by our partner La Barque in the Maison de Pays hall, just across from
        Saint-Pierre church.
      </p>
    </Card>
    <Card>
      <h3 class="font-serif text-xl font-semibold text-[#1A1A1A] mb-4">Concert Experience</h3>
      <p class="font-sans text-gray-700 leading-relaxed">
        Each concert lasts about 90 minutes. Children are welcome, with coloring sheets and music games
        available for younger audience members. If you would like a more substantial meal before or after the
        concert, La Barque is only a few steps from the church.
      </p>
    </Card>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npx astro check`
Expected: PASS (may have HelloAssoButton import errors — we delete in Task 13)

- [ ] **Step 4: Commit**

```bash
git add src/pages/billetterie.astro src/pages/en/tickets.astro
git commit -m "feat: replace HelloAsso CTA with Weezevent widget on ticket pages, use centralized pricing"
```

---

### Task 9: Update programmation.astro (FR) and en/program.astro (EN)

**Files:**
- Modify: `src/pages/programmation.astro`
- Modify: `src/pages/en/program.astro`

- [ ] **Step 1: Update programmation.astro — replace ticketLink URLs**

In `src/pages/programmation.astro`, change all three `ticketLink` values from:
```
ticketLink: 'https://www.helloasso.com/associations/accords-en-valromey',
```
to:
```
ticketLink: '/billetterie/',
```
And change all `ticketLabel` from `'Réserver'` to `'Réserver'` (unchanged).

- [ ] **Step 2: Update en/program.astro — replace ticketLink URLs**

In `src/pages/en/program.astro`, change all three `ticketLink` values from:
```
ticketLink: 'https://www.helloasso.com/associations/accords-en-valromey',
```
to:
```
ticketLink: '/en/tickets/',
```

- [ ] **Step 3: Verify no errors**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/pages/programmation.astro src/pages/en/program.astro
git commit -m "feat: redirect program page ticket links to billetterie/tickets pages"
```

---

### Task 10: Update index.astro — price text from pricing.ts

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update the NextConcert description to use pricing data**

In `src/pages/index.astro`, add import:
```typescript
import { pricingTiers } from '../data/pricing';
```

Replace lines 45-46 (the NextConcert description with hardcoded prices):

For FR:
```typescript
description={locale === 'fr'
  ? `Un voyage dans la musique de chambre du XXe siècle avec Chostakovitch, Lili Boulanger, Ravel et Rebecca Clarke, à l'église Saint-Pierre. Billets à partir de ${pricingTiers[0].fullPrice} €, pass 2 jours à ${pricingTiers[1].fullPrice} € et pass 3 jours à ${pricingTiers[2].fullPrice} €.`
```

For EN:
```typescript
: `A journey through 20th century chamber music with Shostakovich, Lili Boulanger, Ravel, and Rebecca Clarke in Saint-Pierre church. Tickets start at €${pricingTiers[0].fullPrice}, with a 2-day pass at €${pricingTiers[1].fullPrice} and a 3-day pass at €${pricingTiers[2].fullPrice}.`
```

- [ ] **Step 2: Verify no errors**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: use centralized pricing data in home page price text"
```

---

### Task 11: Update TinaCMS schema (helloAssoLink → ticketUrl)

**Files:**
- Modify: `tina/config.ts`
- Modify: `src/content/concerts/fr/opening-2026.mdx`
- Modify: `src/content/concerts/fr/second-concert-2026.mdx`
- Modify: `src/content/concerts/fr/closing-2026.mdx`
- Modify: `src/content/concerts/en/opening-2026.mdx`
- Modify: `src/content/concerts/en/second-concert-2026.mdx`
- Modify: `src/content/concerts/en/closing-2026.mdx`

- [ ] **Step 1: Update tina/config.ts — rename the field**

In `tina/config.ts` lines 76-81, change:
```typescript
{
  type: 'string',
  name: 'helloAssoLink',
  label: 'Lien HelloAsso',
  description: 'URL de la billetterie pour ce concert',
},
```
to:
```typescript
{
  type: 'string',
  name: 'ticketUrl',
  label: 'Lien billetterie',
  description: 'URL de la billetterie pour ce concert (optionnel — laisse vide pour rediriger vers la page billetterie)',
},
```

- [ ] **Step 2: Update all 6 concert MDX files — rename helloAssoLink to ticketUrl**

For each of the 6 files in `src/content/concerts/{fr,en}/*.mdx`, change:
```
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/...
```
to (leave empty — will redirect to /billetterie/#tickets):
```
ticketUrl:
```
Or alternatively set to a Weezevent per-event URL if available.

- [ ] **Step 3: Regenerate Tina types and lock file**

Run:
```bash
npx tinacms dev
```
Wait for the dev server to start and generate types, then stop it (Ctrl+C).

This regenerates:
- `tina/__generated__/types.ts`
- `tina/__generated__/_schema.json`
- `tina/__generated__/_graphql.json`
- `tina/tina-lock.json`

- [ ] **Step 4: Verify build still works**

Run: `npx astro check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tina/config.ts tina/__generated__/ tina/tina-lock.json src/content/concerts/
git commit -m "feat(tina): rename helloAssoLink to ticketUrl in concert schema and content"
```

---

### Task 12: Delete HelloAssoButton.astro

**Files:**
- Delete: `src/components/tickets/HelloAssoButton.astro`

- [ ] **Step 1: Delete the file**

Run:
```bash
rm src/components/tickets/HelloAssoButton.astro
```

- [ ] **Step 2: Verify no import errors**

Run: `npx astro check`
Expected: PASS (no remaining imports of HelloAssoButton)

- [ ] **Step 3: Commit**

```bash
git add src/components/tickets/HelloAssoButton.astro
git commit -m "chore: remove unused HelloAssoButton component"
```

---

### Task 13: Final verification — build and diagnostics

- [ ] **Step 1: LSP diagnostics on all changed files**

Run: `npx astro check`
Expected: PASS with 0 errors

- [ ] **Step 2: Full production build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Verify no remaining HelloAsso references in billetterie code**

Run:
```bash
grep -r "helloasso\|HelloAsso" src/pages/billetterie.astro src/pages/en/tickets.astro src/pages/programmation.astro src/pages/en/program.astro src/components/concerts/ src/components/tickets/
```
Expected: No output (0 matches)

- [ ] **Step 4: Verify Weezevent widget URL placeholder is documented**

Confirm `WEEZEVENT_EVENT_ID` placeholder appears in a TODO comment in both billetterie.astro and en/tickets.astro. This is intentional — the actual ID comes from Weezevent back-office configuration.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: final verification and cleanup for Weezevent migration"
```
