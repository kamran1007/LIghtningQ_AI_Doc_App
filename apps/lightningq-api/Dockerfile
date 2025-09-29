# Single-stage build for simplicity and reliability
FROM node:20-slim

WORKDIR /app

# Install system dependencies for Prisma
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/lightningq-api/package*.json ./apps/lightningq-api/

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Ensure Prisma is available and generate client
RUN pnpm add -D prisma @prisma/client --workspace-root
RUN npx prisma generate --schema=apps/lightningq-api/prisma/schema.prisma

# Build the application
WORKDIR /app/apps/lightningq-api
RUN pnpm run build

# Expose port
EXPOSE 8000

# Start the application
CMD ["node", "dist/src/main.js"]