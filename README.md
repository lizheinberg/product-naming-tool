# Product Naming Tool — Powered by Prequel

An interactive decision tree that helps companies figure out what kind of name their product needs.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo and deploy (zero config needed)
4. Point your subdomain (e.g., `tools.prequelstudio.com`) to Vercel via DNS

### DNS Setup for Subdomain

In your domain registrar (wherever `prequelstudio.com` is managed):

- Add a **CNAME** record: `tools` → `cname.vercel-dns.com`
- In Vercel dashboard: Settings → Domains → Add `tools.prequelstudio.com`

## Project Structure

```
src/
  app/
    layout.tsx      # Root layout with metadata/SEO
    page.tsx        # Main app (welcome, quiz, results, brainstorm, brief)
    globals.css     # CSS variables, animations, base styles
  lib/
    questions.ts    # Decision tree + brainstorm question data
    outcomes.ts     # Outcome logic — maps answers to name types
```

## Future: AI Name Generation

The brainstorm flow currently outputs a structured naming brief. To add AI-powered name generation:

1. Add an API route at `src/app/api/generate/route.ts`
2. Wire it to OpenAI or Anthropic API with a naming-specific prompt
3. Add Stripe for payment gating
4. Replace the "coming soon" placeholder in the brief screen
