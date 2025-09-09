# Career OS - Your Ultimate Career Execution System

A beautiful, interactive Next.js 14 application that transforms your career planning from static posters into a dynamic, data-driven system. Built with Supabase integration, PWA capabilities, and a stunning glass-morphism design.

## 🚀 Features

### ✨ Beautiful UI
- **Glass-morphism design** with phase-specific gradients
- **Responsive layout** optimized for desktop, tablet, and mobile
- **Phase-based color system** (P1: Amber, P2: Cyan, P3: Green, P4: Purple)
- **Interactive components** with smooth animations and transitions

### 📊 Dashboard
- **Today's Focus** textarea with auto-save
- **Daily Non-Negotiables** with morning/evening checklists
- **Streak counters** for habit tracking
- **Phase 1 KPI Strip** with editable progress bars
- **Target Companies** with tier badges and status management
- **Quick Navigation** to all phases

### 🎯 Phase Pages
- **Phase 1**: Foundation & Immediate Market Entry
- **Phase 2**: Interview Intensification & Job Closing  
- **Phase 3**: Performance & Rapid Advancement
- **Phase 4**: Elite Status & Wealth Building
- **Editable content** stored in Supabase
- **KPI tracking** with visual progress indicators

### 🔐 Authentication
- **Email/Password** authentication
- **Google OAuth** integration
- **Secure RLS policies** for data protection
- **Demo credentials** for testing

### 📱 PWA Features
- **Installable** on mobile and desktop
- **Offline support** for core functionality
- **Service worker** for caching
- **App manifest** for native-like experience

### 📈 Data Management
- **Export JSON** - Download all your data
- **Import JSON** - Restore from backup
- **Export PDF** - Generate reports
- **Real-time sync** with Supabase

## 🛠️ Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for backend and auth
- **Lucide React** for icons
- **html2pdf.js** for PDF generation
- **PWA** capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd career-os
npm install
```

### 2. Setup Supabase
1. Create a new Supabase project
2. Copy your project URL and anon key
3. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Migrations
```bash
# Apply the schema migrations in your Supabase SQL Editor
# Files: supabase/migrations/001_initial_schema.sql
#        supabase/migrations/002_rls_policies.sql
```

### 4. Seed Data
```bash
npm run seed
```

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with:
- Email: `test@careeros.com`
- Password: `testpassword123`

## 📊 Database Schema

### Core Tables
- **daily_nonnegotiables** - Template tasks for morning/evening
- **daily_tasks** - Today's specific tasks with completion status
- **kpis** - Phase-based key performance indicators
- **companies** - Target companies with tiers and status
- **schedule_blocks** - Weekly schedule templates
- **success_metrics** - Phase-specific success criteria
- **milestones** - Victory celebrations and achievements
- **user_plans** - User's complete plan data

### Security
- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - users can only access their own data
- **Secure policies** for CRUD operations

## 🎨 Design System

### Phase Colors
- **Phase 1**: Amber/Orange gradient
- **Phase 2**: Cyan/Blue gradient  
- **Phase 3**: Green gradient
- **Phase 4**: Purple gradient

### Components
- **Glass Cards** - `bg-white/5 backdrop-blur-sm border-white/10`
- **Badges** - Tier-based color coding
- **Progress Bars** - Phase-specific gradients
- **Buttons** - Multiple variants with hover states

## 📱 PWA Installation

### Desktop
1. Open the app in Chrome/Edge
2. Click the install button in the address bar
3. The app will be added to your desktop

### Mobile
1. Open the app in Safari/Chrome
2. Tap "Add to Home Screen"
3. The app will appear on your home screen

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📈 Usage

### Daily Workflow
1. **Morning**: Check off morning non-negotiables
2. **Update KPIs**: Track progress on key metrics
3. **Company Status**: Update application/interview status
4. **Evening**: Complete evening tasks
5. **Focus**: Update today's focus area

### Weekly Planning
1. Review phase-specific goals
2. Update company research
3. Track networking progress
4. Adjust KPI targets

### Monthly Review
1. Export data for backup
2. Review phase progression
3. Update success metrics
4. Plan next month's focus

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run seed         # Seed database with sample data
```

### Project Structure
```
career-os/
├── app/                    # Next.js app directory
│   ├── data/              # Static data files
│   ├── phase-1/           # Phase pages
│   ├── settings/          # Settings page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                  # Utility functions
├── supabase/             # Database migrations
├── scripts/              # Build and seed scripts
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original career poster design inspiration
- Supabase for the amazing backend platform
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling

---

**Ready to transform your career?** 🚀

Start with the demo credentials and begin your journey to professional success!