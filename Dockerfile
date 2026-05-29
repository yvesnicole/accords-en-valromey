# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build (Tina content + Astro SSG)
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG PUBLIC_TINA_CLIENT_ID
ARG TINA_TOKEN
ENV PUBLIC_TINA_CLIENT_ID=${PUBLIC_TINA_CLIENT_ID}
ENV TINA_TOKEN=${TINA_TOKEN}
RUN npm run build

# Stage 3: Serve static files with Nginx
FROM nginx:alpine AS runtime
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
