# Carbon-FT: Personal Carbon Emission Tracker

## Overview
**Carbon-FT** is a modern web application that empowers individuals to track, visualize, and reduce their daily carbon emissions. By logging daily activities, users gain actionable insights into their environmental impact, set reduction goals, and stay motivated with achievements and streaks.

---

## Table of Contents
- [Features](#features)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Data Structure & Storage](#data-structure--storage)
- [Technologies Used](#technologies-used)
- [File/Folder Structure](#filefolder-structure)
- [Customization & Extending](#customization--extending)
- [Getting Started](#getting-started)
- [Contribution Guidelines](#contribution-guidelines)
- [FAQ](#faq)
- [Accessibility & Browser Support](#accessibility--browser-support)
- [Security & Privacy](#security--privacy)
- [License](#license)
- [Author & Contact](#author--contact)

---

## Features
- **Activity Logging:** Log daily actions (e.g., travel, food, energy use) and instantly see their carbon impact.
- **Emissions Dashboard:**
  - **Pie Chart:** Visualizes the percentage of emissions by category.
  - **Bar Chart:** Shows daily emission trends over time.
  - **Line Chart:** Tracks cumulative emissions for long-term progress.
- **Achievements & Streaks:** Earn badges and maintain streaks for consistent eco-friendly behavior.
- **Daily Summary Pop-up:** After each log, see a motivational summary comparing today’s emissions with yesterday’s.
- **Responsive UI:** Beautiful, mobile-friendly design using Tailwind CSS.
- **Theme Support:** Toggle between light and dark mode.
- **Data Persistence:** All data is stored locally in your browser (no cloud required).
- **Easy Reset:** One-click reset for all data and achievements.

---

## How It Works
1. **Onboarding:**
   - Enter your name, set a personal goal, and choose your preferred theme (light/dark) on first use.
2. **Logging Activities:**
   - Use the intuitive form to log activities such as driving, eating, or using electricity.
   - Each entry calculates CO₂ emissions using built-in emission factors.
3. **Visualizing Data:**
   - The dashboard updates charts and stats in real time, showing trends and breakdowns.
   - Pie, bar, and line charts help you understand your emissions by category and over time.
4. **Achievements:**
   - Track your streaks (consecutive days logging) and earn badges for consistent logging and emission reduction.
5. **Daily Feedback:**
   - After adding an activity, a summary modal tells you how you did compared to yesterday, motivating you to improve.
6. **Reset & Theme:**
   - You can reset all your data or switch between light/dark mode at any time.

---

## Screenshots
> _Add screenshots here!_
- Dashboard view
- Activity logging form
- Achievements and streaks
- Daily summary modal

---

## Data Structure & Storage
- **LocalStorage:**
  - All user data (profile, activities, achievements, streaks) is stored in the browser's localStorage.
  - No data is sent to any server or cloud.
- **Main Data Types:**
  - `User`: `{ name: string, goal: string, theme: 'light' | 'dark' }`
  - `Activity`: `{ id: string, date: string, type: string, category: string, co2Emissions: number }`
  - `StreakData`, `Badge`: See `src/utils/achievements.ts` for details.

---

## Technologies Used
- **React** ([reactjs.org](https://reactjs.org/)) — UI framework
- **TypeScript** ([typescriptlang.org](https://www.typescriptlang.org/)) — Type safety
- **Recharts** ([recharts.org](https://recharts.org/)) — Data visualization
- **Tailwind CSS** ([tailwindcss.com](https://tailwindcss.com/)) — Styling
- **Lucide-react** ([lucide.dev](https://lucide.dev/)) — Icons
- **LocalStorage** — Persistent browser storage

---

## File/Folder Structure
```
Carbon-FT/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components (Dashboard, Achievements, Modal, etc.)
│   ├── utils/               # Utility functions (achievements, storage, emission factors)
│   ├── types.ts             # TypeScript types
│   ├── App.tsx              # Main app logic
│   └── index.tsx            # Entry point
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS config
├── README.md                # This file
└── ...
```

---

## Customization & Extending
- **Add Activities:**
  - Edit `src/types.ts` and `src/utils` to add new activity types and emission factors.
- **Achievements:**
  - Tweak or add new badges in `src/utils/achievements.ts`.
- **UI:**
  - Customize styles using Tailwind CSS classes.
- **Themes:**
  - Easily switch or extend theme logic in `App.tsx`.

---

## Getting Started
1. **Clone or Download:**
   ```bash
   git clone <your-repo-url>
   cd Carbon-FT
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run the App:**
   ```bash
   npm start
   ```
4. **Open in Browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## Contribution Guidelines
- Fork this repo and create a feature branch.
- Make your changes with clear commit messages.
- Test your features thoroughly.
- Submit a pull request with a detailed description.
- All contributions are welcome — from features to bug fixes to documentation!

---

## FAQ
**Q: Is my data safe?**  
A: Yes, all data is stored locally in your browser and never leaves your device.

**Q: Can I use this on mobile?**  
A: Absolutely! The UI is fully responsive.

**Q: How do I reset my data?**  
A: Click the reset button in the app header. This clears all activities and achievements.

**Q: Can I add custom activities or categories?**  
A: Yes! Edit the emission factors/types in the code as described above.

**Q: What browsers are supported?**  
A: All modern browsers (Chrome, Firefox, Edge, Safari).

---

## Accessibility & Browser Support
- Fully keyboard navigable.
- Uses accessible color contrasts and ARIA labels where appropriate.
- Works on all modern browsers and devices.

---

## Security & Privacy
- No user data is sent to any server.
- No tracking, ads, or analytics.
- 100% local-first and privacy-respecting.

---

## License
MIT License. See [LICENSE](LICENSE) for details.

---

## Author & Contact
Created by Sujal Jaiswal.  
For questions, feedback, or support, please contact: [sujaljaiswal304@gmail.com]

---
