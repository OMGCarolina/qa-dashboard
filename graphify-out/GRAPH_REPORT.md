# Graph Report - .  (2026-08-04)

## Corpus Check
- 25 files · ~8,644 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 141 nodes · 178 edges · 14 communities (10 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Dashboard Overview
- Domain Management
- Package Config
- Deployment Pipeline
- Framework Dependencies
- TypeScript Config
- Site Cards & Progress
- Project Documentation
- Site CRUD Pages
- OpenCode Config
- Graphify Plugin
- Add Site API
- Tailwind Styling

## God Nodes (most connected - your core abstractions)
1. `scripts` - 7 edges
2. `getReports()` - 6 edges
3. `getAllReports()` - 6 edges
4. `Cloudflare Pages Deployment` - 6 edges
5. `getExpiryStatusFromDomain()` - 5 edges
6. `formatDuration()` - 4 edges
7. `include` - 4 edges
8. `QA Dashboard Handoff Document` - 4 edges
9. `Domains Data Flow (Pending)` - 4 edges
10. `Astro Development Workflow` - 3 edges

## Surprising Connections (you probably didn't know these)
- `OMG Logo Image` --references--> `QA Dashboard Handoff Document`  [INFERRED]
  public/images/LOGO-OMG-1.png → HANDOFF.md
- `Astro Development Workflow` --conceptually_related_to--> `Astro Project Structure`  [INFERRED]
  AGENTS.md → README.md
- `getStaticPaths()` --calls--> `getAllReports()`  [EXTRACTED]
  src/pages/sites/[slug].astro → src/utils/reports.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **QA Data Pipeline (ADA → JSON → GitHub → Cloudflare)** — handoff_ada_vps_oracle, handoff_qa_flow, handoff_cloudflare_pages_deployment, handoff_data_build_time_import [EXTRACTED 1.00]
- **Domains Data Pipeline (GoDaddy + Sheets → Merge → GitHub → Cloudflare)** — handoff_godaddy_api_integration, handoff_google_sheets_integration, handoff_dominions_merge_script, handoff_domains_flow, handoff_cloudflare_pages_deployment [EXTRACTED 1.00]
- **Astro Project Conventions** — concept_astro_dev_workflow, concept_astro_project_structure, concept_astro_guides [INFERRED 0.85]

## Communities (14 total, 4 thin omitted)

### Community 0 - "Dashboard Overview"
Cohesion: 0.09
Nodes (29): bottomScore, metrics, recentFailures, reports, reportsWithData, topScore, topSlugs, getStaticPaths() (+21 more)

### Community 1 - "Domain Management"
Cohesion: 0.11
Nodes (16): bgColor, daysLeft, emoji, expiryStatus, label, textColor, domains, metrics (+8 more)

### Community 2 - "Package Config"
Cohesion: 0.12
Nodes (15): devDependencies, wrangler, engines, node, name, scripts, astro, build (+7 more)

### Community 3 - "Deployment Pipeline"
Cohesion: 0.23
Nodes (12): ADA VPS Oracle Bot, Astro SSG Framework, Cloudflare Pages Deployment, Build-Time Data Import Pattern, Domains Data Flow (Pending), Domain Merge Script (Pending), GitHub API Client-Side Integration, GoDaddy API Integration (Pending) (+4 more)

### Community 4 - "Framework Dependencies"
Cohesion: 0.22
Nodes (9): astro, @astrojs/cloudflare, dependencies, astro, @astrojs/cloudflare, tailwindcss, @tailwindcss/vite, tailwindcss (+1 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.22
Nodes (8): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, ./worker-configuration.d.ts, exclude, extends, include

### Community 6 - "Site Cards & Progress"
Cohesion: 0.22
Nodes (7): emoji, firstFailure, passRate, barColorMap, statusLevel, trackColorMap, SiteReport

### Community 7 - "Project Documentation"
Cohesion: 0.43
Nodes (3): Astro Development Workflow, Astro Documentation Guides, Astro Project Structure

### Community 9 - "OpenCode Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

## Knowledge Gaps
- **61 isolated node(s):** `passRate`, `emoji`, `firstFailure`, `statusLevel`, `barColorMap` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Framework Dependencies` to `Package Config`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Cloudflare Pages Deployment` (e.g. with `Astro SSG Framework` and `Domains Data Flow (Pending)`) actually correct?**
  _`Cloudflare Pages Deployment` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `passRate`, `emoji`, `firstFailure` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Overview` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._
- **Should `Domain Management` be split into smaller, more focused modules?**
  _Cohesion score 0.10666666666666667 - nodes in this community are weakly interconnected._
- **Should `Package Config` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._