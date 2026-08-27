# CreatorFlow Design System

> Extracted from SideShift's actual source code. Single source of truth for the rebuild.

## Brand
- **App Name:** CreatorFlow
- **Tagline:** Content Creator & UGC Platform
- **Logo:** Text-based "CreatorFlow" in Geist Bold

## Colors

### Text
- Primary: `#202020`
- Secondary: `rgba(32,32,32,0.75)`
- Muted: `rgba(32,32,32,0.55)`
- Placeholder: `rgba(32,32,32,0.4)`
- Faint: `rgba(32,32,32,0.35)`

### Backgrounds
- Page: `#FFFFFF`
- Hero gradient: `linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)`
- Testimonial gradient: `linear-gradient(180deg, #FFFFFF 0%, #E0F5FF 30%, #D0EDFF 50%, #E0F5FF 70%, #FFFFFF 100%)`
- Card: `white` or `bg-white/70`
- Highlight: `#fdf1c7`

### Accents
- CTA Button: `#202020` bg, `#FFFFFF` text, `border-[#202020]`
- Live Dot: `#3C83F9`
- Success: Tailwind `emerald-500`
- Input Border: `rgba(32,32,32,0.18)`
- Input Shadow: `0 1px 2px rgba(32,32,32,0.05)`

### Dashboard
- Sidebar BG: `#FAFAFA`
- Sidebar Active: `bg-[#E0F5FF]` + `text-[#202020]`
- Sidebar Text: `text-[rgba(32,32,32,0.55)]` default
- Content BG: `#FFFFFF`
- Card: `white` + `border border-gray-200 rounded-lg`
- Kanban Column: `bg-gray-50 rounded-lg p-3`
- Kanban Card: `bg-white shadow-sm rounded-lg`

## Typography

- **Font:** Geist (via next/font)
- **Body class:** `font-sans antialiased`

| Element | Classes |
|---|---|
| H1 Hero | `text-[64px] leading-[95%] font-bold tracking-[-0.05em]` (mobile: `text-[10vw]`, sm: `text-[52px]`) |
| H2 Section | Tailwind default h2 size, `font-bold`, mobile override `max-[375px]:text-[28px]` |
| Body | `text-[15px] leading-[145%]` or `sm:text-lg` |
| Nav Link | `text-base leading-[140%] font-medium` |
| Small | `text-sm` or `text-[13px]` |
| Badge | `text-[13px] font-medium tracking-wide` |
| Fine Print | `text-[12px] leading-tight` |

## Components

### Primary CTA Button
```
rounded-full font-bold leading-[140%] whitespace-nowrap transition-all 
active:scale-95 cursor-pointer bg-[#202020] border border-[#202020] 
text-white px-4 py-2.5 md:px-6 md:py-3 text-[14px] md:text-base
```

### Input (Pill)
```
min-h-[54px] flex-1 rounded-full border border-[rgba(32,32,32,0.18)] 
bg-white px-5 text-[16px] text-[#202020] 
shadow-[0_1px_2px_rgba(32,32,32,0.05)] outline-none 
placeholder:text-[rgba(32,32,32,0.4)]
```

### Card
```
rounded-lg border-2 border-white transition-transform hover:-translate-y-0.5
```

### Glass Badge
```
rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 
shadow-sm backdrop-blur-sm
```

## Animations
- Card hover: `hover:-translate-y-0.5` + `transition-transform`
- Button press: `active:scale-95`
- Scroll reveal: Framer Motion fade-in (opacity 0→1, translateY 6px→0)
- Header scroll: transparent → gradient bg, `duration-500`

## Landing Page Sections (in order)
1. Hero — headline, URL input + CTA, testimonial quote, live dot
2. Trusted By — brand logo row (Brex, Microsoft, Cursor, Replit, Kalshi, Paramount+, Yik Yak, Grammarly, Picsart)
3. Stats — 4 metric cards (3,000+ Brands, 1M+ Creators, 5B Views, $100M+ Paid)
4. Testimonials — video/quote carousel with glassmorphism
5. How It Works — 5-step visual
6. Platform Features — 4 feature cards
7. Comparison — CreatorFlow vs others table
8. Creator Showcase — creator profile cards
9. Reviews — text testimonials
10. CTA — "Post a brief. Creators apply to you."
11. FAQ — accordion (6 items)
12. Footer

## Navbar Links
Platform (dropdown) | Solutions (dropdown) | Pricing (dropdown) | Resources (dropdown) | For Creators | Log in | Book a demo | **Get started** (dark pill CTA)

## Scope
- **Match:** Colors, typography, CTA style, gradients, layout spacing
- **Simplify:** Static logos (no marquee), image cards (no video), simple gradient (no aurora shader)
- **Improve:** shadcn/ui forms, better Kanban UX, cleaner dashboard, progress indicators on onboarding
