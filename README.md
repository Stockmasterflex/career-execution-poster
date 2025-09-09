# Career OS - Career Execution Platform

A comprehensive career planning and tracking application built with Next.js, TypeScript, and Tailwind CSS. Features a complete dashboard with weekly scheduling, KPI tracking, company management, and phase-based career planning.

## 🚀 Features

- **📊 Dashboard**: Complete overview with today's focus, daily non-negotiables, weekly schedule, and KPI tracking
- **📅 Weekly Calendar**: Color-coded time blocks with drag-and-drop functionality and KPI integration
- **🎯 Phase Management**: Four career phases (Foundation, Network, Apply, Land) with specific goals and metrics
- **📈 KPI Tracking**: Visual progress bars with live updates and milestone tracking
- **🏢 Company Management**: Tiered target company tracking (T1A, T1B, T2) with application status
- **✅ Daily Routines**: Morning and Evening Power Hour tracking with streak counters
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **💾 Local Storage**: All data persists locally without external dependencies

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Stockmasterflex/career-execution-poster.git
   cd career-execution-poster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or `http://localhost:3001` if port 3000 is in use)

### Data Seeding

The application automatically seeds with sample data on first load, including:
- 15 target companies from your career plan (T1A, T1B, T2 tiers)
- Phase 1 KPIs with realistic progress tracking
- Weekly schedule matching your calendar image
- Focus items and non-negotiables from your career plan
- All data persists in localStorage

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
career-execution-poster/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard page
│   ├── phase-1/           # Phase 1 page
│   ├── phase-2/           # Phase 2 page
│   ├── phase-3/           # Phase 3 page
│   ├── phase-4/           # Phase 4 page
│   ├── calendar/          # Weekly calendar page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── companies/        # Company management components
├── src/                  # Source code
│   ├── data/            # Data repositories (localStorage)
│   ├── lib/             # Utility functions and seeding
│   ├── services/        # Business logic services
│   └── styles/          # Design tokens and CSS
├── lib/                 # Legacy utility functions
└── scripts/             # Build and utility scripts
```

## Data Architecture

The application uses localStorage for data persistence with the following structure:

- `career_os_focus` - Today's focus items
- `career_os_nonnegotiables` - Daily routine tracking
- `career_os_schedule` - Weekly calendar blocks
- `career_os_kpis` - KPI progress tracking
- `career_os_companies` - Target company management
- `career_os_seeded` - Seeding flag

## Design System

The application uses a custom design system with:

- **🎨 Colors**: Phase-specific gradients (P1: Orange, P2: Cyan, P3: Green, P4: Purple)
- **📝 Typography**: Inter font family with proper scaling and weights
- **🪟 Components**: Glass morphism cards, progress bars, and interactive elements
- **📱 Responsive**: Mobile-first design with desktop enhancements
- **🌈 Background**: Deep navy to blue to purple diagonal gradient

## Key Features

### Weekly Calendar
- Color-coded time blocks matching your schedule
- Drag-and-drop functionality for rescheduling
- KPI integration when checking off activities
- Add/edit/remove blocks with inline editing

### KPI Tracking
- Live progress updates with visual progress bars
- Phase-specific KPIs with realistic targets
- Automatic updates from calendar activities
- Inline editing and progress adjustment

### Company Management
- Tiered system (T1A, T1B, T2) based on your career plan
- Application status tracking (Lead, Applied, Interview, Offer, Rejected)
- Add/edit/delete companies with notes
- Filter by tier and status

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy (no environment variables needed - uses localStorage)

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