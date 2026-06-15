# 🔮 GitHub Recapped

<p align="center">
  <strong>Spotify Wrapped for Developers.</strong><br />
  Turn commits, repositories, pull requests, and contribution history into a stunning, gamified visual narrative.
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-database-schema">Database Setup</a>
</p>

---

## 🚀 Key Features

*   **⚡ 100% Real Public Scraper**: Fetches real daily metrics directly from public GitHub contributions without requiring personal access tokens or OAuth authorizations. Supports instant synchronization via a "Sync Live" cache bypass.
*   **🎴 Collectible Developer Trading Cards**: Featured summaries on the home screen render as high-fidelity developer matchup trading cards with spinning gradient rings and holographic hover glows.
*   **🎮 Gamified Tiering & Archetypes**: Automatically analyzes commit volumes to determine developer levels (1 to 5) and archetypes (e.g., *Highly Productive Builder*, *Ecosystem Architect*, *UI Specialist*).
*   **🎬 Immersive Wrapped Slide Deck**: Spotify Wrapped-style slideshow mapping out flagship codebases, active hours, streaks, and top milestones with dynamic slide transitions.
*   **⚔️ Side-by-Side Comparison Arena**: A matchup comparison board where two developers can match statistics side-by-side, highlighting metric winners with trophies.
*   **📊 Premium Data Visualizations**: Custom-styled Recharts elements featuring linear gradient area plots, rounded corner bar charts, custom donut legends, and glowing electric violet heatmap blocks.
*   **🫧 High-Fidelity Glassmorphism**: Built with fluid light and dark animated background gradient meshes, letting background colors flow visibly underneath the glassmorphic panels.

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@custom-variant` class-based dark mode overrides)
*   **Animations**: [Framer Motion 12](https://www.framer.com/motion/) (spring-loaded staggering layouts, rolling counters, and sliding panels)
*   **Database & ORM**: [Prisma](https://www.prisma.io/) with SQLite (local caching fallback engine)
*   **Data Vis**: [Recharts](https://recharts.org/) (custom SVG gradients and tooltip glass overrides)
*   **Celebrations**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) (high-performance particles canvas trigger on success loads)

---

## ⚙️ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/) or another package manager (Yarn, pnpm, Bun)

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

3.  **Set Up the SQLite Cache Database**
    Prisma is configured to store cached profiles locally inside `prisma/dev.db`.
    ```bash
    npx prisma db push
    ```

4.  **Run the Local Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3001](http://localhost:3001) in your browser to inspect the application.

---

## 📦 Project Structure

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
    └── lib/                 # Core scraping engine and mock fallback engines
```

---

## 🤝 Contributing

Contributions to improve scraping accuracy, add new archetypes, or expand metrics data analysis are welcome! 

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

<p align="center">
  Built with 💜 for developers who value visual metrics.
</p>
