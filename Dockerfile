# Use a small node base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package definitions and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Build stage
FROM base AS builder
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy build output and dependencies from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
