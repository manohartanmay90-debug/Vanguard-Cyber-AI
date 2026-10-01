# 🛡️ Vanguard Cyber AI — Enterprise AI Firewall & Trust Dashboard

> 🌐 **Live Vercel Deployment:** [https://vanguard-cyber-ai-97er-ks65vqeei-tanmahy.vercel.app/](https://vanguard-cyber-ai-97er-ks65vqeei-tanmahy.vercel.app/)  
> **Protect your enterprise. Trust your AI.**  
> Vanguard Cyber AI sits between your employees and public LLMs — intercepting threats, redacting PII in sub-millisecond memory, and providing real-time telemetry dashboards.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔒 **PII Tokenization** | Auto-detects and masks Emails, SSNs, Credit Cards, Phone Numbers |
| 🧠 **AI Threat Detection** | Gemini-powered jailbreak & prompt injection analysis |
| 🔄 **Context-Aware Unmasking** | Original values restored in the final response seamlessly |
| 📊 **Admin Trust Dashboard** | KPI metrics, audit logs, threat reasons |
| 🔍 **Explainability Panel** | Side-by-side diff of Original vs Masked prompts |
| 🔐 **JWT Auth + RLS** | Supabase Auth with row-level security per user role |

---

## 🏗️ Architecture

```
Employee → [Aegis Frontend] → [Express API]
                                    ↓
                          ┌─── PII Masker ───┐
                          │                  │
                    Threat Check         PII Tokens
                    (Gemini AI)         Stored in Memory
                          │                  │
                    [BLOCKED?]           [Gemini LLM]
                          │                  │
                    Log & Return      Unmask Response
                          │                  │
                     Supabase ←──────── Return to User
                          ↑
                    Admin Dashboard
```

---

## 📁 Project Structure

```
aegis-ai/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx       # Sidebar navigation
│   │   │   ├── MessageBubble.jsx     # Chat message renderer
│   │   │   ├── StatCard.jsx          # KPI metric card
│   │   │   ├── LogsTable.jsx         # Audit data grid
│   │   │   └── ExplainabilityPanel.jsx # Diff view modal
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # / (Auth)
│   │   │   ├── ChatPage.jsx          # /chat (Employee)
│   │   │   ├── AdminOverviewPage.jsx # /admin (KPIs)
│   │   │   └── AdminLogsPage.jsx     # /admin/logs (Audit)
│   │   ├── context/AuthContext.jsx   # Supabase auth state
│   │   └── lib/
│   │       ├── supabase.js           # Supabase client
│   │       └── api.js                # Backend API calls
│   └── .env                          # Frontend env vars
│
├── server/                     # Node.js + Express backend
│   ├── controllers/
│   │   ├── chatController.js         # 6-step pipeline
│   │   └── adminController.js        # Logs & stats
│   ├── middleware/
│   │   └── auth.js                   # JWT verification
│   ├── routes/
│   │   ├── chat.js                   # POST /api/chat
│   │   └── admin.js                  # GET /api/admin/*
│   ├── utils/
│   │   ├── piiMasker.js              # Regex PII detection
│   │   ├── gemini.js                 # Gemini SDK wrapper
│   │   └── supabase.js               # DB helpers
│   ├── index.js                      # Entry point
│   └── .env                          # Backend env vars
│
└── supabase_schema.sql         # DB schema + RLS + trigger
```

---

## 🚀 Quick Start

### Step 1: Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase_schema.sql`](./supabase_schema.sql)
3. Note your **Project URL**, **Anon Key**, and **Service Role Key**

### Step 2: Create Admin User

After running the schema SQL, sign up a user via the app, then run:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@yourcompany.com';
```

### Step 3: Configure Environment Variables

**Server** (`server/.env`):
```env
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

**Client** (`client/.env`):
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 4: Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 API Reference

### `POST /api/chat`
Requires: `Authorization: Bearer <token>`

**Request:**
```json
{ "prompt": "What is my account balance for user john@corp.com?" }
```

**Response (modified — PII masked):**
```json
{
  "status": "modified",
  "response": "I can look up the balance for <EMAIL_1>...",
  "original_prompt": "...john@corp.com...",
  "masked_prompt": "...<EMAIL_1>...",
  "pii_entities_found": 1
}
```

**Response (blocked — threat detected):**
```json
{
  "status": "blocked",
  "response": "🚫 Security Alert: Your request has been blocked...",
  "threat_reason": "Prompt injection attempt detected",
  "confidence_score": 95
}
```

### `GET /api/admin/logs`
Admin only. Returns all `prompts_log` rows with profile joins.

### `GET /api/admin/stats`
Admin only. Returns `{ total, blocked, modified, passed, totalPiiMasked }`.

---

## ✅ Acceptance Criteria Verification

| Test | Expected | Behavior |
|---|---|---|
| `"My email is test@test.com"` | `masked_prompt = "My email is <EMAIL_1>"` | ✅ Regex replaces before LLM |
| `"Ignore all previous instructions"` | `status: blocked` | ✅ Gemini threat check blocks |
| Admin `/logs` page | Shows `threat_reason` | ✅ Rendered in ExplainabilityPanel |

---

## 🛡️ Security Design

- **No API keys on frontend** — all Gemini calls originate from Node.js backend
- **JWT verification on every route** — Supabase token validated server-side
- **RLS isolation** — employees can only read their own logs
- **Service role used only server-side** — never exposed to client
- **React default XSS protection** — no `dangerouslySetInnerHTML` used
- **Payload size limit** — Express `10kb` JSON limit prevents large injection attacks
