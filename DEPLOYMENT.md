# Career OS Deployment Guide

## 🚀 Quick Deployment to Vercel

### 1. Setup Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to Settings > API to get your credentials

### 2. Configure Environment Variables

Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Database Migrations

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:

**First, run `supabase/migrations/001_initial_schema.sql`:**
```sql
-- Copy and paste the entire contents of 001_initial_schema.sql
-- This creates all tables, types, and triggers
```

**Then, run `supabase/migrations/002_rls_policies.sql`:**
```sql
-- Copy and paste the entire contents of 002_rls_policies.sql
-- This enables RLS and creates security policies
```

### 4. Seed the Database

```bash
npm run seed
```

This will create a test user and populate all tables with sample data.

### 5. Deploy to Vercel

#### Option A: Deploy from GitHub
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
5. Deploy!

#### Option B: Deploy with Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the prompts
# Add environment variables when prompted
```

### 6. Configure Supabase Auth

1. Go to Supabase > Authentication > URL Configuration
2. Add your Vercel domain to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app.vercel.app/**`
     - `http://localhost:3000/**` (for development)

### 7. Test Your Deployment

1. Visit your Vercel URL
2. Sign in with demo credentials:
   - Email: `test@careeros.com`
   - Password: `testpassword123`
3. Test all features:
   - Dashboard loads
   - Daily tasks work
   - KPIs are editable
   - Phase pages load
   - Settings work

## 🔧 Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check that database migrations were applied
- Verify TypeScript compilation: `npm run type-check`

### Authentication Issues
- Check Supabase URL configuration
- Verify redirect URLs include your domain
- Ensure RLS policies are enabled

### Database Issues
- Run migrations in correct order
- Check that service role key has proper permissions
- Verify user isolation in RLS policies

## 📱 PWA Configuration

The app is already configured for PWA installation:
- Manifest file: `/app/manifest.json`
- Service worker: `/app/sw.js`
- Icons: `/public/icon-*.png`

Users can install the app on:
- **Desktop**: Chrome/Edge install prompt
- **Mobile**: "Add to Home Screen" option

## 🔒 Security Notes

- Service role key is only used in seed scripts (server-side)
- Client code only uses anon key
- RLS policies ensure user data isolation
- All API calls are authenticated

## 📊 Monitoring

After deployment, monitor:
- Vercel function execution time
- Supabase database usage
- User authentication metrics
- PWA installation rates

## 🎉 Success!

Your Career OS app is now live and ready to help users transform their careers!

**Demo URL**: `https://your-app.vercel.app`
**Admin**: Supabase dashboard for data management