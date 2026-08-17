# SUSS Module Reviews

A full-stack web app where SUSS ICT students can browse modules, search/filter them, read reviews from other students and submit their own ratings after logging in. It also include a rule-based module recommendation assistant and content moderation for reviews.

**Live demo:** [suss-module-reviews.vercel.app](https://suss-module-reviews.vercel.app)

> An independent student project — not affiliated with or endorsed by SUSS.

## Features

- Browse and search/filter ICT modules by name or category
- View module details and read reviews from other students
- Sign up / log in / log out, with password reset support
- Submit a star rating and written review (only when logged in)
- Edit or delete your own reviews
- Content moderation blocks inappropriate language in reviews
- "Module Assistant" recommends modules based on a free-text question, using a custom rule-based matching algorithm (no paid AI API)
- Average ratings shown on each module card
- Loading skeleton states, custom favicon, and a consistent design system

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend/Database:** Supabase (Postgres, Auth via `@supabase/ssr`, Row Level Security)
- **Hosting:** Vercel
- **Version Control:** Git / GitHub

## Why I Built This

I wanted to build a complete full-stack project — covering frontend, database design, authentication, security, and deployment — using a real, relatable problem: helping ICT students choose modules based on peer reviews.

## Architecture

The frontend communicates directly with Supabase using the `supabase-js` client (separate browser and server clients via `@supabase/ssr`, so both client-side interactivity and server-rendered pages correctly know who's logged in). Access control is enforced with Row Level Security (RLS) policies at the database level — for example, only authenticated users can submit reviews, and users can only edit or delete their own.

## Running Locally

```bash
git clone https://github.com/srirav05/suss-module-reviews.git
cd suss-module-reviews
npm install
```

Create a `.env.local` file with your own Supabase project credentials:


Then run:
```bash
npm run dev
```

## What I'd Improve Next

- Pagination for large module lists
- Admin moderation tools for reviews
- Expand the recommendation assistant's keyword matching
- Notification emails when someone reviews a module you follow