# 🌿 EcoBridge

**Turning everyday waste into real rewards for Lagos.**

EcoBridge is a recycling rewards platform that connects Lagos residents, waste collection centers, and sustainable brands — letting people earn points for the plastic, paper, metal, and glass they recycle, and redeem those points for airtime, vouchers, and other everyday essentials.

Built for **Hackathon 2026**, under the **SDG 13: Climate Action** track.

---

## 🚩 The Problem

Waste management in Lagos is a daily, visible challenge — but very little incentive exists for ordinary people to sort and recycle their own waste. EcoBridge turns recycling into something rewarding rather than thankless, giving individuals, schools, and businesses a reason to participate in a cleaner, greener city.

---

## ✨ Features

### For Users
- **Landing page & waitlist** — public-facing marketing site explaining how EcoBridge works
- **Authentication** — signup, login, forgot/reset password (with OTP flow)
- **Dashboard** — points balance, recent recycling activity, quick actions
- **Rewards Catalog** — browse and redeem points for airtime, vouchers, and discounts, with category filtering
- **Redemption flows** — airtime redemptions confirm via a lightweight toast notification; voucher redemptions generate a real, scannable QR code and a downloadable coupon image
- **Recycling & Reward History** — searchable, filterable records of past activity, with a transaction details view
- **Notifications** — grouped by date, filterable by type, with read/unread state
- **Profile management** — edit profile details, change password with live strength validation

### For Admins
- **Admin portal** — separate login and dashboard for staff, distinct from the user-facing app
- **Record Waste** — a guided flow for staff to look up a user, log a collection, and award points, with live point calculation
- **Manage Users** — searchable, filterable, paginated user directory with individual user detail pages
- **Manage Rewards** — reward inventory with stock levels and status
- **Analytics** — waste collection trends, user growth, top recyclers, and collection center performance

---

## 🛠️ Tech Stack

- **Frontend:** React (Create React App), React Router, Tailwind CSS
- **Icons:** lucide-react
- **Charts:** Recharts
- **QR codes:** qrcode.react
- **Image export:** html-to-image (used to generate downloadable coupon images)
- **Backend:** Node.js *(in progress — see note below)*

> **Note on backend status:** This repository currently contains the full frontend experience. Forms, redemption flows, and admin actions are wired up and functional in the browser, but several are marked with `// TODO` comments pointing to where a real Node.js API call will eventually replace mock data, `setTimeout` simulations, or `console.log` submissions. This is intentional — it means every screen is fully clickable and demoable today, while backend integration is a clearly scoped next step.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-ORG/ecobridge-frontend.git
cd ecobridge-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

### Available Scripts
| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Runs the test suite |

---

## 📁 Project Structure

```
src/
├── assets/            # Images and illustrations
├── components/        # Reusable UI pieces (Navbar, Footer, Sidebar, modals, etc.)
├── data/              # Mock/seed data used ahead of backend integration
├── layouts/           # Page shells shared across groups of pages (e.g. DashboardLayout, AdminLayout)
├── pages/             # Full screens, one per route
│   └── admin/         # Admin-only pages (Dashboard, Record Waste, Manage Users, etc.)
├── utils/             # Small shared helper functions
├── App.js             # Route definitions
└── index.js           # App entry point
```

---

## 👥 Team

| Name | Role |
|---|---|
| Oyewopo Hameedat | Team Lead, Full-Stack Developer |
| Rahmat Opoola | Frontend/Backend Developer |
| Azeezah Yusuf | Product Manager |
| Yusroh Olasupo | Frontend Developer |
| Galbah Bamgbopa | Researcher |
| Abdulkareem Nafisah | UI/UX Designer |

---

## 🏆 Hackathon

**Hackathon 2026** (SDG 13: Climate Action track).

---

## 📄 License

This project was built for hackathon submission purposes.-frontend" 
"# Ecobridge-frontend" 
