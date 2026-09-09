# LogiPulse

> Predictive logistics operations platform — hackathon MVP

## Quick Start

### Backend

```bash
cd backend
npm install
cp ../.env.example .env   # Fill in your MongoDB URI + JWT secret
npm run seed              # Seed demo data
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 and login with:
- Email: `manager@logipulse.demo`
- Password: `LogiPulse2026!`

## Stack

- **Frontend:** React + TypeScript + Tailwind CSS (CRA)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcryptjs
- **Charts:** Recharts

## API

```
POST   /api/auth/login
GET    /api/health
GET    /api/dashboard
GET    /api/operations
GET    /api/forecast
GET    /api/capacity
GET    /api/bottlenecks
GET    /api/recommendations
PATCH  /api/recommendations/:id
```
