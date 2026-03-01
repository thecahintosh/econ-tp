# 🌐 ECON Transparency Portal

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"Where Ideas Don't Disappear"**

A fully transparent proposal tracking and event management system for student organizations. Track every idea from submission to completion with full accountability and public visibility.

![ECON Portal Demo](https://via.placeholder.com/800x400?text=ECON+Transparency+Portal)

---

## 🚀 Features

### 📋 For Everyone (Public Access)
- **Live Proposal Board** — Kanban-style view across 5 stages (Under Review → Approved → In Execution → Completed → Dropped)
- **Full Decision History** — Every action logged with who, what, and when
- **Event Impact Reports** — Attendance, budget, ratings, and learnings after every event
- **Transparency Dashboard** — Real-time metrics on approval rates, execution success, and contributions
- **Institutional Memory** — Past events archived with insights for future organizers

### ✍️ For Members (Authenticated)
- **Submit Proposals** — Create ideas with budget and timeline
- **Track Your Submissions** — Real-time status updates
- **Public Accountability** — See who's responsible and what decisions were made

### ⚙️ For EB/Core Team (Admin Access)
- **Manage Proposals** — Approve, reject, or drop with decision notes
- **Assign Leads** — Designate responsible team members
- **Set Milestones** — Break proposals into trackable tasks
- **Create Event Reports** — Document outcomes, budget utilization, and learnings
- **User Approvals** — Control who gets EB/Core access

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) / SQLite (dev) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/thecahintosh/econ-tp.git
cd econ-tp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Initialize database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
