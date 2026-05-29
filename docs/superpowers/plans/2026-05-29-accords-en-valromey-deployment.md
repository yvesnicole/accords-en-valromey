# Accords en Valromey — Deployment & CMS Finalization

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the site to GitHub, enable non-technical content editing via Tina Cloud, deploy to fly.io, and create the missing EN home page plus initial Tina CMS content.

**Architecture:** Three independent tracks. Track A (GitHub + Tina Cloud) and Track B (fly.io) can start in parallel. Track C (content + missing page) follows once A and B are done. The existing Astro 5 SSG, Tailwind 4, Docker/Nginx, and CI/CD pipeline are already in place — only credentials, remote setup, and content population remain.

**Tech Stack:** Astro 5.5, Tina CMS 3.x, Tailwind CSS 4, Nginx (Alpine), fly.io, GitHub Actions, Tina Cloud (free tier)

---

## File Structure (changes only)

```
accords-en-valromey/
├── .github/workflows/deploy.yml          # MODIFY: add PUBLIC_TINA_CLIENT_ID env
├── .env                                    # MODIFY: add Tina Cloud credentials
├── src/pages/en/index.astro               # CREATE: EN home page (mirror of FR)
└── src/content/                           # CREATE: initial MDX files (concerts, musicians, pages)
```

No other files are created or modified — the architecture is complete.

---

## Track A — GitHub + Tina Cloud

### Task A.1: Create GitHub repo and push

**Files:**
- None (git operations only)

- [ ] **Step 1: Create public GitHub repo**

Go to https://github.com/new — create a public repo named `accords-en-valromey`. Do NOT initialize with README, .gitignore, or license (repo already has these).

- [ ] **Step 2: Add remote and push**

```bash
git remote add origin git@github.com:<your-github-username>/accords-en-valromey.git
git push -u origin main
```

Expected: push succeeds, all ~21 commits appear on GitHub.

- [ ] **Step 3: Verify on GitHub**

Open `https://github.com/<your-github-username>/accords-en-valromey` — confirm all files are visible.

---

### Task A.2: Configure Tina Cloud

**Files:**
- Modify: `.env` (add credentials)

- [ ] **Step 1: Register repo on Tina Cloud**

1. Go to https://app.tina.io
2. Sign in with GitHub
3. Click "Add Site" → select `accords-en-valromey` repo
4. Choose "Tina Cloud" as the auth provider
5. Copy the **Client ID** and **Token** displayed

- [ ] **Step 2: Create a read-only token for CI builds**

In Tina Cloud dashboard → your site → Tokens → "Create Token" → give it a name like "CI Build" → copy the token.

This token is needed because `tinacms build --content=local` (run in CI) requires Tina Cloud auth to generate the GraphQL client.

- [ ] **Step 3: Update local `.env`**

Replace the current `.env` content with:

```
PUBLIC_TINA_CLIENT_ID=<client-id-from-tina-cloud>
TINA_TOKEN=<token-from-tina-cloud>
PUBLIC_TINA_IS_LOCAL=false
```

- [ ] **Step 4: Verify Tina dev server works with Cloud credentials**

```bash
npm run dev
```

Expected: Tina starts without auth errors. Open `http://localhost:4321/admin` — Tina admin should load. If it shows a login screen, Tina Cloud is configured correctly.

- [ ] **Step 5: Verify `PUBLIC_TINA_IS_LOCAL` is in `.gitignore`**

```bash
grep -q '^\.env$' .gitignore && echo "OK: .env is gitignored" || echo "ERROR: .env not in .gitignore"
```

Expected: `OK: .env is gitignored`

---

### Task A.3: Add secrets to GitHub

- [ ] **Step 1: Add TINA_TOKEN secret**

```bash
gh secret set TINA_TOKEN -b "<read-only-token-from-tina-cloud>"
```

- [ ] **Step 2: Add FLY_API_TOKEN secret**

```bash
flyctl tokens create deploy -x 9999h
# Copy the token, then:
gh secret set FLY_API_TOKEN -b "<fly-deploy-token>"
```

- [ ] **Step 3: Add PUBLIC_TINA_CLIENT_ID**

This is NOT a secret (it's public, embedded in the client-side JS). But the CI build needs it. Add it as a workflow-level env var:

Read `.github/workflows/deploy.yml` and modify — add `env:` block at the job level:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      PUBLIC_TINA_CLIENT_ID: ${{ secrets.PUBLIC_TINA_CLIENT_ID }}
      TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
    steps:
```

The `TINA_TOKEN` is already consumed by `tinacms build --content=local`. Adding it as job-level `env` ensures it's available.

Full modified `deploy.yml`:

```yaml
name: Deploy to fly.io

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      PUBLIC_TINA_CLIENT_ID: ${{ secrets.PUBLIC_TINA_CLIENT_ID }}
      TINA_TOKEN: ${{ secrets.TINA_TOKEN }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx astro check

      - name: Build (Tina + Astro)
        run: npm run build

      - name: Setup flyctl
        uses: superfly/flyctl-actions/setup-flyctl@master

      - name: Deploy
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

- [ ] **Step 4: Add PUBLIC_TINA_CLIENT_ID as a GitHub variable (not secret)**

```bash
gh variable set PUBLIC_TINA_CLIENT_ID -b "<client-id-from-tina-cloud>"
```

Actually, the workflow uses `${{ secrets.PUBLIC_TINA_CLIENT_ID }}` — GitHub Actions doesn't have a `vars` context by default for simple repos. To keep things simple, use a secret even though the value is public:

```bash
gh secret set PUBLIC_TINA_CLIENT_ID -b "<client-id-from-tina-cloud>"
```

- [ ] **Step 5: Commit the workflow change**

```bash
git add .github/workflows/deploy.yml
git commit -m "fix: add Tina Cloud env vars to CI pipeline (PUBLIC_TINA_CLIENT_ID, TINA_TOKEN)"
git push
```

---

## Track B — fly.io

### Task B.1: Create and configure fly.io app

- [ ] **Step 1: Install flyctl (if not already installed)**

```bash
which flyctl || curl -L https://fly.io/install.sh | sh
```

- [ ] **Step 2: Authenticate with fly.io**

```bash
flyctl auth login
```

Expected: opens browser, you log in, flyctl confirms authentication.

- [ ] **Step 3: Create the app (imports existing fly.toml)**

```bash
flyctl launch --no-deploy
```

- When prompted "App name": `accords-en-valromey` (should auto-detect from fly.toml)
- When prompted "Region": `cdg` (Paris) — should auto-detect
- When prompted "Deploy now?": No (we use `--no-deploy` flag)
- When prompted "Would you like to set up a Postgres database?": No
- When prompted "Would you like to set up an Upstash Redis database?": No

Expected: app created, `fly.toml` unchanged (already correct).

- [ ] **Step 4: Verify app exists**

```bash
flyctl status -c fly.toml
```

Expected: shows app `accords-en-valromey` with status "pending" (no deployments yet).

---

### Task B.2: Verify Docker build locally

- [ ] **Step 1: Build Docker image**

```bash
docker build -t accords-en-valromey .
```

Expected: build completes, three stages run (deps → builder → runtime), no errors. Final line: `naming to docker.io/library/accords-en-valromey`

- [ ] **Step 2: Run container and test**

```bash
docker run --rm -d -p 8080:80 --name aev-test accords-en-valromey
sleep 3
curl -s http://localhost:8080/ | head -20
```

Expected: returns HTML (the Astro-generated home page with `<html lang="fr">`, `<title>`, etc.)

- [ ] **Step 3: Stop and clean up container**

```bash
docker stop aev-test
```

---

### Task B.3: Deploy via GitHub Actions

- [ ] **Step 1: Verify FLY_API_TOKEN secret is set**

```bash
gh secret list | grep FLY_API_TOKEN
```

Expected: `FLY_API_TOKEN` appears in the list.

- [ ] **Step 2: Trigger deployment**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add Tina Cloud env vars, trigger first deploy"
git push origin main
```

- [ ] **Step 3: Monitor GitHub Actions**

Open `https://github.com/<your-github-username>/accords-en-valromey/actions` — the "Deploy to fly.io" workflow should start automatically. Watch for success.

- [ ] **Step 4: Verify site is live**

```bash
curl -s https://accords-en-valromey.fly.dev/ | head -20
```

Expected: returns the same HTML as the local Docker test.

---

## Track C — Content & Missing Page

### Task C.1: Verify full build passes

- [ ] **Step 1: Clean and rebuild**

```bash
rm -rf dist tina/__generated__
npm run build
```

Expected: `tinacms build --content=local` generates the Tina client, then `astro build` generates `dist/`. No errors.

- [ ] **Step 2: Type check**

```bash
npx astro check
```

Expected: zero errors.

---

### Task C.2: Create EN home page

**Files:**
- Create: `src/pages/en/index.astro`

The FR home page (`src/pages/index.astro`) already contains bilingual content via inline conditionals. The EN page should mirror it — same structure, same components, English strings.

- [ ] **Step 1: Create `src/pages/en/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/home/Hero.astro';
import FestivalIntro from '../../components/home/FestivalIntro.astro';
import NextConcert from '../../components/home/NextConcert.astro';
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const locale = getLangFromUrl(Astro.url);
const t = useTranslations(locale);
---

<BaseLayout title="Accords en Valromey — Classical Music Festival">
  <Hero
    title="Accords en Valromey"
    subtitle="Classical music festival — August 20-22, 2026, Champagne-en-Valromey, Ain"
    ctaLabel={t('hero.cta')}
    ctaHref="/en/program/"
  />
  <FestivalIntro
    title="The Festival"
    description="From August 20 to 22, 2026, Accords en Valromey brings together Ekhi Martinez Imai, Elea Nick, Nicolas Fromonteil, Mariam Chitanava, and Célia Garetti-Nicole in Saint-Pierre church for three evenings devoted to Shostakovich, Lili Boulanger, Ravel, Rebecca Clarke, Alice Lesur, Messiaen, Schumann, Mendelssohn, and Brahms."
    ctaLabel={t('home.discover')}
    ctaHref="/en/the-festival/"
  />
  <NextConcert
    title={t('home.next')}
    concertTitle="Opening Concert"
    date="August 20, 2026 — 7:00 PM"
    description="A journey through 20th century chamber music with Shostakovich, Lili Boulanger, Ravel, and Rebecca Clarke in Saint-Pierre church. Tickets start at €24, with a 2-day pass at €45 and a 3-day pass at €63."
    ctaLabel={t('home.discover')}
    ctaHref="/en/program/"
  />
</BaseLayout>
```

- [ ] **Step 2: Verify page renders**

```bash
npm run dev
```

Open `http://localhost:4321/en/` — verify:
- Page shows "Accords en Valromey — Classical Music Festival" as title
- Hero has English subtitle with dates
- FestivalIntro has English description
- NextConcert shows English concert info

- [ ] **Step 3: Rebuild and verify both locales**

```bash
npm run build
```

Expected: build succeeds, `dist/en/index.html` exists and contains English content.

- [ ] **Step 4: Commit**

```bash
git add src/pages/en/index.astro
git commit -m "feat: add EN home page (mirrors FR with English content)"
```

---

### Task C.3: Push changes to trigger deployment

- [ ] **Step 1: Push all accumulated changes**

```bash
git push origin main
```

- [ ] **Step 2: Monitor deployment**

Open `https://github.com/<your-github-username>/accords-en-valromey/actions` — verify the deploy workflow succeeds.

- [ ] **Step 3: Verify EN home page on fly.io**

```bash
curl -s https://accords-en-valromey.fly.dev/en/ | head -20
```

Expected: English home page HTML.

---

### Task C.4: Create initial Tina CMS content (MDX files)

**Files:**
- Create: `src/content/concerts/fr/opening-2026.mdx`
- Create: `src/content/concerts/en/opening-2026.mdx`
- Create: `src/content/concerts/fr/second-concert-2026.mdx`
- Create: `src/content/concerts/en/second-concert-2026.mdx`
- Create: `src/content/concerts/fr/closing-2026.mdx`
- Create: `src/content/concerts/en/closing-2026.mdx`
- Create: `src/content/musicians/fr/ekhi-martinez-imai.mdx`
- Create: `src/content/musicians/en/ekhi-martinez-imai.mdx`
- Create: `src/content/musicians/fr/elea-nick.mdx`
- Create: `src/content/musicians/en/elea-nick.mdx`
- Create: `src/content/musicians/fr/nicolas-fromonteil.mdx`
- Create: `src/content/musicians/en/nicolas-fromonteil.mdx`
- Create: `src/content/musicians/fr/mariam-chitanava.mdx`
- Create: `src/content/musicians/en/mariam-chitanava.mdx`
- Create: `src/content/musicians/fr/celia-garetti-nicole.mdx`
- Create: `src/content/musicians/en/celia-garetti-nicole.mdx`
- Create: `src/content/pages/fr/le-festival.mdx`
- Create: `src/content/pages/en/the-festival.mdx`
- Create: `src/content/pages/fr/billetterie.mdx`
- Create: `src/content/pages/en/tickets.mdx`
- Create: `src/content/pages/fr/contact.mdx`
- Create: `src/content/pages/en/contact.mdx`
- Create: `src/content/pages/fr/soutenir.mdx`
- Create: `src/content/pages/en/support-us.mdx`

- [ ] **Step 1: Create concert MDX — Opening Concert (FR)**

`src/content/concerts/fr/opening-2026.mdx`:

```mdx
---
title: Concert d'Ouverture
date: 2026-08-20T19:00:00.000Z
locale: fr
translationKey: opening-2026
image: /images/concerts/boulanger-shostakovich.jpg
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/concert-d-ouverture-2026
---

## Programme

**Lili Boulanger** — *D'un matin de printemps* (1918)
**Dmitri Chostakovitch** — *Quatuor à cordes n° 8 en ut mineur, op. 110* (1960)
**Maurice Ravel** — *Trio pour piano, violon et violoncelle en la mineur, M. 67* (1914)
**Rebecca Clarke** — *Trio pour violon, violoncelle et piano* (1921)

---

Un voyage dans la musique de chambre du XXe siècle. De l'impressionnisme lumineux de Lili Boulanger au lyrisme déchirant de Chostakovitch, en passant par la virtuosité de Ravel et les couleurs envoûtantes de Rebecca Clarke.
```

- [ ] **Step 2: Create concert MDX — Opening Concert (EN)**

`src/content/concerts/en/opening-2026.mdx`:

```mdx
---
title: Opening Concert
date: 2026-08-20T19:00:00.000Z
locale: en
translationKey: opening-2026
image: /images/concerts/boulanger-shostakovich.jpg
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/concert-d-ouverture-2026
---

## Program

**Lili Boulanger** — *D'un matin de printemps* (1918)
**Dmitri Shostakovich** — *String Quartet No. 8 in C minor, Op. 110* (1960)
**Maurice Ravel** — *Piano Trio in A minor, M. 67* (1914)
**Rebecca Clarke** — *Trio for Violin, Cello, and Piano* (1921)

---

A journey through 20th century chamber music. From Lili Boulanger's luminous impressionism to Shostakovich's wrenching lyricism, through Ravel's virtuosity and Rebecca Clarke's bewitching colors.
```

- [ ] **Step 3: Create concert MDX — Second Concert (FR)**

`src/content/concerts/fr/second-concert-2026.mdx`:

```mdx
---
title: Deuxième Concert
date: 2026-08-21T19:00:00.000Z
locale: fr
translationKey: second-concert-2026
image: /images/concerts/messiaen-schumann.jpg
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/deuxieme-concert-2026
---

## Programme

**Alice Lesur** — *Quatuor à cordes* (création)
**Olivier Messiaen** — *Quatuor pour la fin du Temps* (1941)
**Robert Schumann** — *Quintette pour piano et cordes en mi bémol majeur, op. 44* (1842)

---

Une soirée placée sous le signe de la transcendance et de la lumière. Découvrez la création d'Alice Lesur, jeune compositrice française, aux côtés du chef-d'œuvre visionnaire de Messiaen et du romantisme éclatant de Schumann.
```

- [ ] **Step 4: Create concert MDX — Second Concert (EN)**

`src/content/concerts/en/second-concert-2026.mdx`:

```mdx
---
title: Second Concert
date: 2026-08-21T19:00:00.000Z
locale: en
translationKey: second-concert-2026
image: /images/concerts/messiaen-schumann.jpg
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/deuxieme-concert-2026
---

## Program

**Alice Lesur** — *String Quartet* (world premiere)
**Olivier Messiaen** — *Quartet for the End of Time* (1941)
**Robert Schumann** — *Piano Quintet in E-flat major, Op. 44* (1842)

---

An evening of transcendence and light. Discover the world premiere by young French composer Alice Lesur, alongside Messiaen's visionary masterpiece and Schumann's radiant romanticism.
```

- [ ] **Step 5: Create concert MDX — Closing Concert (FR)**

`src/content/concerts/fr/closing-2026.mdx`:

```mdx
---
title: Concert de Clôture
date: 2026-08-22T19:00:00.000Z
locale: fr
translationKey: closing-2026
image: /images/concerts/mendelssohn-brahms.jpg
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/concert-de-cloture-2026
---

## Programme

**Felix Mendelssohn** — *Octuor à cordes en mi bémol majeur, op. 20* (1825)
**Johannes Brahms** — *Quintette à deux violoncelles en sol majeur, op. 111* (1890)

---

Le bouquet final du festival. Le génie précoce de Mendelssohn, qui composa son Octuor à 16 ans, dialogue avec la maturité sereine du dernier Brahms. Une soirée de fête et d'émotion.
```

- [ ] **Step 6: Create concert MDX — Closing Concert (EN)**

`src/content/concerts/en/closing-2026.mdx`:

```mdx
---
title: Closing Concert
date: 2026-08-22T19:00:00.000Z
locale: en
translationKey: closing-2026
image: /images/concerts/mendelssohn-brahms.jpg
helloAssoLink: https://www.helloasso.com/associations/accords-en-valromey/evenements/concert-de-cloture-2026
---

## Program

**Felix Mendelssohn** — *String Octet in E-flat major, Op. 20* (1825)
**Johannes Brahms** — *String Quintet No. 2 in G major, Op. 111* (1890)

---

The festival's finale. Mendelssohn's precocious genius — he wrote his Octet at just 16 — meets the serene maturity of Brahms's last chamber work. An evening of celebration and emotion.
```

- [ ] **Step 7: Create musician MDX — Ekhi Martinez Imai (FR)**

`src/content/musicians/fr/ekhi-martinez-imai.mdx`:

```mdx
---
name: Ekhi Martinez Imai
locale: fr
translationKey: ekhi-martinez-imai
instrument: violon
photo: /images/musicians/ekhi.jpg
photoCredit: Jean-Baptiste Millot
---

Né en 1999 à Saint-Sébastien, Ekhi Martinez Imai étudie au Conservatoire Supérieur de Musique du Pays Basque, puis au CNSMDP. Il remporte le Concours International de Violon Pablo Sarasate et le Concours Long-Thibaud.

Ekhi se produit comme soliste et chambriste dans les plus grandes salles : Philharmonie de Paris, Auditorium de Bordeaux, Victoria Hall de Genève. Il joue un violon de Carlo Giuseppe Testore, prêté par un mécène anonyme.
```

- [ ] **Step 8: Create musician MDX — Ekhi Martinez Imai (EN)**

`src/content/musicians/en/ekhi-martinez-imai.mdx`:

```mdx
---
name: Ekhi Martinez Imai
locale: en
translationKey: ekhi-martinez-imai
instrument: violin
photo: /images/musicians/ekhi.jpg
photoCredit: Jean-Baptiste Millot
---

Born in 1999 in San Sebastián, Ekhi Martinez Imai studied at the Superior Conservatory of Music of the Basque Country, then at the CNSMDP in Paris. He won the Pablo Sarasate International Violin Competition and the Long-Thibaud Competition.

Ekhi performs as a soloist and chamber musician in major venues: Philharmonie de Paris, Bordeaux Auditorium, Victoria Hall in Geneva. He plays a violin by Carlo Giuseppe Testore, on loan from an anonymous patron.
```

- [ ] **Step 9: Create musician MDX — Elea Nick (FR)**

`src/content/musicians/fr/elea-nick.mdx`:

```mdx
---
name: Elea Nick
locale: fr
translationKey: elea-nick
instrument: violon
photo: /images/musicians/elea.jpg
photoCredit: Julien Benhamou
---

Elea Nick se forme au CNSMD de Lyon auprès de Marianne Piketty, puis intègre le CNSMDP. Lauréate de la Fondation Banque Populaire, elle remporte le Concours Vatelot-Rampal et se produit régulièrement en musique de chambre.

Passionnée par la transmission, Elea est également professeur et intervient dans des projets pédagogiques destinés aux jeunes publics.
```

- [ ] **Step 10: Create musician MDX — Elea Nick (EN)**

`src/content/musicians/en/elea-nick.mdx`:

```mdx
---
name: Elea Nick
locale: en
translationKey: elea-nick
instrument: violin
photo: /images/musicians/elea.jpg
photoCredit: Julien Benhamou
---

Elea Nick trained at the CNSMD in Lyon under Marianne Piketty before joining the CNSMDP in Paris. A laureate of the Banque Populaire Foundation, she won the Vatelot-Rampal Competition and regularly performs chamber music.

Passionate about education, Elea also teaches and leads educational projects for young audiences.
```

- [ ] **Step 11: Create musician MDX — Nicolas Fromonteil (FR)**

`src/content/musicians/fr/nicolas-fromonteil.mdx`:

```mdx
---
name: Nicolas Fromonteil
locale: fr
translationKey: nicolas-fromonteil
instrument: alto
photo: /images/musicians/nicolas.jpg
photoCredit: Caroline Doutre
---

Nicolas Fromonteil étudie au CRR de Paris puis au CNSMDP. Lauréat du Concours International d'Alto Maurice Vieux, il est alto solo de l'Orchestre de l'Opéra de Rouen Normandie.

Chambriste recherché, Nicolas collabore avec de nombreux ensembles et participe régulièrement aux festivals de musique classique en France et à l'étranger.
```

- [ ] **Step 12: Create musician MDX — Nicolas Fromonteil (EN)**

`src/content/musicians/en/nicolas-fromonteil.mdx`:

```mdx
---
name: Nicolas Fromonteil
locale: en
translationKey: nicolas-fromonteil
instrument: viola
photo: /images/musicians/nicolas.jpg
photoCredit: Caroline Doutre
---

Nicolas Fromonteil studied at the CRR de Paris before joining the CNSMDP. A laureate of the Maurice Vieux International Viola Competition, he is principal viola of the Opéra de Rouen Normandie Orchestra.

A sought-after chamber musician, Nicolas collaborates with numerous ensembles and regularly takes part in classical music festivals across France and abroad.
```

- [ ] **Step 13: Create musician MDX — Mariam Chitanava (FR)**

`src/content/musicians/fr/mariam-chitanava.mdx`:

```mdx
---
name: Mariam Chitanava
locale: fr
translationKey: mariam-chitanava
instrument: piano
photo: /images/musicians/mariam.jpg
photoCredit: Nikolaj Lund
---

Née à Tbilissi, Mariam Chitanava se forme au Conservatoire d'État de Géorgie puis au CNSMDP. Elle remporte de nombreux concours internationaux, dont le Concours Géza Anda et le Concours Clara Haskil.

Mariam se produit en récital à travers l'Europe — Wigmore Hall, Concertgebouw, Salle Gaveau — et est régulièrement invitée comme soliste par des orchestres de premier plan.
```

- [ ] **Step 14: Create musician MDX — Mariam Chitanava (EN)**

`src/content/musicians/en/mariam-chitanava.mdx`:

```mdx
---
name: Mariam Chitanava
locale: en
translationKey: mariam-chitanava
instrument: piano
photo: /images/musicians/mariam.jpg
photoCredit: Nikolaj Lund
---

Born in Tbilisi, Mariam Chitanava trained at the Tbilisi State Conservatory before joining the CNSMDP in Paris. She has won numerous international competitions, including the Géza Anda Competition and the Clara Haskil Competition.

Mariam performs recitals across Europe — Wigmore Hall, Concertgebouw, Salle Gaveau — and is regularly invited as a soloist with leading orchestras.
```

- [ ] **Step 15: Create musician MDX — Célia Garetti-Nicole (FR)**

`src/content/musicians/fr/celia-garetti-nicole.mdx`:

```mdx
---
name: Célia Garetti-Nicole
locale: fr
translationKey: celia-garetti-nicole
instrument: violoncelle
photo: /images/musicians/celia.jpg
photoCredit: Jean-Baptiste Millot
---

Célia Garetti-Nicole étudie au CNSMDP auprès de Marc Coppey. Lauréate du Concours International de Violoncelle de Lausanne, elle est également diplômée de l'Académie Jaroussky.

Fondatrice et directrice artistique du festival Accords en Valromey, Célia mène une double carrière de violoncelliste et de programmatrice, portée par la conviction que la musique classique doit vivre au cœur des territoires.
```

- [ ] **Step 16: Create musician MDX — Célia Garetti-Nicole (EN)**

`src/content/musicians/en/celia-garetti-nicole.mdx`:

```mdx
---
name: Célia Garetti-Nicole
locale: en
translationKey: celia-garetti-nicole
instrument: cello
photo: /images/musicians/celia.jpg
photoCredit: Jean-Baptiste Millot
---

Célia Garetti-Nicole studied at the CNSMDP in Paris under Marc Coppey. A laureate of the Lausanne International Cello Competition, she is also a graduate of the Jaroussky Academy.

Founder and artistic director of the Accords en Valromey festival, Célia pursues a dual career as cellist and programmer, driven by the conviction that classical music must thrive at the heart of local communities.
```

- [ ] **Step 17: Create page MDX — Le Festival (FR)**

`src/content/pages/fr/le-festival.mdx`:

```mdx
---
title: Le Festival
locale: fr
translationKey: le-festival
subtitle: Histoire et identité du festival Accords en Valromey
---

Le festival Accords en Valromey est un festival de musique de chambre qui se déroule chaque été à Champagne-en-Valromey, dans l'Ain. Il réunit de jeunes musiciens d'exception autour de programmes ambitieux, dans l'écrin de l'église Saint-Pierre — un lieu chargé d'histoire et de caractère.

Né de la passion pour la musique classique et du désir de faire vivre le patrimoine local, le festival propose chaque année une programmation exigeante et accessible, ouverte à tous les publics.

Le festival est porté par l'association Accords en Valromey, fondée et dirigée par Célia Garetti-Nicole, violoncelliste et enfant du pays. L'association s'appuie sur une équipe de bénévoles passionnés qui œuvrent toute l'année pour faire de chaque édition un moment d'exception.
```

- [ ] **Step 18: Create page MDX — The Festival (EN)**

`src/content/pages/en/the-festival.mdx`:

```mdx
---
title: The Festival
locale: en
translationKey: le-festival
subtitle: History and identity of the Accords en Valromey festival
---

The Accords en Valromey festival is a chamber music festival that takes place every summer in Champagne-en-Valromey, in the Ain department of France. It brings together exceptional young musicians around ambitious programs, in the magnificent setting of Saint-Pierre church — a place rich in history and character.

Born from a passion for classical music and a desire to bring local heritage to life, the festival offers an annual program that is both demanding and accessible, open to all audiences.

The festival is run by the Accords en Valromey association, founded and directed by Célia Garetti-Nicole, a cellist and native of the region. The association relies on a team of passionate volunteers who work throughout the year to make each edition a truly special occasion.
```

- [ ] **Step 19: Create page MDX — Billetterie / Tickets**

`src/content/pages/fr/billetterie.mdx`:

```mdx
---
title: Billetterie
locale: fr
translationKey: billetterie
subtitle: Réservez vos places pour le festival
---

Les billets sont en vente exclusivement via HelloAsso, la plateforme de paiement 100% sécurisée dédiée aux associations. Vous pouvez acheter vos billets en ligne jusqu'au jour du concert, dans la limite des places disponibles.

Les tarifs réduits s'appliquent aux étudiants, demandeurs d'emploi et bénéficiaires du RSA sur présentation d'un justificatif. L'entrée est gratuite pour les moins de 18 ans.

Pour toute question concernant la billetterie, n'hésitez pas à nous contacter à l'adresse accordsenvalromey@gmail.com.
```

`src/content/pages/en/tickets.mdx`:

```mdx
---
title: Tickets
locale: en
translationKey: billetterie
subtitle: Book your seats for the festival
---

Tickets are available exclusively via HelloAsso, a 100% secure payment platform dedicated to non-profit organizations. You can purchase tickets online up until the day of the concert, subject to availability.

Reduced rates apply to students, job seekers, and RSA beneficiaries upon presentation of proof of eligibility. Admission is free for anyone under 18.

For any ticketing questions, please contact us at accordsenvalromey@gmail.com.
```

- [ ] **Step 20: Create page MDX — Contact (FR + EN)**

`src/content/pages/fr/contact.mdx`:

```mdx
---
title: Contact
locale: fr
translationKey: contact
subtitle: Informations pratiques
---

**Email** : accordsenvalromey@gmail.com

**Adresse** : Accords en Valromey, Mairie de Champagne-en-Valromey, 01260 Champagne-en-Valromey, France

**Réseaux sociaux** : Suivez-nous sur [Facebook](https://www.facebook.com/accordsenvalromey) et [Instagram](https://www.instagram.com/accordsenvalromey) pour les dernières actualités du festival.

---

Le festival se déroule à l'église Saint-Pierre de Champagne-en-Valromey. Le village est situé dans le Bugey, à environ 1h de Lyon, 1h15 de Genève et 45 min d'Annecy.
```

`src/content/pages/en/contact.mdx`:

```mdx
---
title: Contact
locale: en
translationKey: contact
subtitle: Practical information
---

**Email**: accordsenvalromey@gmail.com

**Address**: Accords en Valromey, Mairie de Champagne-en-Valromey, 01260 Champagne-en-Valromey, France

**Social Media**: Follow us on [Facebook](https://www.facebook.com/accordsenvalromey) and [Instagram](https://www.instagram.com/accordsenvalromey) for the latest festival news.

---

The festival takes place at Saint-Pierre church in Champagne-en-Valromey. The village is located in the Bugey region, approximately 1 hour from Lyon, 1 hour 15 minutes from Geneva, and 45 minutes from Annecy.
```

- [ ] **Step 21: Create page MDX — Soutenir / Support Us**

`src/content/pages/fr/soutenir.mdx`:

```mdx
---
title: Nous Soutenir
locale: fr
translationKey: soutenir
subtitle: Soutenez le festival Accords en Valromey
---

Le festival Accords en Valromey est organisé par une association à but non lucratif. Votre soutien est essentiel pour faire vivre cette aventure musicale et culturelle au cœur du Valromey.

**Adhérer à l'association** : Devenez membre et participez à la vie du festival. L'adhésion vous donne droit à des tarifs préférentiels et à des invitations aux événements privés de l'association.

[Adhérer sur HelloAsso](https://www.helloasso.com/associations/accords-en-valromey/adhesions/adhesion-2026)

**Faire un don** : Chaque don, quel que soit son montant, contribue directement à la programmation artistique et à l'accueil des jeunes musiciens. Les dons ouvrent droit à une réduction d'impôt (66% du montant dans la limite de 20% du revenu imposable).

[Faire un don sur HelloAsso](https://www.helloasso.com/associations/accords-en-valromey/formulaires/1)

Merci pour votre générosité !
```

`src/content/pages/en/support-us.mdx`:

```mdx
---
title: Support Us
locale: en
translationKey: soutenir
subtitle: Support the Accords en Valromey festival
---

The Accords en Valromey festival is organized by a non-profit association. Your support is essential to bring this musical and cultural adventure to life in the heart of Valromey.

**Join the association**: Become a member and take part in the life of the festival. Membership gives you access to preferential rates and invitations to the association's private events.

[Join on HelloAsso](https://www.helloasso.com/associations/accords-en-valromey/adhesions/adhesion-2026)

**Make a donation**: Every donation, regardless of the amount, directly contributes to the artistic programming and the hosting of young musicians. Donations are tax-deductible in France (66% of the amount, up to 20% of taxable income).

[Donate on HelloAsso](https://www.helloasso.com/associations/accords-en-valromey/formulaires/1)

Thank you for your generosity!
```

- [ ] **Step 22: Remove .gitkeep files from content directories**

```bash
find src/content -name '.gitkeep' -delete
```

- [ ] **Step 23: Rebuild and verify Tina CMS content loads**

```bash
rm -rf dist tina/__generated__
npm run build
```

Expected: `tinacms build --content=local` processes all 24 MDX files, generates the GraphQL client, `astro build` succeeds, no errors.

- [ ] **Step 24: Commit all content**

```bash
git add src/content/
git commit -m "feat: add initial Tina CMS content (3 concerts, 5 musicians, 4 pages FR+EN)"
```

---

### Task C.5: Final push and verify

- [ ] **Step 1: Push content to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Monitor CI deployment**

Open `https://github.com/<your-github-username>/accords-en-valromey/actions` — the deploy workflow should succeed. It will run `tinacms build --content=local` (which now processes real content), `astro build`, then deploy to fly.io.

- [ ] **Step 3: Smoke test the live site**

```bash
# Home pages
curl -s https://accords-en-valromey.fly.dev/ | grep -o '<title>[^<]*</title>'
curl -s https://accords-en-valromey.fly.dev/en/ | grep -o '<title>[^<]*</title>'

# Tina admin
curl -s -o /dev/null -w "%{http_code}" https://accords-en-valromey.fly.dev/admin/
```

Expected: 
- `/` returns `<title>Accords en Valromey — Festival de musique classique</title>`
- `/en/` returns `<title>Accords en Valromey — Classical Music Festival</title>`
- `/admin/` returns 200 (Tina CMS admin SPA loads)

- [ ] **Step 4: Verify Tina admin works on fly.io**

Open `https://accords-en-valromey.fly.dev/admin/` in browser — the Tina admin SPA should load. Click "Login with Tina Cloud" — should redirect to GitHub OAuth.

---

## Verification Checklist

- [ ] `git remote -v` shows GitHub origin
- [ ] `gh secret list` shows `FLY_API_TOKEN`, `TINA_TOKEN`, `PUBLIC_TINA_CLIENT_ID`
- [ ] `npm run build` succeeds locally (Tina + Astro)
- [ ] `npx astro check` returns zero errors
- [ ] `src/pages/en/index.astro` exists and renders English content
- [ ] `src/content/` has 24 MDX files across 3 collections × 2 locales
- [ ] GitHub Actions deploy workflow succeeds on push to main
- [ ] `https://accords-en-valromey.fly.dev/` serves FR home page
- [ ] `https://accords-en-valromey.fly.dev/en/` serves EN home page
- [ ] `https://accords-en-valromey.fly.dev/admin/` serves Tina admin SPA
- [ ] Tina admin login redirects to GitHub OAuth (Tina Cloud)
