# AdvocateFinder — Find Legal Help

A conceptual prototype web app to help users discover advocates, classify their case type with AI, book consultations, and let advocates manage incoming requests.

> ⚠️ This project is a learning/prototype app. It does NOT provide legal advice.

---

## ✨ Features

- 🔎 Browse & search advocates by specialization, city, language
- 🤖 AI-powered features (via Lovable AI Gateway):
  - Case-type classification (category + suggested specialization)
  - Smart search ranking of advocates
  - Advocate profile summarization
- 🔐 Email/password authentication (Lovable Cloud / Supabase)
- 📅 Consultation booking system (book, view, cancel)
- 🧑‍⚖️ Advocate dashboard (confirm / reject / view requests)
- 🧾 Advocate registration flow
- 🎨 Modern UI with Tailwind CSS + shadcn/ui

---

## 🧰 Tech Stack

- **Frontend:** React 18 + Vite 5 + TypeScript
- **Styling:** Tailwind CSS v3 + shadcn/ui + Radix UI
- **Routing:** React Router v6
- **Data:** TanStack Query
- **Backend:** Supabase — Auth, Postgres, Edge Functions
- **AI:** AI Gateway (Groq)

---

## 📦 Prerequisites

Install these on your PC before running:

1. **Node.js 18+** — https://nodejs.org (LTS recommended)
   - Verify: `node -v` and `npm -v`
2. **Git** (optional) — https://git-scm.com
3. **VS Code** — https://code.visualstudio.com
4. Recommended VS Code extensions:
   - ESLint
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets

---

## 🚀 Run It in VS Code — Step by Step

### 1. Extract the ZIP
Unzip `advocate-finder.zip` to a folder, e.g. `C:\Projects\advocate-finder`.

### 2. Open in VS Code
- Open VS Code → **File → Open Folder…** → select the unzipped folder.

### 3. Open the integrated terminal
- Press `` Ctrl + ` `` (backtick) or **Terminal → New Terminal**.

### 4. Install dependencies
```bash
npm install
```
(or `bun install` if you use Bun)

### 5. Configure environment variables
A `.env` file is already included with the public Supabase Cloud keys:
```env
VITE_SUPABASE_PROJECT_ID="hzzgnyucgtpvrdzljela"
VITE_SUPABASE_PUBLISHABLE_KEY="<public anon key>"
VITE_SUPABASE_URL="https://hzzgnyucgtpvrdzljela.supabase.co"
```
These are publishable keys — safe to keep in the project. Don't change them unless you connect your own Supabase project.

### 6. Start the dev server
```bash
npm run dev
```
You will see something like:
```
➜  Local:   http://localhost:8080/
```
Open that URL in your browser.

### 7. Build for production (optional)
```bash
npm run build
npm run preview
```

---

## 📜 NPM Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server on `http://localhost:8080` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the codebase |

---

## 🗂 Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images
│   ├── components/         # UI + feature components
│   │   ├── ui/             # shadcn/ui primitives
│   │   ├── AdvocateCard.tsx
│   │   ├── AdvocateProfile.tsx
│   │   ├── BookingDialog.tsx
│   │   ├── CaseClassifier.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── data/               # Static seed data
│   ├── hooks/              # React hooks (auth, AI, etc.)
│   ├── integrations/
│   │   └── supabase/       # Auto-generated client + types
│   ├── pages/              # Route pages
│   │   ├── Index.tsx
│   │   ├── Advocates.tsx
│   │   ├── Auth.tsx
│   │   ├── RegisterAdvocate.tsx
│   │   ├── MyConsultations.tsx
│   │   ├── AdvocateDashboard.tsx
│   │   └── About.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── classify-case/
│   │   ├── rank-advocates/
│   │   └── summarize-advocate/
│   └── migrations/         # SQL migrations
├── .env
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 🛣 Routes

| Path | Page |
|---|---|
| `/` | Home (search + AI case classifier) |
| `/advocates` | All advocates listing |
| `/about` | About page |
| `/auth` | Sign in / Sign up |
| `/register-advocate` | Advocate registration |
| `/my-consultations` | User's bookings |
| `/advocate-dashboard` | Advocate's incoming requests |

---

## 🤖 AI Usage Policy (Important)

AI in this app is restricted to:
1. **Case-type classification** — categorizes a short user description into a legal category & suggested specialization.
2. **Smart search ranking** — improves relevance of advocate results.
3. **Profile summarization** — generates a clean, readable advocate summary.

AI **does NOT**:
- Give legal advice or opinions
- Answer legal questions
- Replace advocates
- Act as a chatbot lawyer

---

## 🧪 Troubleshooting

- **Port 8080 already in use** → stop the other process or change the port in `vite.config.ts`.
- **`npm install` fails** → delete `node_modules` and `package-lock.json`, then run `npm install` again.
- **Blank page / auth errors** → make sure the `.env` file exists at the project root and the dev server was restarted after edits.

---

## 📄 License

For learning / prototype use only.
