# CreatorFlow — Agent Context File

Read this file at the start of every session. It has everything you need.

## What This Project Is
Rebuilding sideshift.app (renamed CreatorFlow) for an 8x engineering hiring assignment.
The goal: match and improve SideShift's UI/UX for both brand and creator flows.

## Repo & Stack
- Local: `c:\Users\ADMIN\Desktop\sideshift app 8x`
- GitHub: https://github.com/Jay-D21/sideshift-rebuild
- Stack: Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Clerk (auth), Supabase (DB only)
- Supabase project ID: nywdxwogxkhenvbiqmmd
- Auto-deploys to Vercel on push to main

## Clerk App
- App ID: app_3IVY7Lvl4wMlmZDQS9NYoqyGYOZ
- Already installed and wired in

## Supabase Tables (all have RLS)
profiles, brand_profiles, creator_profiles, campaigns, applications, submissions, messages, transactions

## Design System (non-negotiable — extracted from SideShift source code)
- Font: Geist (already configured)
- Text primary: #202020
- Text secondary: rgba(32,32,32,0.75)
- Text muted: rgba(32,32,32,0.55)
- Hero gradient: linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)
- Accent blue: #E0F5FF (backgrounds), #3C83F9 (live dot, icons)
- Highlight yellow: #fdf1c7
- CTA button: bg-[#202020] text-white rounded-full font-bold active:scale-95
- Cards: rounded-lg border border-gray-200 shadow-sm hover:-translate-y-0.5 transition-transform
- All nav dropdowns: open on HOVER not click
- Sidebar active state: bg-[#E0F5FF] text-[#202020] font-semibold rounded-lg

## App Name
CreatorFlow (not SideShift)

## SideShift Original — Brand Flow (reference for what to build)
Landing page → Navbar with hover dropdowns (Platform, Solutions, Pricing, Resources) →
Hero with headline + input CTA + social proof → Trusted brands marquee →
Stats (3,000+ brands, 1M+ creators, 5B views, $100M+ paid) →
Testimonial video carousel → How it works (5 steps) →
Platform features bento → Comparison table → Creator showcase →
Brand reviews → Final CTA → FAQ → Footer

Brand signup → OTP verification → Set password → Goal selection →
Experience level → Target audience → Research/company info →
Create campaign wizard → Discover creators → Dashboard

Dashboard pages: Jobs, Applicants, Messages, Campaigns, Creators,
Analytics, Video Review, Payouts, Disputes, Affiliates, Video Library, Help Center
Note: if no campaign created, all pages except Video Library show a popup card
redirecting to campaign creation.

## SideShift Original — Creator Flow (reference for what to build)
Creator signup → OTP → Set password → Experience level (just started / worked with brands) →
Moving brand icons animation → Continue → Niche selection →
Content type + post frequency slider → Demographics → Education →
Address → Phone → Skip or upload photo → Socials → Portfolio →
Plan selection (free/pro) → Submit → Dashboard

Creator dashboard pages: Explore, My Campaigns, Training, Messages,
Affiliates, Profile, Account, Portfolio

## Current Issues (what needs fixing right now)
1. Floating hero card overlaps headline — needs proper 2-column layout (text left, card right)
2. Nav dropdowns open on CLICK — must change to HOVER
3. No images/visual richness — needs marquee logos, hero mockup card, decorative elements
4. "Get started" goes straight to Clerk — needs role selection modal first (Brand vs Creator)
5. Hover transitions missing or broken across the site
6. /creators, /pricing pages may be thin or missing
7. /onboarding/role page needed for post-Clerk-signup role selection

## Agent Log Rules (IMPORTANT — 8x assignment requirement)
- .agent-logs/ directory must NOT be in .gitignore
- Run .\extract-logs.ps1 -ConversationId "<id>" at end of each session
- Commit logs interleaved with code, not at the end
- Log file naming: YYYY-MM-DD_HH-MM-SS_<session-id>.md

## Commit Convention
- feat: new features
- fix: bug fixes  
- refactor: restructuring
- docs: documentation
Always push after committing.
