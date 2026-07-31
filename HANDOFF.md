# QA Dashboard — Handoff Document
**Última actualización:** 2026-07-31

---

## Estado actual

El dashboard está **deployed y funcionando** en Cloudflare Pages con datos mock.

| Entorno | URL |
|---|---|
| Producción | `https://qa-dashboard.pages.dev` |
| Preview | `https://558b9f36.qa-dashboard-8le.pages.dev` |
| Repo | `https://github.com/OMGCarolina/qa-dashboard` |

---

## Stack

| Herramienta | Versión | Notas |
|---|---|---|
| Astro | 7.x | Static Site Generation (SSG) |
| Tailwind CSS | 4.x | Via `@tailwindcss/vite` |
| TypeScript | Strict | |
| Deploy | Cloudflare Pages | Via Wrangler CLI |
| Node | >=18 | Build local con Node 22 |

---

## Estructura del proyecto

```
qa-dashboard/
├── src/
│   ├── components/
│   │   ├── AddSiteForm.astro      # Formulario (GitHub API client-side)
│   │   ├── DomainCard.astro       # Card de dominio
│   │   ├── EmptyState.astro       # Estado vacío
│   │   ├── SiteCard.astro         # Card de sitio QA
│   │   ├── SummaryCards.astro     # Tarjetas de métricas
│   │   ├── TestList.astro         # Lista de tests
│   │   └── TestProgressBar.astro  # Barra de progreso
│   ├── data/
│   │   ├── dominios.json          # Mock: 4 dominios (columnas reales del sheet)
│   │   ├── sites.json             # Mock: 3 sitios WordPress
│   │   └── reports/
│   │       ├── jersey-canna.json
│   │       ├── jerseyleaf.json
│   │       └── cosmopolitaderma.json
│   ├── layouts/
│   │   └── DashboardLayout.astro  # Sidebar + navbar mobile
│   ├── pages/
│   │   ├── index.astro            # Dashboard principal
│   │   ├── sites/
│   │   │   ├── index.astro        # Lista de sitios
│   │   │   ├── [slug].astro       # Detalle de sitio
│   │   │   └── new.astro          # Agregar sitio
│   │   └── dominios/
│   │       └── index.astro        # Lista de dominios
│   ├── styles/
│   │   └── global.css             # Tailwind + tema custom
│   └── utils/
│       ├── reports.ts             # Helpers QA (import directo, sin fs)
│       └── dominios.ts            # Helpers dominios
├── public/
│   └── favicon.svg
└── package.json
```

---

## Secciones del dashboard

### 1. Dashboard principal (`/`)
- Summary cards: Sitios monitoreados, Tests totales, Tasa de éxito, Fallos
- Últimas ejecuciones con barra de progreso
- Hallazgos recientes (tests fallados)

### 2. Sitios (`/sites`)
- Grid de SiteCards con estado (🟢🟡🔴 o ⏳ Pendiente)
- Buscador por nombre/URL
- Filtros por estado

### 3. Detalle de sitio (`/sites/[slug]`)
- Métricas del sitio (tests, pasaron, fallaron, tiempo)
- Timeline de tests con ✅/❌ y mensajes de error
- Botón "Eliminar sitio" (demo)

### 4. Agregar sitio (`/sites/new`)
- Formulario con nombre, URL, descripción, tipo de tests
- Preview de slug en tiempo real
- Guarda via GitHub API client-side (token en localStorage)

### 5. Dominios (`/dominios`) ← NUEVO
- Summary cards: Total, Vigentes, Por vencer, Vencidos
- Grid de DomainCards ordenado por urgencia
- Buscador por dominio o propiedad
- Card muestra: expiración, registrado, renovación, costo, cuenta delegada

---

## Datos mock actuales

### Sites (3 sitios)
| Slug | Nombre | Tests |
|---|---|---|
| jersey-canna | Jersey Canna | 12 tests |
| jerseyleaf | Jersey Leaf | (reporte real de ADA) |
| cosmopolitaderma | Cosmopolita Derma | (reporte real de ADA) |

### Dominios (4 dominios)
| Domain | Propiedad | Expira | Estado |
|---|---|---|---|
| jersey-canna.com | Jersey Canna | 15/03/2027 | VIGENTE |
| jerseyleaf.net | Jersey Leaf | 01/06/2027 | VIGENTE |
| cosmopolitaderma.com | Cosmopolita Derma | 20/10/2026 | VIGENTE |
| onemarketingroup.com | Onemarketing Group | 15/06/2025 | VENCIDO |

---

## Arquitectura de integración

### Flujo QA (actual)
```
ADA (VPS Oracle) → ejecuta tests → genera JSON → push a GitHub → Cloudflare rebuild
```

### Flujo Dominios (pendiente)
```
Script (VPS) → fetch GoDaddy API → fetch Google Sheets → merge → push a GitHub → Cloudflare rebuild
```

### Datos del sheet (columnas reales)
```
DOMINIO | REGISTRADOR | PROPIEDAD | RENOVACIÓN ACTIVA | FECHA DE REGISTRO | 
FECHA DE EXPIRACION | ESTADO DE EXPIRACIÓN | USUARIO | CONTRASEÑA | 
CUENTA DELEGADA | COSTO RENOVACIÓN
```

---

## Pendiente — Integración real

### 🔴 Prioridad alta

- [ ] **Integrar Google Sheets** — Service Account + script para leer el sheet
- [ ] **Integrar GoDaddy API** — Token `gd_pat` para leer dominios técnicos
- [ ] **Script de merge** — Combina GoDaddy + Sheets → `dominios.json`
- [ ] **Sync automático** — Cron job o trigger en el VPS de Oracle
- [ ] **Google Auth** — Configurar Service Account con acceso al sheet

### 🟡 Prioridad media

- [ ] **Deploy automático** — Que ADA haga `wrangler pages deploy` después del sync
- [ ] **Eliminar sitio** — Implementar borrado real (commit a GitHub)
- [ ] **Filtros avanzados** — Por estado, por registrador, por expiración
- [ ] **Gráfico de historial** — Chart.js para últimos 7 días de tests (Fase 2)
- [ ] **Dark mode** — Toggle con clase `dark:` y CSS variables

### 🟢 Prioridad baja

- [ ] **SSR** — Cambiar a `@astrojs/vercel` o `@astrojs/node` si se necesitan endpoints
- [ ] **Autenticación** — Proteger el dashboard con login
- [ ] **Notificaciones** — Alertas cuando un dominio está por vencer o un test falla
- [ ] **Export PDF** — Generar reporte de dominios/tests
- [ ] **Multi-tenant** — Soporte para múltiples clientes

---

## Notas técnicas

### Cloudflare Pages
- **NO** usa `@astrojs/cloudflare` adapter — deploy es HTML/CSS/JS puro
- Deploy manual via `npx wrangler pages deploy dist --project-name=qa-dashboard`
- El proyecto fue creado via Wrangler, NO conectado a Git (para evitar auto-detección de framework)
- Para deploy automático, ADA puede ejecutar `wrangler pages deploy` directamente

### GitHub API (formulario de sitios)
- Token se guarda en `localStorage` del usuario
- El formulario lee `src/data/sites.json` via GitHub API, agrega el sitio, y commitea
- Requiere Fine-Grained PAT con permiso `Contents: Write`

### Datos
- Los datos se importan directamente en build time (sin `fs` ni `path`)
- Esto permite que Cloudflare prerender funcione sin errores de Node.js modules
- Cada vez que ADA pushea datos nuevos, Cloudflare rebuild actualiza el dashboard

### Wrangler
- Ya autenticado en la máquina local como `danielt@onemarketingroup.com`
- Account: `One Marketing Group` (ID: `4719006715151a2fbdf7e38115ed3f23`)
- Permisos: `pages (write)`, `workers (write)`, etc.

---

## Comandos útiles

```bash
# Desarrollo local
npm run dev                    # Dev server en localhost:4321

# Build
npm run build                  # Genera dist/

# Deploy
npx wrangler pages deploy dist --project-name=qa-dashboard

# Git
git add -A && git commit -m "msg" && git pull --rebase origin main && git push
```

---

## Contactos / Cuentas

| Servicio | Usuario | Notas |
|---|---|---|
| GitHub | OMGCarolina | Repo: `OMGCarolina/qa-dashboard` |
| Cloudflare | danielt@onemarketingroup.com | Account: One Marketing Group |
| GoDaddy | (token API) | `gd_pat` para lectura de dominios |
| Google Sheets | Service Account (pendiente) | Necesita acceso al sheet de dominios |
| VPS Oracle | ADA | Bot de QA, corre tests y sync |
