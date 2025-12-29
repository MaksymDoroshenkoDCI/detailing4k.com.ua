# Detailing 4K - Auto Detailing Studio Website

A comprehensive web-based system for an auto detailing studio located in Kyiv, Ukraine.

## Features

- Service catalog with detailed descriptions and pricing
- Online appointment booking system
- Consultation request form
- Work portfolio gallery (before/after)
- Client testimonials
- Interactive location map
- Client personal account
- Administrative panel

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd detailing-4k
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in your database credentials and other required values.

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
detailing-4k/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication pages
│   ├── (client)/         # Client account pages
│   ├── admin/            # Admin panel
│   └── ...               # Public pages
├── components/            # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## License

Private project for Detailing 4K studio.



