# Monorepo Setup Guide with Bun

This guide explains how to set up a monorepo with Bun, focusing on clean organization patterns and efficient root-level script management.

## Top-Level Structure

```
my-monorepo/
├── packages/
│   ├── ngtly/              # Next.js application
│   ├── scraper/            # Background services
│   ├── scheduler/          # Additional services
│   ├── shared/             # Shared utilities and types
│   └── [more-packages]/    # Additional services as needed
├── package.json            # Root workspace configuration
├── bun.lockb               # Bun lockfile
├── loadEnv.ts              # Environment loader utility
├── env.js                  # Environment validation schema
├── biome.json              # Code formatting/linting config
└── .env                    # Environment variables
```

## Root Package.json Configuration

### Workspace Setup
```json
{
  "name": "my-monorepo",
  "module": "commonjs",
  "type": "module",
  "private": true,
  "workspaces": [
    "packages/*",
    "packages/**/db",
    "packages/**/dbscraper"
  ],
  "trustedDependencies": [
    "@ngtly/db",
    "@prisma/client",
    "@prisma/engines",
    "prisma",
    "@scraper/dbscraper",
    "@biomejs/biome",
    "puppeteer",
    "@shared"
  ]
}
```

## Root-Level Script Patterns

### Package-Specific Commands
Use `packageName:action` format for clarity:

```json
{
  "scripts": {
    "ngtly:dev": "cd packages/ngtly && bun run dev",
    "ngtly:build": "cd packages/ngtly && bun run build",
    "ngtly:start": "cd packages/ngtly && bun run start",
    "ngtly:generate": "cd packages/ngtly/db && bun run prisma:generate",
    "ngtly:push": "cd packages/ngtly/db && bun run prisma:push",
    "ngtly:migrate": "cd packages/ngtly/db && bun prisma:migrate",
    "ngtly:seed": "cd packages/ngtly/db && bun run prisma:seed",

    "scraper:build": "cd packages/scraper && bun run build",
    "scraper:start": "cd packages/scraper && bun run start:build",
    "scraper:generate": "cd packages/scraper/dbScraper && bun run prisma:generate",
    "scraper:push": "cd packages/scraper/dbScraper && bun run prisma:push",
    "scraper:migrate": "cd packages/scraper/dbScraper && bun prisma:migrate"
  }
}
```

### Consumer/Worker Commands
For background services:

```json
{
  "scripts": {
    "consume:image": "cd packages/scraper && bun run consume:image",
    "consume:html": "cd packages/scraper && bun run consume:html",
    "consume:scraper": "cd packages/scraper && bun run consume:scraper",
    "consume:request": "cd packages/scraper && bun run consume:request"
  }
}
```

### Code Quality Commands
Different levels of linting with build validation:

```json
{
  "scripts": {
    "lint": "bunx @biomejs/biome check --apply packages/ && bun run ngtly:build",
    "lint:unsafe": "bunx @biomejs/biome check --apply-unsafe packages/ && bun run ngtly:build",
    "check": "bunx @biomejs/biome check --write packages/"
  }
}
```

### Maintenance Commands
Comprehensive cleanup:

```json
{
  "scripts": {
    "clean": "find . -name \"node_modules\" -type d -exec rm -rf {} + && find . -name \".turbo\" -type d -exec rm -rf {} + && find . -name \"bun.lockb\" -type f -exec rm -f {} + && find . -name \"bun_modules\" -type d -exec rm -rf {} + && find . -name \"cache\" -type d -exec rm -rf {} + && find . -name \"generated\" -type d -exec rm -rf {} +"
  }
}
```

## Environment Management

### Environment Loader (`loadEnv.ts`)
```typescript
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";

// Load the root .env file
config({ path: resolve(__dirname, ".env") });

// Get the command and arguments from the command line
const [, , ...command] = process.argv;

// Ensure that the command[0] argument is always a string
const commandString = command[0] ?? "";

// Execute the command with the environment variables loaded
const child = spawn(commandString, command.slice(1), {
	stdio: "inherit",
	env: process.env,
});

child.on("close", (code) => {
	return process.exit(code);
});
```

### Environment Validation (`env.js`)
```javascript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		NEXTAUTH_URL: z.preprocess(
			(str) => process.env.VERCEL_URL ?? str,
			process.env.VERCEL ? z.string() : z.string().url(),
		),
		DISCORD_CLIENT_ID: z.string(),
		DISCORD_CLIENT_SECRET: z.string(),
	},
	client: {
		NEXT_PUBLIC_APP_TYPE: z.string().default("web"),
		NEXT_PUBLIC_PROD_DOMAIN_URL: z.string(),
		NEXT_PUBLIC_PLAUSIBLE_DOMAIN_PROD: z.string(),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
			process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
		NEXT_PUBLIC_PROD_DOMAIN_URL: process.env.NEXT_PUBLIC_PROD_DOMAIN_URL,
		NEXT_PUBLIC_PLAUSIBLE_DOMAIN_PROD:
			process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN_PROD,
		NEXT_PUBLIC_APP_TYPE: process.env.NEXT_PUBLIC_APP_TYPE,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
```

## Key Package Organization

### Multiple Packages Strategy
- **Ngtly App**: Next.js application with its own database package (`@ngtly/db`)
- **Services**: Background processors (scraper, scheduler, etc.)
- **Shared**: Common utilities, types, and constants (`@shared`)
- **Database Packages**: Each service gets its own database package when needed (`@scraper/dbscraper`)

### Workspace Dependencies
Internal packages reference each other using `workspace:*`:

```json
{
  "dependencies": {
    "@shared": "workspace:*",
    "@ngtly/db": "workspace:*"
  }
}
```

## Essential Tools

### Core Dependencies
```json
{
  "dependencies": {
    "@t3-oss/env-nextjs": "^0.10.1",
    "dotenv": "^16.4.5",
    "lucide-react": "^0.395.0",
    "openai": "^4.56.0",
    "react-icons": "^5.3.0"
  },
  "devDependencies": {
    "@biomejs/biome": "1.8.3",
    "husky": "^9.0.11"
  }
}
```

### Biome Configuration (`biome.json`)
```json
{
	"$schema": "https://biomejs.dev/schemas/1.7.3/schema.json",
	"organizeImports": {
		"enabled": true
	},
	"files": {
		"maxSize": 5048576,
		"ignore": [
			"**/node_modules",
			"**/dist",
			"**/build",
			"**/out",
			"**/target",
			"**/coverage",
			"**/lib",
			"**/tmp",
			"**/temp",
			"**/.next",
			"**/generated",
			"**/public/*.js",
			"**/public/*.map"
		]
	},
	"linter": {
		"enabled": true,
		"rules": {
			"recommended": true,
			"a11y": {
				"noSvgWithoutTitle": "off"
			},
			"security": {
				"noDangerouslySetInnerHtml": "off"
			}
		}
	}
}
```

## Development Workflow

```bash
# Development
bun ngtly:dev              # Start Next.js app
bun scraper:dev             # Start background services

# Database Management
bun ngtly:generate          # Generate Prisma clients
bun ngtly:push              # Push schema changes
bun ngtly:migrate           # Run migrations

# Background Services
bun consume:image           # Start specific consumers
bun consume:html

# Code Quality
bun lint                    # Lint with build validation
bun check                   # Check without fixes

# Maintenance
bun run clean               # Clean everything
```

## Key Principles

### Script Organization
1. **Package-Specific**: `packageName:action` format (e.g., `ngtly:dev`)
2. **Consumer Services**: `consume:serviceName` for workers
3. **Build Validation**: Combine linting with build checks
4. **Comprehensive Clean**: Remove all artifacts

### Package Management
1. **Environment Loading**: All scripts use `bun loadEnv --` prefix
2. **Workspace Dependencies**: Use `workspace:*` for internal packages
3. **Multiple Databases**: Each service can have its own database package
4. **Shared Utilities**: Common code in `@shared` package

This setup provides a scalable foundation for managing multiple packages with consistent patterns and efficient development workflows.