# Graph Report - .  (2026-07-31)

## Corpus Check
- Corpus is ~4,379 words - fits in a single context window. You may not need a graph.

## Summary
- 91 nodes · 122 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Report Data Loading
- Site Detail Pages
- Package Config
- Dependencies
- Site Card Components
- Dashboard Home
- TypeScript Config
- Documentation
- Netlify Functions
- Add Site Form

## God Nodes (most connected - your core abstractions)
1. `getReports()` - 6 edges
2. `getAllReports()` - 6 edges
3. `scripts` - 5 edges
4. `mergeData()` - 4 edges
5. `formatDuration()` - 4 edges
6. `getReportBySlug()` - 3 edges
7. `getPassRate()` - 3 edges
8. `getGlobalMetrics()` - 3 edges
9. `getRecentFailures()` - 3 edges
10. `formatDate()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Astro Development Workflow` --conceptually_related_to--> `Astro Project Structure`  [INFERRED]
  AGENTS.md → README.md
- `getStaticPaths()` --calls--> `getAllReports()`  [EXTRACTED]
  src/pages/sites/[slug].astro → src/utils/reports.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Astro Project Conventions** — concept_astro_dev_workflow, concept_astro_project_structure, concept_astro_guides [INFERRED 0.85]

## Communities (11 total, 1 thin omitted)

### Community 0 - "Report Data Loading"
Cohesion: 0.23
Nodes (11): getGlobalMetrics(), getRecentFailures(), getReportBySlug(), getReports(), GlobalMetrics, loadReports(), loadSites(), mergeData() (+3 more)

### Community 1 - "Site Detail Pages"
Cohesion: 0.21
Nodes (8): reports, getStaticPaths(), passRate, report, formatDate(), formatDuration(), getAllReports(), getPassRate()

### Community 2 - "Package Config"
Cohesion: 0.18
Nodes (10): engines, node, name, scripts, astro, build, dev, preview (+2 more)

### Community 3 - "Dependencies"
Cohesion: 0.22
Nodes (9): astro, @netlify/functions, dependencies, astro, @netlify/functions, tailwindcss, @tailwindcss/vite, tailwindcss (+1 more)

### Community 4 - "Site Card Components"
Cohesion: 0.22
Nodes (7): emoji, firstFailure, passRate, barColorMap, statusLevel, trackColorMap, SiteReport

### Community 5 - "Dashboard Home"
Cohesion: 0.22
Nodes (7): metrics, pendingSites, recentFailures, reports, reportsWithData, getStatusEmoji(), getStatusLevel()

### Community 6 - "TypeScript Config"
Cohesion: 0.25
Nodes (7): **/*, astro/tsconfigs/strict, .astro/types.d.ts, dist, exclude, extends, include

### Community 7 - "Documentation"
Cohesion: 0.43
Nodes (3): Astro Development Workflow, Astro Documentation Guides, Astro Project Structure

### Community 8 - "Netlify Functions"
Cohesion: 0.29
Nodes (3): AddSiteBody, config, SiteEntry

## Knowledge Gaps
- **40 isolated node(s):** `AddSiteBody`, `SiteEntry`, `config`, `name`, `type` (+35 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Dependencies` to `Package Config`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `getAllReports()` connect `Site Detail Pages` to `Report Data Loading`, `Dashboard Home`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `AddSiteBody`, `SiteEntry`, `config` to the rest of the system?**
  _40 weakly-connected nodes found - possible documentation gaps or missing edges._