# AtomQuest — Goal Setting & Tracking Portal
> Built for AtomQuest Hackathon 1.0

AtomQuest is Atomberg's internal goal setting and performance tracking portal. It enables employees to set annual goals, managers to review and approve them, and HR admins to monitor company-wide progress — all in one place.

---

## 🚀 Live Demo

🔗 **[your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)**

### Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@demo.com | Demo@1234 |
| Manager | manager@demo.com | Demo@1234 |
| Admin | admin@demo.com | Demo@1234 |

> Use the **Quick Demo Access** buttons on the login page for one-click role switching.

---

## 📋 What It Does

### For Employees
- Create and manage annual goals across 5 thrust areas (Revenue, Cost, Quality, People, Innovation)
- Set Unit of Measurement per goal: Min, Max, Timeline, or Zero-based
- Weightage validation: must total exactly 100%, minimum 10% per goal, maximum 8 goals
- Submit goals for manager approval
- Log quarterly check-ins (Q1–Q4) with actual achievement data
- View auto-computed progress scores per goal

### For Managers
- Review and approve or return employee goal sheets with comments
- Goals lock automatically upon approval
- Push shared departmental KPIs to multiple employees
- Conduct quarterly check-in reviews with structured feedback
- Monitor team progress in real time

### For Admins (HR)
- Configure goal setting cycles and quarterly windows
- View real-time company-wide completion dashboard
- Unlock goals post-approval when needed (with audit trail)
- Export achievement reports as CSV
- Full audit log of all changes

---

## ✨ Features

- ✅ Role-based access: Employee / Manager / Admin
- ✅ Goal creation with full validation (weightage, limits, UoM types)
- ✅ Manager approval workflow with inline editing
- ✅ Shared goals pushed from manager to team
- ✅ Quarterly check-ins with progress score computation
- ✅ Real-time completion dashboard
- ✅ CSV export of achievement reports
- ✅ Full audit trail
- ✅ Analytics: QoQ trends, thrust area distribution, manager effectiveness

---

## 📊 Progress Score Formulas

| UoM Type | Formula | Example |
|----------|---------|---------|
| **Min** (higher is better) | `(actual / target) × 100` | Sales revenue |
| **Max** (lower is better) | `(target / actual) × 100` | TAT reduction |
| **Timeline** | `completed before date = 100%, else 0%` | Project launch |
| **Zero** | `actual === 0 → 100%, else 0%` | Zero incidents |

Overall score = weighted average across all goals.

---

## 🗂️ Goal Setting Cycle

| Phase | Window |
|-------|--------|
| Goal Setting | May |
| Q1 Check-in | July |
| Q2 Check-in | October |
| Q3 Check-in | January |
| Q4 / Annual Review | March – April |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Neon / PostgreSQL |
| State Management | React Context + LocalStorage Persistence |
| Charts | Recharts |
| Deployment | Vercel |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Browser Clients               │
│   Employee │ Manager │ Admin/HR         │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Next.js (Vercel)                │
│  React UI │ API Routes │ Goal Context   │
│     Role-based Layouts                  │
└──────┬──────────────────────────┬───────┘
       │                          │
┌──────▼──────┐          ┌────────▼───────┐
│  Neon DB    │          │  LocalStorage  │
│  Postgres   │          │  Persistence   │
│  (SQL)      │          │  (Demo Mode)   │
└─────────────┘          └────────────────┘
```

---

## ⚙️ Local Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd atomquest

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Add your DATABASE_URL to .env.local

# 4. Run the development server
npm run dev
```

---

