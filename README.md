# MyVenue

Venue-owned digital workspace for creating, managing, sharing, and simulating event layouts.

## Overview

MyVenue is a tablet-first platform that gives venues full control over their digital space. Design accurate 2D floor plans, view layouts in 3D walkthrough mode, collaborate with teams in real time, simulate guest movement, and share layouts externally.

**The venue owns its space. MyVenue provides the tools.**

## Features

- **2D Floor Planner** — Drag, drop, move, rotate, resize, copy, delete, and lock objects
- **3D Walkthrough** — Visual layer on top of the 2D plan (isometric preview; full engine planned)
- **Furniture Library** — Venue-specific items across Tables, Seating, Equipment, and Decor
- **Layout Versions** — Every save creates a version with history and restore
- **Real-Time Collaboration** — Live user presence and instant sync (WebSocket layer planned)
- **Team & Permissions** — Owner, Manager, Designer, Staff, Viewer roles
- **Event Simulation** — Wedding, Concert, Bingo, Nightclub presets with crowd visualization
- **External Sharing** — Share links for view-only access without accounts
- **Multi-Platform AppShell** — Tablet (primary), Mobile, and Desktop layouts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 2D Canvas | React Konva |
| State | Zustand |
| Database | Prisma + SQLite (dev) |
| Icons | Lucide React |

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or go directly to [http://localhost:3000/workspace](http://localhost:3000/workspace) for the demo floor planner.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # REST API routes
│   ├── workspace/          # Main editor workspace
│   └── venues/             # Venue management
├── components/
│   ├── app-shell/          # Tablet/Mobile/PC shell layouts
│   ├── floor-planner/      # 2D canvas editor
│   └── panels/             # Side panel content
├── lib/                    # Utilities, DB client, demo data
├── stores/                 # Zustand state management
└── types/                  # Shared TypeScript types
prisma/
├── schema.prisma           # Full data model
└── seed.ts                 # Demo data seeder
```

## Architecture

```
Tablet AppShell ──┐
Mobile AppShell ──┼── Shared MyVenue Core
PC AppShell     ──┘       │
                    ┌──────┴──────┐
                    │   Prisma    │
                    │  Database   │
                    └─────────────┘
```

## Data Model

Users, Venues, Rooms, Layouts, LayoutObjects, LayoutVersions, VenueItems, VenueMembers, Zones, ActivityLogs, ShareLinks, Simulations

## Roadmap

- [ ] WebSocket real-time collaboration engine
- [ ] Full Three.js 3D walkthrough
- [ ] Pathfinding crowd simulation with heat maps
- [ ] Authentication (NextAuth)
- [ ] Client approval workflow
- [ ] AI layout suggestions
- [ ] Live event mode

## License

Private — All rights reserved.
