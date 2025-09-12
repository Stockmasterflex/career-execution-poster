# Career OS

A comprehensive career development platform built with Next.js, TypeScript, and Supabase.

## Features

### ✅ Completed Features

- **Authentication System**: Secure user authentication with Supabase Auth
- **Weekly Calendar**: Interactive schedule management with drag-and-drop support
- **Daily Non-Negotiables**: Task tracking with streak counters
- **KPI Management**: Phase-based progress tracking with inline editing
- **Company Tracking**: Tier-based company management with status filtering
- **Data Export/Import**: JSON export/import and PDF generation
- **Responsive Design**: Mobile-first design with glass morphism effects
- **Type Safety**: Full TypeScript implementation with Zod validation

### 🎯 Phase 1 Focus

- CMT Study Progress (16/100)
- Networking DMs (3/40)
- Coffee Chats (1/8)
- Applications Sent (3/50)
- LinkedIn Posts (7/40)
- Website Build (25/100)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **PDF Export**: html2pdf.js
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd career-os
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Supabase project:
   - Create a new Supabase project
   - Get your project URL and anon key
   - Update `.env.local` with your credentials

5. Set up the database schema:
   - Run the SQL schema provided in `database/schema.sql`
   - Enable Row Level Security (RLS) policies

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main tables:

- `users` - User profiles
- `kpis` - Key Performance Indicators
- `companies` - Company tracking with tiers and status
- `schedule_blocks` - Weekly schedule items
- `daily_nonnegotiables` - Daily task templates
- `daily_tasks` - Task completion tracking

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard
│   ├── phase-1/           # Phase 1 specific page
│   └── test/              # Test page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── companies/         # Company management
│   ├── export/            # Data export/import
│   ├── kpis/              # KPI management
│   ├── layout/            # Layout components
│   ├── nonnegotiables/    # Daily tasks
│   └── schedule/          # Weekly calendar
├── contexts/              # React contexts
├── lib/                   # Utility libraries
│   ├── database.types.ts  # TypeScript types
│   ├── schemas.ts         # Zod validation schemas
│   ├── supabase.ts        # Supabase client
│   ├── export.ts          # Data export/import
│   └── pdf-export.ts      # PDF generation
└── styles/                # Global styles
```

## Key Components

### WeeklySchedule
Interactive weekly calendar with:
- Drag-and-drop reordering
- Add/edit/delete schedule blocks
- Tag-based categorization
- Time validation
- Mobile-responsive design

### DailyNonNegotiables
Task management with:
- Morning and evening task lists
- Streak tracking
- Inline editing
- Completion tracking

### KPICard
Progress tracking with:
- Inline editing
- Visual progress bars
- Phase indicators
- Optimistic updates

### CompaniesList
Company management with:
- Tier-based filtering (T1A, T1B, T2)
- Status tracking
- Notes support
- Bulk operations

## Customization

### Design Tokens
The application uses custom Tailwind tokens defined in `tailwind.config.ts`:

- `border`: #FFFFFF1A
- `card-bg`: #0B1020B3
- `ring`: #93C5FD33
- Tag colors for different categories

### Adding New Features
1. Create components in appropriate directories
2. Add database types to `database.types.ts`
3. Create Zod schemas for validation
4. Update the main dashboard page

## Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] User can sign up with email/password
   - [ ] User can sign in with existing credentials
   - [ ] User can sign out
   - [ ] Protected routes redirect to login

2. **Weekly Schedule**
   - [ ] Can add new schedule blocks
   - [ ] Can edit existing blocks
   - [ ] Can delete blocks
   - [ ] Time validation works
   - [ ] Drag-and-drop reordering works
   - [ ] Mobile responsive

3. **Daily Non-Negotiables**
   - [ ] Can add morning/evening tasks
   - [ ] Can edit task titles
   - [ ] Can delete tasks
   - [ ] Can mark tasks as complete
   - [ ] Streak counters update correctly

4. **KPI Management**
   - [ ] Can edit current/target values
   - [ ] Progress bars update correctly
   - [ ] Phase indicators display
   - [ ] Optimistic updates work

5. **Company Tracking**
   - [ ] Can add companies with tier/status
   - [ ] Can edit company details
   - [ ] Can delete companies
   - [ ] Filtering by tier works
   - [ ] Status counters update

6. **Data Export/Import**
   - [ ] JSON export downloads file
   - [ ] JSON import uploads and processes data
   - [ ] PDF export generates report
   - [ ] Error handling works

### Running Tests

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.