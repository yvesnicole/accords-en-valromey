# Weezevent Integration — Design Spec

> Remplacement de HelloAsso par Weezevent pour la billetterie du festival Accords en Valromey
> Date: 2026-05-29 | Approche retenue: B — Widget intégré + composant propre

## Prérequis (à faire côté Weezevent)

Avant l'implémentation sur le site, configurer dans le back-office Weezevent (`Canaux de vente > Modules de billetterie`) :
- Créer un **module multi-événements** regroupant les 3 concerts (ouverture, 2e concert, clôture)
- Récupérer l'**ID du module** (`id_evenement`) pour le widget iFrame
- Configurer la **couleur** du widget : `#C4E0C4` (le `sage` du site) — vérifier le format accepté (hex avec ou sans `#`)
- **Paramètre `locale`** : vérifier si Weezevent supporte `?locale=fr` / `?locale=en` dans l'URL du widget. Si non supporté, le widget s'affichera dans la langue du navigateur du visiteur (détection automatique)

## Scope

- **Inclus** : billetterie (pages tickets, programmation, fiches concert)
- **Exclus** : adhésions et dons (restent sur HelloAsso via les pages `soutenir` / `support-us`)
- **Plateforme** : Weezevent (widget iFrame, pas d'API de paiement disponible)

## Objectif UX

Le visiteur achète ses billets **sans jamais quitter le site** `accordsenvalromey.com`. Le checkout Weezevent est chargé en iFrame sur la page billetterie. Les PricingCards sont cliquables et déclenchent un scroll vers le widget.

---

## Architecture

### Nouveaux composants

| Composant | Rôle |
|---|---|
| `src/components/tickets/TicketButton.astro` | Bouton générique de billetterie (remplace `HelloAssoButton`) — props: `href`, `label`, `variant`, `external` |
| `src/components/tickets/TicketWidget.astro` | iFrame Weezevent avec lazy-loading et skeleton loader — props: `eventId`, `locale` |
| `src/data/pricing.ts` | Source unique des tarifs — exporte `getPricing(locale)` et `pricingTiers` |

### Composants modifiés

| Composant | Changement |
|---|---|
| `PricingCard.astro` | + prop `locale: 'fr' \| 'en'` — labels « Plein tarif / Full price » et « Tarif réduit / Reduced price » via `useTranslations(locale)` |
| `ConcertCard.astro` | `helloAssoLink` → `ticketUrl` (optionnel). Si absent, bouton « Réserver » → `/billetterie/#tickets`. Label i18nisé via prop `locale`. |

### Composants supprimés

| Fichier | Raison |
|---|---|
| `HelloAssoButton.astro` | Remplacé par `TicketButton.astro` |

### Flux utilisateur

```
/billetterie/ (FR) ou /en/tickets/ (EN)
  ├── PricingCards (Billet unique, Pass 2j, Pass 3j)
  │     └── Clic → scroll fluide vers #tickets (le widget)
  └── TicketWidget (iFrame Weezevent, lazy-loaded)
        └── Checkout dans l'iFrame — l'utilisateur ne quitte jamais le site
```

---

## Données

### `src/data/pricing.ts`

```typescript
export const pricingTiers = [
  { key: 'single',  fullPrice: 24, reducedPrice: 21, includesKeys: ['concert', 'program', 'cocktail'],   count: 1, highlighted: false },
  { key: 'pass2',   fullPrice: 45, reducedPrice: 39, includesKeys: ['concerts', 'programs', 'cocktails'], count: 2, highlighted: true  },
  { key: 'pass3',   fullPrice: 63, reducedPrice: 54, includesKeys: ['concerts', 'programs', 'cocktails'], count: 3, highlighted: false },
];

export function getPricing(locale: 'fr' | 'en'): PricingDisplay[] {
  // Formate les prix (24 → "24 €"), traduit les libellés includes via les clés i18n
}
```

Les pages `billetterie.astro` et `en/tickets.astro` appellent `getPricing('fr')` / `getPricing('en')` au lieu de hardcoder les prix.

### TinaCMS — collection `concert`

| Champ | Avant | Après |
|---|---|---|
| Nom | `helloAssoLink` | `ticketUrl` |
| Type | `string` | `string` |
| Label | « Lien HelloAsso » | « Lien billetterie » |
| Requis | Non (optionnel) | Non (optionnel) |
| Description | « URL de la billetterie pour ce concert » | Inchangé |

### Concerts MDX — migration

Les 6 fichiers MDX (`src/content/concerts/{fr,en}/*.mdx`) voient leur champ `helloAssoLink` renommé en `ticketUrl`. La valeur devient une URL Weezevent ou est laissée vide (le bouton redirige alors vers `/billetterie/#tickets`).

Après modification du schéma Tina, exécuter `tinacms dev` pour régénérer `tina/__generated__/` et `tina/tina-lock.json`.

---

## i18n

### Nouvelles clés (`src/i18n/ui.ts`)

À ajouter dans `fr` et `en`:

| Clé | FR | EN |
|---|---|---|
| `tickets.book` | Réserver | Book |
| `tickets.full` | Plein tarif | Full price |
| `tickets.reduced` | Tarif réduit | Reduced price |
| `tickets.loading` | Chargement de la billetterie… | Loading tickets… |
| `tickets.widget.title` | Achetez vos billets | Buy your tickets |

### Corrections de bugs i18n

- `PricingCard.astro` : les labels `plein tarif` et `tarif réduit` étaient hardcodés en français, même sur la page EN. → utilisent désormais `useTranslations(locale)`.
- `ConcertCard.astro` : le label « Réserver » était hardcodé. → i18nisé via prop `locale`.

---

## Plan de migration des URLs

### Mapping HelloAsso → Weezevent

| Emplacement | Avant (HelloAsso) | Après (Weezevent) |
|---|---|---|
| Page billetterie CTA | Lien externe `helloasso.com/...` | Widget iFrame (ID événement Weezevent) |
| Page tickets EN CTA | Idem | Widget iFrame (même ID) |
| ConcertCard « Réserver » | `helloAssoLink` individuel par concert | `/billetterie/#tickets` (si `ticketUrl` vide) ou `ticketUrl` direct |
| ConcertCarousel modal | `ticketLink` générique HelloAsso | `/billetterie/` |
| Pages soutenir/support-us | HelloAsso (adhésion + dons) | **Inchangé** |

### Liste exhaustive des fichiers modifiés

| Fichier | Action |
|---|---|
| `src/components/tickets/HelloAssoButton.astro` | Supprimé |
| `src/components/tickets/TicketButton.astro` | Créé |
| `src/components/tickets/PricingCard.astro` | Modifié (+ `locale`, labels i18n) |
| `src/components/tickets/TicketWidget.astro` | Créé |
| `src/components/concerts/ConcertCard.astro` | Modifié (`helloAssoLink` → `ticketUrl`, label i18n) |
| `src/components/concerts/ConcertList.astro` | Modifié (prop `helloAssoLink` → `ticketUrl`) |
| `src/data/pricing.ts` | Créé |
| `src/pages/billetterie.astro` | Modifié (widget Weezevent, pricing.ts) |
| `src/pages/en/tickets.astro` | Modifié (widget Weezevent, pricing.ts) |
| `src/pages/programmation.astro` | Modifié (`ticketLink`, `ticketLabel`) |
| `src/pages/en/program.astro` | Modifié (`ticketLink`, `ticketLabel`) |
| `src/pages/index.astro` | Modifié (prix depuis pricing.ts) |
| `src/i18n/ui.ts` | Modifié (+ 5 clés) |
| `tina/config.ts` | Modifié (`helloAssoLink` → `ticketUrl`) |
| `src/content/concerts/fr/*.mdx` (×3) | Modifié (champ renommé) |
| `src/content/concerts/en/*.mdx` (×3) | Modifié (champ renommé) |
| `tina/__generated__/` | Régénéré automatiquement |

### Fichiers NON modifiés

- `soutenir.astro` / `en/support-us.astro` — HelloAsso conservé pour adhésions/dons
- `ConcertList.astro` — modifié (renommage de la prop `helloAssoLink` → `ticketUrl`, propagation à ConcertCard)
- `Header.astro`, `Footer.astro` — les routes `/billetterie/` et `/en/tickets/` ne changent pas

---

## TicketWidget.astro — spécifications

### Props

```typescript
interface Props {
  eventId: string;     // ID événement Weezevent (pour le widget multi-événements)
  locale: 'fr' | 'en';
}
```

### Comportement

1. **Lazy-loading** : l'iFrame n'est chargé que lorsque l'utilisateur scrolle à proximité (Intersection Observer, `rootMargin: 200px`)
2. **Skeleton loader** : un placeholder animé (hauteur approximative du widget) s'affiche pendant le chargement
3. **Accessibilité** : l'iFrame a un `title` descriptif
4. **Responsive** : l'iFrame s'adapte en largeur (`width: 100%`), hauteur fixe ou `min-height` selon le contenu Weezevent
5. **Langue** : l'URL de l'iFrame inclut le paramètre de langue si Weezevent le supporte

### URL de l'iFrame

```
https://www.weezevent.com/widget_billeterie.php?id_evenement={eventId}&locale={fr|en}&color=C4E0C4
```

- `id_evenement` : ID du module multi-événements récupéré dans le back-office Weezevent
- `locale` : paramètre **à vérifier** — si Weezevent ne le supporte pas, le widget détecte automatiquement la langue du navigateur
- `color` : couleur de l'interface Weezevent. Format **à vérifier** (probablement hex sans `#`)

---

## Edge cases & gestion d'erreurs

| Cas | Comportement |
|---|---|
| Widget Weezevent non chargé (timeout réseau) | Message d'erreur + lien de fallback vers la page Weezevent externe |
| ID événement absent / invalide | Le widget n'est pas rendu, un message « Billetterie bientôt disponible » s'affiche |
| JavaScript désactivé | L'iFrame est chargé statiquement (pas de lazy-loading), le site reste fonctionnel |
| Événement Weezevent clôturé | Le widget Weezevent affiche son propre message « Ventes terminées » dans l'iFrame |

---

## Non-fonctionnel

- **Performance** : lazy-loading de l'iFrame → pas d'impact sur le LCP de la page
- **Tracking** : pas de tracking spécifique dans cette phase (pourra être ajouté via GTM/GA4 ultérieurement)
- **Accessibilité** : `title` sur l'iFrame, contraste des couleurs respecté
- **i18n** : 100% des chaînes de l'interface site sont dans `ui.ts`, rien en dur
