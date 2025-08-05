# 🎉 Ngtly - Global Nightlife Events Index

<div align="center">
  <img src="packages/ngtly/public/logo-ngtly_1024.png" alt="Ngtly Logo" width="200" height="200">
  <br>
  <strong>Discover and explore nightlife events worldwide</strong>
</div>

## 🌍 About Ngtly

Ngtly is an open-source platform that indexes and aggregates nightlife events from around the world. Our mission is to connect party-goers with the best events, clubs, and venues across different cities and countries.

### ✨ Features

- **🌆 Multi-City Support**: Events from major cities across Europe and beyond
- **🎵 Music Genre Filtering**: Find events by your preferred music style
- **📅 Real-time Updates**: Fresh event data with automatic scraping
- **🗺️ Interactive Maps**: Visual event discovery with location-based search
- **📱 Mobile-First Design**: Optimized for mobile and desktop experiences
- **🌐 Multi-Language**: Support for multiple languages and locales

## 🏗️ Architecture

This is a monorepo built with modern technologies:

### Core Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM with PostgreSQL
- **Tailwind CSS** - Utility-first CSS framework
- **Bun** - Fast JavaScript runtime and package manager

### Monorepo Structure
```
ngtly/
├── packages/
│   ├── ngtly/          # Main Next.js application
│   ├── scraper/        # Background event scraping services
│   ├── scheduler/      # Automated task scheduling
│   └── shared/         # Shared utilities and types
├── loadEnv.ts          # Environment loader
├── env.js              # Environment validation
└── biome.json          # Code formatting and linting
```

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/simonorzel26/ngtly.git
   cd ngtly
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   bun ngtly:generate  # Generate Prisma client
   bun ngtly:migrate   # Run database migrations
   bun ngtly:seed      # Seed initial data
   ```

5. **Start development server**
   ```bash
   bun ngtly:dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Development

### Available Scripts

```bash
# Development
bun ngtly:dev          # Start Next.js development server
bun scraper:dev         # Start background scraping services

# Database
bun ngtly:generate      # Generate Prisma client
bun ngtly:migrate       # Run database migrations
bun ngtly:seed          # Seed database with initial data

# Background Services
bun consume:image       # Start image processing consumer
bun consume:html        # Start HTML processing consumer
bun consume:scraper     # Start event scraping consumer
bun consume:request     # Start request processing consumer

# Code Quality
bun lint                # Lint and format code
bun check               # Check code without fixes

# Build
bun ngtly:build         # Build for production
bun ngtly:start         # Start production server
```

### Project Structure

```
packages/ngtly/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── utils/         # Helper utilities
├── db/                # Database package
│   ├── prisma/        # Database schema and migrations
│   └── index.ts       # Database client
└── public/            # Static assets
```

## 🌐 API

### Public API
The application provides a RESTful API for accessing event data:

- `GET /api/v1/cities` - List all supported cities
- `GET /api/v1/cities/:name` - Get city details
- `GET /api/v1/cities/:name/clubs` - Get clubs in a city
- `GET /api/v1/cities/:name/events` - Get events in a city
- `GET /api/v1/events/:id` - Get specific event details

### Authentication
API endpoints require Bearer token authentication. Set your `API_BEARER_TOKEN` environment variable.

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_PRISMA_URL_SCRAPER="postgresql://..."

# Authentication
SECRET="your-secret-key"
API_BEARER_TOKEN="your-api-token"

# External Services
OPENAI_API_KEY="your-openai-key"
RABBIT_MQ_URL="your-rabbitmq-url"

# AWS (for image processing)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="eu-central-1"
AWS_IMAGE_BUCKET="your-bucket-name"

# Stripe (for payments)
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"

# Public URLs
NEXT_PUBLIC_PROD_DOMAIN_URL="https://ngtly.com"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-token"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

We use [Biome](https://biomejs.dev/) for code formatting and linting:

```bash
bun lint        # Format and lint code
bun check       # Check code without formatting
```

## 📊 Data Sources

Ngtly aggregates event data from multiple sources:

- **Club Websites**: Direct scraping from venue websites
- **Event Platforms**: Integration with event platforms
- **Social Media**: Event discovery from social platforms
- **User Submissions**: Community-contributed events

## 🔒 Security

- All API routes are properly secured with authentication
- Environment variables are validated at runtime
- Database queries are protected against injection
- CORS is configured for cross-origin requests

## 📈 Roadmap

- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Advanced Filtering**: More sophisticated event filtering
- [ ] **User Accounts**: Personal event tracking and preferences
- [ ] **Event Recommendations**: AI-powered event suggestions
- [ ] **Real-time Updates**: Live event updates and notifications
- [ ] **More Cities**: Expanding to additional cities worldwide

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- **Website**: [https://ngtly.com](https://ngtly.com)
- **Issues**: [GitHub Issues](https://github.com/simonorzel26/ngtly/issues)
- **Discussions**: [GitHub Discussions](https://github.com/simonorzel26/ngtly/discussions)

## 🙏 Acknowledgments

- Built with the [T3 Stack](https://create.t3.gg/)
- Powered by [Next.js](https://nextjs.org/)
- Database managed with [Prisma](https://prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  <strong>Made with ❤️ for the global nightlife community</strong>
</div> 