# SERVIQ — Enterprise Fleet Management Command Center & Driver Portal

**SERVIQ** is a multi-tenant commercial fleet management system built with **React 19 + Vite + Tailwind CSS**, **Node.js + Express.js**, **MongoDB + Mongoose**, **JWT + bcrypt authentication**, and **Socket.IO real-time alerts**. 

SERVIQ uses a **single unified codebase** powering both the desktop web portals (Organization Admin & Fleet Manager) and the mobile driver touch experience / standalone Android APK.

---

## 🏛 Hierarchy & Roles

```
                    SERVIQ
                       │
             Company Registration
                       │
                       ▼
               ORGANIZATION ADMIN
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       FLEET MANAGERS         DRIVERS
             │                   │
             │                   │
       Web Application       Driver APK
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                    VEHICLES
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Maintenance      Repairs       Expenses
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                 Fleet Records
```

### Role-Based Access Control (RBAC) Enforced in Backend:

| Feature | Organization Admin | Fleet Manager | Driver |
| :--- | :---: | :---: | :---: |
| **Company Registration** | ✅ (Creator) | — | — |
| **Company Details** | ✅ (Full) | View | — |
| **Manage Fleet Managers** | ✅ (Admin only) | ❌ | ❌ |
| **Add & Edit Drivers** | ✅ | ✅ | ❌ |
| **View Driver Profile** | ✅ | ✅ | Own Profile |
| **Add & Edit Vehicles** | ✅ | ✅ | Assigned View |
| **Assign Drivers to Vehicles**| ✅ | ✅ | ❌ |
| **Preventive Maintenance** | ✅ | ✅ | Assigned View |
| **Repairs & Issues** | ✅ | ✅ | Report & View |
| **Operating Expenses** | ✅ | ✅ | ❌ |
| **Compliance Documents** | ✅ | ✅ | Assigned View |
| **Vehicle Health & Odo** | ✅ | ✅ | Assigned View |
| **Report Breakdown / Issue** | ✅ | ✅ | ✅ (Touch UI) |
| **Fleet Reports & Analytics**| ✅ | ✅ | ❌ |
| **Real-time Live Sockets** | ✅ | ✅ | ✅ |

---

## 🚀 Quick Start Guide

### 1. MongoDB Configuration
Open `backend/.env` and paste your MongoDB Atlas Connection String (or local MongoDB URI):

```env
PORT=5000
NODE_ENV=development

# Paste your MongoDB Atlas URI:
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/serviq?retryWrites=true&w=majority

JWT_SECRET=serviq_super_secret_jwt_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 2. Run Both Backend & Frontend Simultaneously
From the project root:
```bash
npm run dev
```

- **Frontend (Web + Driver Portal)**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 📱 Driver Android APK Packaging

To package the Driver mobile experience as an Android APK:

1. Build the web distribution:
```bash
npm --prefix frontend run build
```

2. Sync with Capacitor Android:
```bash
npx --prefix frontend cap add android
npx --prefix frontend cap sync android
```

3. Open in Android Studio or compile debug APK with Gradle:
```bash
npx --prefix frontend cap open android
```

---

## 🚀 Deploying to Vercel

SERVIQ is configured for 1-click Vercel fullstack deployment (serving both the Vite React frontend and the Express REST API via Vercel Serverless Functions):

### Option A: Via GitHub (Recommended)
1. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure SERVIQ for Vercel deployment"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your **`thiruppugazhs/serviq`** repository.
4. Set the **Environment Variables** in the Vercel dashboard:
   - `MONGODB_URI`: `mongodb+srv://thiruppugazhs_db_user:YABnSp9VZRbOtqMI@cluster0.0tc2ykm.mongodb.net/serviq?retryWrites=true&w=majority`
   - `JWT_SECRET`: `serviq_super_secret_jwt_key_2026_xyz`
   - `JWT_EXPIRE`: `30d`
   - `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will build the frontend and deploy the serverless API.

### Option B: Via Vercel CLI
1. Log in to Vercel in your terminal:
   ```bash
   npx vercel login
   ```
2. Deploy to production:
   ```bash
   npx vercel --prod
   ```
3. When prompted, add your environment variables (`MONGODB_URI`, `JWT_SECRET`).

---

## 🔒 Zero Demo Data Policy
SERVIQ initializes with **zero mock or dummy data**. All tables, collections, counters, and metrics reflect real database entities with clean onboarding empty states.

