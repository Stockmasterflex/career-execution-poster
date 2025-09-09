# Career OS - Career Execution Platform

A comprehensive career planning and tracking application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Dashboard**: Today's focus, daily non-negotiables, KPI tracking, and quick navigation
- **Phase Pages**: Detailed views for each career phase (1-4) with specific goals and metrics
- **Daily Task Management**: Check off daily routines with streak tracking
- **KPI Tracking**: Visual progress tracking for career milestones
- **Company Management**: Track target companies by tier and application status
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-poster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
   ```

4. **Set up the database**
   Run the SQL schema in your Supabase SQL editor:
   ```bash
   # Copy and paste the contents of supabase-schema.sql into Supabase SQL editor
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

### Authentication

The application comes with a test user pre-seeded:
- **Email**: `test@careeros.com`
- **Password**: `testpassword123`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with test data
- `npm run lint` - Run ESLint

## Project Structure

```
career-poster/
├── app/                    # Next.js App Router pages
│   ├── phase-1/           # Phase 1 page
│   ├── phase-2/           # Phase 2 page
│   ├── phase-3/           # Phase 3 page
│   ├── phase-4/           # Phase 4 page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Auth.tsx          # Authentication component
│   ├── Dashboard.tsx     # Original dashboard
│   ├── DashboardNew.tsx  # New dashboard implementation
│   └── DashboardGate.tsx # Authentication gate
├── lib/                  # Utility functions
│   ├── supabase-browser.ts
│   └── utils.ts
├── scripts/              # Build and seed scripts
│   └── seed.js
└── supabase-schema.sql   # Database schema
```

## Database Schema

The application uses the following main tables:

- `daily_nonnegotiables` - Daily routine templates
- `daily_tasks` - Per-day task completions
- `kpis` - Key performance indicators by phase
- `companies` - Target companies with tiers and status
- `schedule_blocks` - Weekly schedule templates
- `success_metrics` - Success criteria by phase
- `milestones` - Career milestone definitions

## Design System

The application uses a custom design system with:

- **Colors**: Phase-specific gradients and semantic colors
- **Typography**: Inter font family with proper scaling
- **Components**: Glass morphism cards, progress bars, and interactive elements
- **Responsive**: Mobile-first design with desktop enhancements

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.