# RICS APC Assistant - Setup Guide

## Overview

This is a comprehensive MRICS APC (Assessment of Professional Competence) assistant web application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- (Optional) OpenAI API key for AI features

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RICS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key (optional)
   ```

4. **Set up Supabase database**
   - Run the migrations in `supabase/migrations/`:
     - `0001_init.sql` - Initial schema
     - `0002_apc_enhancements.sql` - APC-specific enhancements
   - Enable Row Level Security (RLS) policies as needed
   - Set up authentication providers in Supabase dashboard

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### Core Features Implemented

1. **Authentication & Onboarding**
   - User registration and login
   - Profile setup with APC route and pathway selection
   - Counsellor and supervisor details

2. **Competency Tracker**
   - Track mandatory, core, and optional competencies
   - Level tracking (1-3)
   - Progress indicators and sign-off tracking

3. **Experience Diary**
   - Daily/weekly experience entries
   - Link experiences to competencies
   - Project tracking
   - Search and filter functionality

4. **Case Study Manager**
   - Structured templates (3,000 words)
   - Project selection wizard
   - Word count tracking
   - Version control

5. **CPD Tracker**
   - Log CPD activities
   - Automatic hour calculation
   - Annual requirement tracking (48 hours/year)
   - Link to competencies

6. **Summary of Experience Writer**
   - Word count tracking (1,500-4,000 words)
   - Level-appropriate guidance
   - AI suggestions (when OpenAI API key is configured)

7. **Document Preparation Suite**
   - Template library
   - Version control
   - Pre-submission checklist
   - Export capabilities

8. **Interview Preparation**
   - Question bank
   - Mock interview simulator
   - 10-minute presentation timer
   - STAR technique formatter

9. **Progress Dashboard**
   - Readiness score calculator
   - Competency completion tracking
   - CPD hours tracking
   - Days until submission

10. **Resource Library**
    - Pathway guides
    - Rules of Conduct
    - Assessment criteria
    - Video tutorials

## Database Schema

The application uses the following main tables:
- `users` - User profiles and APC details
- `user_competencies` - Individual competency progress
- `experience_entries` - Experience diary entries
- `case_studies` - Case study documents
- `summary_of_experience` - Competency summaries
- `cpd_activities` - CPD activity logs
- `cpd_annual_tracker` - Annual CPD tracking
- `interview_prep` - Interview preparation notes
- `documents` - Document versions
- `projects` - Project tracking

## API Routes

- `/api/pathway` - Pathway advisor logic
- `/api/ai/assist` - AI assistance (requires OpenAI API key)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (platform)/        # Protected platform routes
│   ├── auth/              # Authentication pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   └── shared/            # Shared components
├── data/                  # Static data files
├── lib/                   # Utility functions
│   ├── supabase/          # Supabase clients
│   └── ai.ts              # AI utilities
├── types/                 # TypeScript types
└── hooks/                 # Custom React hooks
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the migration files in order
3. Configure authentication providers
4. Set up storage buckets if needed for document uploads
5. Configure RLS policies for data security

### OpenAI Integration (Optional)

1. Get an API key from OpenAI
2. Add `OPENAI_API_KEY` to your environment variables
3. AI features will automatically be enabled

## Testing

Run tests with:
```bash
npm test
```

## Production Checklist

- [ ] Set up production Supabase project
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Set up authentication providers
- [ ] Configure RLS policies
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure email templates (if using email auth)
- [ ] Set up backup strategy
- [ ] Configure domain and SSL
- [ ] Test all features end-to-end

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

## License

[Add your license here]

