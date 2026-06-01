---
name: deploy-fly
description: Use when deploying Accords en Valromey to Fly.io or when the user asks to deploy, ship, or publish the site
---

# Deploy to Fly.io

## Overview

Deploy the Accords en Valromey static site to Fly.io. Single command, no flags needed.

```bash
fly deploy
```

## Architecture

| Layer | Detail |
|-------|--------|
| App name | `accords-en-valromey` |
| Region | `cdg` (Paris) |
| Runtime | Nginx Alpine serving `dist/` |
| Live URL | https://accords-en-valromey.fly.dev/ |
| Monitoring | https://fly.io/apps/accords-en-valromey/monitoring |

## Docker Build Stages

1. **deps** (`node:22-alpine`) — `npm ci`
2. **builder** (`node:22-alpine`) — `npm run build` (TinaCMS + Astro SSG)
3. **runtime** (`nginx:alpine`) — serves `dist/` on port 80, HTTPS forced

## Credentials

TinaCMS requires two secrets at **build time**. They are stored as Fly runtime secrets and mapped to Docker build args via `fly.toml`:

```toml
[build.secrets]
  PUBLIC_TINA_CLIENT_ID = "PUBLIC_TINA_CLIENT_ID"
  TINA_TOKEN = "TINA_TOKEN"
```

**If secrets are missing**, the build fails with:
```
ERROR: --content=local requires clientId, token to be configured
errorCode: 'ERR_MISSING_CLOUD_CREDS'
```

**To set/reset secrets:**
```bash
fly secrets set PUBLIC_TINA_CLIENT_ID=<value> TINA_TOKEN=<value>
```

## Post-Deploy

Verify the deployment at https://accords-en-valromey.fly.dev/

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ERR_MISSING_CLOUD_CREDS` | Tina secrets missing | `fly secrets set ...` |
| Build OOM | Tina + Astro memory spike | Already handled: `NODE_OPTIONS=--max-old-space-size=4096` in Dockerfile |
| Route collision warning | i18n plugin duplicates `/en/contact` | Pre-existing, harmless |
