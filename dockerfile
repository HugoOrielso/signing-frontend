# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml* ./

RUN pnpm install --frozen-lockfile


# ─── Stage 2: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

ENV NEXT_PUBLIC_API_URL=https://backend.hugoorielso.com/api
ENV NEXT_PUBLIC_API_IMAGES=https://backend.hugoorielso.com
ENV API_URL=https://backend.hugoorielso.com/api
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# ─── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXTAUTH_URL=https://hugoorielso.com
ENV NEXTAUTH_SECRET=tu-secret-aqui
ENV NEXT_PUBLIC_API_URL=https://backend.hugoorielso.com/api
ENV NEXT_PUBLIC_API_IMAGES=https://backend.hugoorielso.com
ENV API_URL=https://backend.hugoorielso.com/api
ENV AUTH_TRUST_HOST=true

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]