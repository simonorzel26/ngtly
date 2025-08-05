FROM imbios/bun-node:22-slim AS deps
ARG DEBIAN_FRONTEND=noninteractive

# Add Debian Buster repository for OpenSSL 1.1.x
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    gnupg \
    git \
    tzdata && \
    echo "deb http://security.debian.org/debian-security bullseye-security main" > /etc/apt/sources.list.d/bullseye-security.list && \
    apt-get update -y && \
    apt-get install -y libssl1.1 openssl && \
    ln -fs /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    echo "Europe/Berlin" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lockb ./
RUN mkdir -p packages/ngtly
RUN mkdir -p packages/shared
COPY ./packages/ngtly/package.json ./packages/ngtly/package.json
COPY ./packages/shared/package.json ./packages/shared/package.json
COPY ./loadEnv.ts ./loadEnv.ts
COPY ./env.js ./env.js
COPY ./packages/ngtly/db ./packages/ngtly/db

COPY ./.env ./.env
# Install with --no-install-scripts to skip postinstall scripts
RUN bun install --no-install-scripts

# Now run Prisma generate explicitly after all dependencies are installed
RUN cd packages/ngtly/db && bunx prisma generate

# Build the app
FROM deps AS builder
WORKDIR /app
COPY --from=deps /app .
COPY ./packages/ngtly/ ./packages/ngtly/
COPY ./packages/shared/ ./packages/shared/

RUN bun ngtly:build

# Production image, copy all the files and run next
FROM imbios/bun-node:22-slim AS runner
WORKDIR /app

# Add Debian Buster repository for OpenSSL 1.1.x in runner image
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    gnupg \
    tzdata && \
    echo "deb http://security.debian.org/debian-security bullseye-security main" > /etc/apt/sources.list.d/bullseye-security.list && \
    apt-get update -y && \
    apt-get install -y libssl1.1 openssl && \
    ln -fs /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    echo "Europe/Berlin" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a system group and user for running the application
RUN addgroup --system --gid 1002 bunjs
RUN adduser --system --uid 1002 --ingroup bunjs bunuser

# Set environment variables
ARG CONFIG_FILE
COPY $CONFIG_FILE /app/.env
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files and set correct permissions
COPY --from=builder /app/packages/ngtly/public ./public
COPY --from=builder /app/packages/ngtly/public ./packages/ngtly/public
COPY --from=builder /app/packages/ngtly/public ./
COPY --from=builder --chown=bunuser:bunjs /app/packages/ngtly/.next/standalone ./
COPY --from=builder --chown=bunuser:bunjs /app/packages/ngtly/.next/static ./packages/ngtly/.next/static
COPY --from=builder --chown=bunuser:bunjs /app/package.json /app/bun.lockb ./

# Copy Prisma-related directories
COPY --from=builder --chown=bunuser:bunjs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=bunuser:bunjs /app/node_modules/@prisma ./node_modules/@prisma

# Change ownership of all necessary files and directories to the non-root user
RUN chown -R bunuser:bunjs /app

# Switch to the non-root user
USER bunuser

# Expose the application port
EXPOSE 3001

# Set additional environment variables
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

# Run the application
CMD ["node", "packages/ngtly/server.js"]