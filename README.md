# GitHub Recapped

Spotify Wrapped for Developers. Turn commits, repositories, pull requests, and contribution history into a stunning, gamified visual narrative.

---

## Key Features

*   **Real Public Scraper**: Fetches real daily metrics directly from public GitHub contributions without requiring personal access tokens or OAuth authorizations. Supports instant synchronization via a "Sync Live" cache bypass.
*   **Collectible Developer Trading Cards**: Featured summaries on the home screen render as high-fidelity developer matchup trading cards with spinning gradient rings and holographic hover glows.
*   **Gamified Tiering & Archetypes**: Automatically analyzes commit volumes to determine developer levels (1 to 5) and archetypes (e.g., *Highly Productive Builder*, *Ecosystem Architect*, *UI Specialist*).
*   **Immersive Wrapped Slide Deck**: Spotify Wrapped-style slideshow mapping out flagship codebases, active hours, streaks, and top milestones with dynamic slide transitions.
*   **Side-by-Side Comparison Arena**: A matchup comparison board where two developers can match statistics side-by-side, highlighting metric winners with trophies.
*   **Premium Data Visualizations**: Custom-styled Recharts elements featuring linear gradient area plots, rounded corner bar charts, custom donut legends, and glowing electric violet heatmap blocks.
*   **High-Fidelity Glassmorphism**: Built with fluid light and dark animated background gradient meshes, letting background colors flow visibly underneath the glassmorphic panels.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | App Router, server-side rendering, and API routing |
| **Tailwind CSS v4** | CSS-first styling and class-based dark mode variants |
| **Framer Motion 12** | Staggered spring animations and rolling counters |
| **Recharts** | SVG-based gradients and interactive tooltips |
| **Prisma ORM** | Caching engine with SQLite local storage |
| **Canvas Confetti** | Celebration particles triggered on success states |

---

## Project Structure

```
├── prisma/                  # Prisma Database schema and SQLite local store
└── src/
    ├── app/                 # Next.js App Router (Layouts, API endpoints, views)
    │   ├── api/             # API routes for scraping and comparison matching
    │   ├── compare/         # Developer matchup comparison arena page
    │   ├── story/           # Custom stats dashboard and developer archetypes
    │   └── wrapped/         # Fullscreen Spotify Wrapped slideshow deck
    ├── components/          # Reusable shared UI elements and cards
    │   ├── charts/          # Custom Recharts components (active-hours, heatmap)
    │   └── ui/              # Primitive buttons, inputs, and animated elements
    └── lib/                 # Core scraping engine and mock database layer
```

---

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm, yarn, pnpm, or bun

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yathartharastogi/Github-Recapped.git
    cd Github-Recapped
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Database Migration**
    Initialize the SQLite local store schema using Prisma:
    ```bash
    npx prisma db push
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3001](http://localhost:3000) in your browser.

---

## Contributing

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

<p align="center">
  Built with 💜 for developers who value visual metrics.
</p>
