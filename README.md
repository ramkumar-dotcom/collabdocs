# CollabDocs

Google Docs–style collaborative documents app.

**Stack:** Next.js · Tailwind CSS · Node.js · MongoDB · Socket.IO · Yjs · TipTap

## Status

Project **setup and dependencies** are complete. Feature work (auth UI, document CRUD, live editor) is next.

## Prerequisites

- Node.js 20+
- MongoDB running locally, **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

## Setup

```bash
cd collabdocs
cp .env.example .env.local   # already created with local defaults
npm install                  # already done if you just cloned this scaffold
```

Edit `.env.local` if needed:

| Variable | Default | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/collabdocs` | Database |
| `JWT_SECRET` | (dev placeholder) | Auth tokens |
| `SOCKET_PORT` | `4000` | Collab server |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:4000` | Client socket URL |

## Scripts

```bash
npm run dev          # Next.js (3000) + Socket/Yjs server (4000)
npm run dev:web      # Next.js only
npm run dev:socket   # Collaboration server only
npm run build        # Production build
npm run start        # Start Next.js production server
npm run start:socket # Start collab server
npm run lint
npm run typecheck
```

## Project structure

```
collabdocs/
├── server/
│   └── index.ts              # Socket.IO + Yjs collab server
├── src/
│   ├── app/
│   │   ├── api/health/       # Health + Mongo connectivity check
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing / setup status
│   │   └── globals.css
│   ├── lib/
│   │   ├── db.ts             # Cached Mongoose connection
│   │   ├── auth.ts           # Password + JWT helpers
│   │   └── utils.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Document.ts
│   └── types/
│       └── index.ts
├── .env.example
├── .env.local
└── package.json
```

## Installed packages (highlights)

**App / data**

- `next`, `react`, `react-dom`
- `mongoose`
- `zod`
- `bcryptjs`, `jose`, `uuid`

**Realtime collaboration**

- `socket.io`, `socket.io-client`
- `yjs`, `y-protocols`, `y-socket.io`

**Editor**

- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/pm`
- `@tiptap/extension-collaboration`
- `@tiptap/extension-collaboration-caret`

**Tooling**

- `tailwindcss`, `typescript`, `eslint`
- `tsx`, `concurrently`

## Quick health check

With MongoDB running and `npm run dev`:

```bash
curl http://localhost:3000/api/health
curl http://localhost:4000
```

## Planned next steps

1. Auth API + simple login/register UI  
2. Document list and CRUD API  
3. TipTap editor wired to Yjs rooms  
4. Presence (cursors / collaborators)  
5. Persist Yjs state to MongoDB  

---

Built as a from-scratch scaffold for iterative feature work.
