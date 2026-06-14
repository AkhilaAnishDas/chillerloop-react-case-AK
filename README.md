# 🧊 ChillerLoop
### Underground Cooling Intelligence

**Real-time monitoring dashboard for Navi Mumbai's district cooling infrastructure.**  
8 zones · 6 chillers · 18.9 km of underground pipe networks · live sensor data


</div>

---

## 🌐 Live Demo

🔗 ****


---

## 📸 Screenshots

### Dashboard — Live System Overview

> *Live system view showing 1098 L/s flow, 8 active zones, 18.9 km pipeline, 21 MW capacity — Navi Mumbai UGCS v2.6*

---

## 📌 About This Project

**ChillerLoop** is a full-featured React dashboard that simulates monitoring and control of a city-scale underground cooling system (UGCS) for **Navi Mumbai, Maharashtra**. It gives technicians real-time visibility into water flow, compressor health, emergency queues, pipe topology, and fan power distribution — all from a single, dark-themed interface.

| Field | Details |
|---|---|
| **Student** | Akhila Anish Das |
| **Roll No** | 150096725016 |
| **Cohort** | Larry Page |
| **Semester** | 2 — Sprint 2 |
| **Program** | B.Tech FY CSE (2025–2029) |
| **Case Study** | #46 |

---

## ✨ Features

| Module | Description |
|---|---|
| 💧 **Flow Speed Tracker** | Tracks and displays real-time velocity of cold water moving through underground pipes with live gauges and trend charts |
| 🔧 **Compressor Override** | Lets technicians safely adjust pressure thresholds on compressors with a mandatory confirm step and full undo support |
| 🚨 **Emergency Restart Queue** | Priority-based queue that auto-sorts restart requests by customer criticality (hospitals, data centers first) |
| 🔍 **Equipment ID Checker** | Instantly validates any chiller or pipe asset number against the central Navi Mumbai equipment registry |
| 🌡️ **Heat Load Sorter** | Ranks all pipe sections by thermal load with color-coded intensity to surface network hotspots quickly |
| 🗺️ **Pipe Map Hub** | Interactive visual map of the full underground pipe network — routes, junctions, and live status overlays |
| ⚡ **Efficient Flow Planner** | Dijkstra-based pathfinder that calculates the lowest pump-energy route through the pipe network |
| 🌀 **Fan Power Balancer** | Monitors and redistributes electricity load evenly across all cooling tower fans to prevent overload |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State Management | React Context API (`AppContext`) |
| Routing | React Router v6 |
| Data | Custom mock data — `naviMumbaiData.js` |
| Icons | Lucide React / custom SVGs |
| Deployment | Vercel / Netlify |

---

## 📁 File Structure

```
chillerloop/
│
├── public/
│   ├── akhila.jpeg               # Developer photo / branding asset
│   ├── favicon.svg               # App favicon
│   ├── icons.svg                 # Sprite sheet for UI icons
│   └── navimumbai_full.mp4       # Background video asset for dashboard hero
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png              # Hero section background
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/               # All feature + layout components
│   │   ├── About.jsx             # About / info page
│   │   ├── CompressorOverride.jsx  # Feature (b): Pressure safety override + undo
│   │   ├── Dashboard.jsx           # Feature: Main overview page
│   │   ├── EquipmentChecker.jsx    # Feature (d): Asset ID validation
│   │   ├── ExcelReport.jsx         # Export data to Excel/CSV
│   │   ├── FanBalancer.jsx         # Feature (h): Fan load distribution
│   │   ├── FlowPlanner.jsx         # Feature (g): Efficient path planner
│   │   ├── FlowTracker.jsx         # Feature (a): Water flow speed tracker
│   │   ├── Footer.jsx              # App footer
│   │   ├── HeatSorter.jsx          # Feature (e): Heat load ranking
│   │   ├── PipeMapHub.jsx          # Feature (f): Underground pipe map
│   │   ├── RestartQueue.jsx        # Feature (c): Emergency restart queue
│   │   ├── Settings.jsx            # App settings panel
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   └── Topbar.jsx              # Top navigation bar (location, theme toggle)
│   │
│   ├── context/
│   │   └── AppContext.jsx        # Global state: theme, active module, alerts
│   │
│   ├── data/
│   │   └── naviMumbaiData.js     # All mock sensor, asset, and pipe network data
│   │
│   ├── App.jsx                   # Root component — layout + routing
│   ├── App.css                   # Global app styles
│   ├── index.css                 # Tailwind base + custom CSS variables
│   └── main.jsx                  # Vite entry point
│
├── .gitignore
├── eslint.config.js
├── index.html                    # HTML shell
├── package.json                  # Dependencies and scripts
├── package-lock.json
├── vite.config.js                # Vite configuration
└── README.md
```

---

## ⚙️ Setup & Installation

> Any developer can follow these steps to run ChillerLoop locally — no prior context needed.

### Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | v18+ | `node -v` |
| npm | v9+ | `npm -v` |
| Git | any | `git --version` |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/chillerloop.git
cd chillerloop
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Start the Development Server

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

> The app uses fully mocked data from `src/data/naviMumbaiData.js` — no backend or API keys required.

---

### Step 4 — Build for Production

```bash
npm run build
```

Output goes to `/dist`. Preview it locally:

```bash
npm run preview
```

---

## 📦 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build optimised production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🚀 Deployment

### Vercel (Recommended — 1 click)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy** — done ✅

### Netlify
1. Go to [netlify.com](https://netlify.com) → **Add new site** → Import from Git
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy** ✅

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   ChillerLoop UI                │
│  Topbar (location · theme)  +  Sidebar (nav)    │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   AppContext.jsx       │  ← Global state (theme, active view, alerts)
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────────────────┐
         │         Components                 │
         │  Dashboard · FlowTracker           │
         │  CompressorOverride · RestartQueue │
         │  EquipmentChecker · HeatSorter     │
         │  PipeMapHub · FlowPlanner          │
         │  FanBalancer · ExcelReport         │
         └───────────┬───────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   naviMumbaiData.js   │  ← All mock data (sensors, assets, pipes)
         └───────────────────────┘
```

---

## 📄 License

Academic project — B.Tech FY CSE, Semester 2, Sprint 2, 2025–2029.

---

<div align="center">

Built with ❄️ by **Akhila Anish Das** · Roll No: 150096725016 · Cohort: Larry Page  
**Navi Mumbai UGCS v2.6** · System Online 🟢
