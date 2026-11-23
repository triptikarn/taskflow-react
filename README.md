# TaskFlow — React Edition

A React frontend for **TaskFlow**, the full-stack task manager. This app is the React + Vite edition of the original vanilla-JavaScript frontend: it talks to the same Express + MongoDB REST API, with JWT authentication and a three-column task board (To do → In progress → Done).

> Backend: the original [`taskflow`](https://github.com/triptikarn/taskflow) repository (Express + MongoDB + JWT). This repo contains only the React frontend.

## Features

- **User accounts** — register & login against the TaskFlow API; the JWT is stored in `localStorage` and sent as `Authorization: Bearer <token>`
- **Protected routes** — the board is only reachable when logged in (React Router route guard)
- **Task board** — tasks grouped into To do / In progress / Done columns, with one-click moves between columns
- **Full task CRUD** — create and edit tasks with priority (low / medium / high) and due dates, delete with confirmation
- **Priority filter** — narrow the board by priority using the API's `?priority=` filter
- **Overdue highlighting** — past-due open tasks are flagged in red

## Tech stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, React Router |
| Backend  | Node.js, Express (separate repo) |
| Database | MongoDB with Mongoose (via the backend) |
| Auth     | JSON Web Tokens (JWT) |

## Getting started

You need the backend running first:

```bash
# 1) Backend (from the original taskflow repo)
git clone https://github.com/triptikarn/taskflow.git
cd taskflow
npm install
cp .env.example .env   # fill in MONGO_URI and a strong JWT_SECRET
npm run dev            # API on http://localhost:5000

# 2) This frontend (in a second terminal)
git clone https://github.com/triptikarn/taskflow-react.git
cd taskflow-react
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev            # app on http://localhost:5173
```

## Scripts

```bash
npm run dev      # start the Vite dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
npm test         # Vitest unit/component tests
```

## Project structure

```
taskflow-react/
├── src/
│   ├── api/client.js         # fetch wrapper: base URL, JWT header, error handling
│   ├── context/AuthContext   # user session (login / register / logout)
│   ├── components/           # Navbar, ProtectedRoute, TaskCard, TaskForm
│   ├── pages/                # Login, Register, Dashboard (the board)
│   └── utils/format.js       # date helpers + status/priority constants
├── .env.example              # VITE_API_URL for the backend
└── vite.config.js
```

## Screenshots

<!-- TODO: add screenshots of the login page and the task board here. -->
_Screenshots coming soon._

## License

MIT © Tripti Karn
