# Turning Forward LEARN Portal

A GitHub- and Vercel-ready Next.js course portal branded with the uploaded **LEARN — The Conviction Fiction Podcast** logo.

## Included

- Responsive landing page
- Course dashboard with eight modules
- Complete interactive Module 1
- Supabase email/password authentication
- Supabase-backed progress, journal entries, quiz answers, and commitments
- Browser fallback for guests or temporary connection failures
- Row Level Security so students can access only their own progress
- Vercel-ready configuration

## 1. Install and run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The supplied project is configured for:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hgcdchahcdncxbmzjfwk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Open `http://localhost:3000`.

## 2. Create the Supabase table

1. Open the Supabase project dashboard.
2. Select **SQL Editor**.
3. Copy and run `supabase/schema.sql`.

This creates `public.course_progress`, enables Row Level Security, and adds policies that restrict each student to their own record.

## 3. Configure Supabase Authentication

In **Authentication → URL Configuration**:

- Set the production Site URL to your Vercel course URL, such as `https://learn.theconvictionfictionpodcast.com`.
- Add local development redirect URL: `http://localhost:3000/**`.
- Add the Vercel production and preview URLs you plan to use.

Email/password authentication is enabled in the code. Supabase may require email confirmation depending on your project settings.

## 4. Deploy through GitHub and Vercel

1. Create a new GitHub repository.
2. Upload all project files except `.env.local`, `node_modules`, and `.next`.
3. In Vercel, select **Add New → Project**.
4. Import the GitHub repository.
5. Add these environment variables in **Project Settings → Environment Variables**:

```text
NEXT_PUBLIC_SUPABASE_URL=https://hgcdchahcdncxbmzjfwk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your supplied publishable key>
```

6. Apply the variables to Production, Preview, and Development as needed.
7. Deploy.

## Data behavior

- Signed-in students load and save their progress in Supabase.
- Changes are automatically synced after a brief delay.
- Guest progress is stored in `localStorage`.
- When a guest later signs in, local and cloud progress are merged.
- The publishable key is suitable for browser use because database authorization is enforced by Row Level Security. Never add a Supabase service-role key to this frontend project.

## Add lesson videos

Replace each `.video-placeholder` element in `app/course/module-1/page.tsx` with a protected Vimeo, Mux, or Bunny Stream embed.

## Branding

The uploaded logo is stored at:

`public/learn-logo.png`

## Production access control still needed

Supabase authentication identifies students, but it does not yet verify that a student purchased the course. Before selling access, connect Shopify order webhooks to an enrollment table and check enrollment before unlocking course pages.
