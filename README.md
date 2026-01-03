# 🚕 TaxiGo - Complete Taxi Platform

A full-featured ride-hailing platform with Rider App, Driver App, Admin Dashboard, and Backend API.

## 🏗️ Project Structure

```
taxi-app/
├── apps/
│   ├── rider-app/          # React Native (Expo) - Customer app
│   ├── driver-app/         # React Native (Expo) - Driver app
│   └── admin-dashboard/    # Next.js 14 - Admin web dashboard
├── backend/                # NestJS API server
├── packages/
│   └── shared-types/       # Shared TypeScript types
├── plan/                   # Planning documents
└── docker-compose.yml      # PostgreSQL & Redis
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Databases

```bash
docker-compose up -d
```

### 3. Setup Environment

```bash
cp backend/.env.example backend/.env
```

### 4. Run Database Migrations

```bash
cd backend
pnpm prisma:generate
pnpm prisma:migrate
```

### 5. Start Development

```bash
# From root directory
pnpm dev
```

## 📱 Applications

### Backend API
- **Port**: 3000
- **Docs**: http://localhost:3000/api/docs
- **Tech**: NestJS, Prisma, PostgreSQL, Redis, Socket.io

### Rider App (Coming Soon)
- React Native + Expo
- iOS & Android

### Driver App (Coming Soon)
- React Native + Expo
- iOS & Android

### Admin Dashboard (Coming Soon)
- Next.js 14 + TailwindCSS + shadcn/ui

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native, Expo |
| Web | Next.js 14, TailwindCSS |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL, Prisma |
| Cache | Redis |
| Real-time | Socket.io |
| Maps | Google Maps API |
| Payments | Stripe / Razorpay |

## 📚 Documentation

See `/plan` folder for detailed documentation:
- System Architecture
- Feature Specifications
- Database Schema
- API Design
- Implementation Roadmap

## 🔐 Environment Variables

See `backend/.env.example` for required environment variables.

## 📄 License

Private - All rights reserved
