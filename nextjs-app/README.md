# Daily Non-Negotiables & Weekly Schedule App

A Next.js 14 application with Supabase integration for managing daily non-negotiables and weekly schedules.

## Features

- **Daily Non-Negotiables**: Morning and evening task lists with streak tracking
- **Weekly Schedule**: Drag-and-drop schedule management with categories
- **Bootstrap Data**: Automatic seeding of default data for new users
- **Authentication**: Supabase Auth integration
- **Debug Page**: Diagnostics and testing tools

## Setup

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

### 2. Database Setup

Run the SQL schema in your Supabase project:

```sql
-- Copy and paste the contents of database/schema.sql into your Supabase SQL editor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## Database Schema

The app uses three main tables:

- `daily_nonnegotiables`: User's daily non-negotiable tasks (morning/evening)
- `daily_tasks`: Completion tracking for daily tasks
- `schedule_blocks`: Weekly schedule with time blocks and categories

All tables have Row Level Security (RLS) enabled with policies ensuring users can only access their own data.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in
2. **Dashboard**: View your daily non-negotiables and weekly schedule
3. **Debug Page**: Visit `/debug` to see table counts and run bootstrap manually

## Bootstrap Data

The app automatically seeds default data for new users:

- **Morning Non-Negotiables**: Market open review, CMT study, LinkedIn engagement
- **Evening Non-Negotiables**: Close review, Outreach/content, Plan tomorrow
- **Weekly Schedule**: Pre-configured time blocks for gym, market prep, study, networking, content, family, and meal prep

## Development

- All console logs are prefixed with `[BOOTSTRAP]`, `[NONNEGO]`, `[SCHEDULE]`, or `[DEBUG]` for easy filtering
- The bootstrap function is idempotent and safe to run multiple times
- Components use optimistic updates for better UX