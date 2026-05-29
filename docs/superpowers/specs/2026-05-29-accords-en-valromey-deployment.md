# Accords en Valromey — Deployment & CMS Finalization

> Phase finale : GitHub, Tina Cloud, fly.io, contenu  
> Date: 2026-05-29  
> Status: **Approved**

---

## 1. Context

Le site est construit à ~80%. Astro 5 SSG, Tailwind 4, i18n FR/EN, Tina CMS configuré, Docker + fly.io + GitHub Actions prêts. Il manque :

- Publication sur GitHub (pas de remote configuré)
- Activation de Tina Cloud pour l'édition visuelle non-technique
- Déploiement effectif sur fly.io
- Page d'accueil anglaise (`src/pages/en/index.astro`)
- Contenu initial dans les collections Tina

---

## 2. Architecture cible

```
┌──────────┐    commit     ┌──────────┐    Actions    ┌──────────┐   deploy   ┌──────────┐
│  Éditeur │──────────────→│  GitHub  │──────────────→│  CI/CD   │──────────→│  fly.io  │
│ /admin   │   (via Tina)  │  (repo)  │  (push main)  │ (build)  │ (docker)  │  (nginx) │
└──────────┘               └──────────┘               └──────────┘            └──────────┘
                                  ↑
                           Tina Cloud
                        (auth + media API)
```

- **Éditeur** : utilise `/admin` (Tina React SPA), s'authentifie via GitHub OAuth
- **Tina Cloud** : gère l'auth, le média upload, écrit les commits dans le repo GitHub
- **GitHub** : héberge le code source, les fichiers MDX de contenu, et les workflows CI/CD
- **fly.io** : héberge le site statique via conteneur Docker (Nginx), scale-to-zero, région CDG

---

## 3. Tracks d'implémentation

### Track A — GitHub + Tina Cloud

#### A.1 Créer le repo et pousser le code

- Créer un repo GitHub `accords-en-valromey` (public ou privé)
- `git remote add origin git@github.com:<user>/accords-en-valromey.git`
- `git push -u origin main`

#### A.2 Configurer Tina Cloud

1. Aller sur https://app.tina.io
2. Enregistrer le repo `accords-en-valromey`
3. Récupérer `Client ID` et `Token`
4. Créer un token read-only supplémentaire pour le build CI

#### A.3 Secrets GitHub

- `TINA_TOKEN` : token Tina Cloud (utilisé par `tinacms build --content=local` dans la CI)
- `FLY_API_TOKEN` : token fly.io (utilisé par `flyctl deploy --remote-only`)
- `PUBLIC_TINA_CLIENT_ID` : pas un secret GitHub — va dans `.env` et dans les variables d'environnement de build

#### A.4 Variables d'environnement

Fichier `.env` (local) :
```
PUBLIC_TINA_CLIENT_ID=<client-id>
TINA_TOKEN=<token>
PUBLIC_TINA_IS_LOCAL=false
```

Le workflow CI (`deploy.yml`) utilise `TINA_TOKEN` comme secret. Le `PUBLIC_TINA_CLIENT_ID` doit être disponible au build — soit via secrets.GITHUB, soit en dur dans le code (le client ID est public).

---

### Track B — fly.io

#### B.1 Vérifier/créer l'app fly.io

```bash
flyctl status -c fly.toml
# Si l'app n'existe pas :
flyctl launch --no-deploy  # importe le fly.toml existant sans déployer
```

#### B.2 Vérifier le build Docker local

```bash
docker build -t accords-en-valromey .
docker run --rm -p 8080:80 accords-en-valromey
curl -s http://localhost:8080/ | head -20
```

#### B.3 Ajouter FLY_API_TOKEN aux secrets GitHub

```bash
flyctl tokens create deploy -x 9999h  # token longue durée pour CI
gh secret set FLY_API_TOKEN -b "<token>"
```

#### B.4 Déclencher le déploiement

```bash
git push origin main  # déclenche GitHub Actions → déploie sur fly.io
```

Après déploiement : site accessible sur `https://accords-en-valromey.fly.dev`

---

### Track C — Contenu & page manquante

#### C.1 Page d'accueil anglaise

Créer `src/pages/en/index.astro` — miroir de `src/pages/index.astro` avec contenu en anglais.

#### C.2 Validation du build

```bash
npm run build  # tinacms build --content=local && astro build
npx astro check  # vérification TypeScript
```

#### C.3 Contenu initial Tina CMS

Les collections sont vides (`.gitkeep` uniquement). Créer le contenu initial :

- `src/content/concerts/fr/` — 3-4 concerts avec dates, programmes, affiches, liens HelloAsso
- `src/content/concerts/en/` — versions anglaises avec mêmes `translationKey`
- `src/content/musicians/fr/` — 5 musiciens avec bios, photos, instruments
- `src/content/musicians/en/` — versions anglaises
- `src/content/pages/fr/` — pages statiques (le-festival, billetterie, contact, soutenir)
- `src/content/pages/en/` — versions anglaises

Une fois le contenu créé, les pages Astro sont mises à jour pour lire depuis Tina au lieu du contenu hardcodé.

---

## 4. Risques & points d'attention

| Risque | Mitigation |
|---|---|
| Tina Cloud génère un `tina/__generated__/` qui dépend du token — le build CI doit y avoir accès | Ajouter `TINA_TOKEN` en secret GitHub, le workflow CI l'utilise déjà |
| `PUBLIC_TINA_CLIENT_ID` est nécessaire au build mais n'est pas un secret | Le mettre en variable d'environnement dans le workflow CI (`env:` au niveau job) |
| La CI échoue si `flyctl` n'est pas installé | Déjà géré : `superfly/flyctl-actions/setup-flyctl@master` |
| Le contenu hardcodé dans les pages sera remplacé par du contenu Tina | Faire la transition page par page, vérifier que ça ne casse pas le build |

---

## 5. Ordre d'exécution

```
A.1 (repo + push) → A.2 (Tina Cloud) → A.3/A.4 (secrets + env)
                                              ↓
B.1 (fly app) → B.2 (docker test) → B.3 (FLY_API_TOKEN) → B.4 (deploy)
                                              ↓
C.2 (build check) → C.1 (en/index.astro) → C.3 (contenu Tina) → C.2 (re-build)
```

Les tracks A et B peuvent démarrer en parallèle. C attend que A et B soient faites pour que le contenu créé déclenche le déploiement.

---

## Appendix: Checklist récapitulative

- [ ] Créer repo GitHub et push
- [ ] Configurer Tina Cloud (Client ID + Token)
- [ ] Ajouter secrets GitHub (TINA_TOKEN, FLY_API_TOKEN)
- [ ] Mettre à jour `.env` local
- [ ] Mettre à jour le workflow CI pour `PUBLIC_TINA_CLIENT_ID`
- [ ] Vérifier/créer l'app fly.io
- [ ] Tester le build Docker local
- [ ] Créer `src/pages/en/index.astro`
- [ ] Vérifier `npm run build` + `npx astro check`
- [ ] Créer le contenu initial Tina CMS
- [ ] Valider le déploiement automatique sur push main
