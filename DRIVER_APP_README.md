# SERVIQ Driver Fleet Management Web App + Capacitor Native Android App

A complete, mobile-first Driver Fleet Management application built in strict adherence to the provided UI reference designs, running seamlessly as a responsive web application and as an installed native Android application via Capacitor.

---

## 📱 1. Application Architecture & Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom SERVIQ light-blue & white theme (`#1b72e8` primary, `#f8fafc` background)
- **Mobile Container**: Native Android Capacitor 6 integration (`@capacitor/android`, `@capacitor/core`, `@capacitor/cli`, `@capacitor/camera`, `@capacitor/status-bar`, `@capacitor/app`)
- **Iconography**: Lucide React
- **Data & State Management**: Clean `driverService` repository with persistent local storage, type safety, and fallback development adapter for offline or remote usage.

---

## 🎨 2. Strict Design Rules Followed

1. **Exact Visual Match**: 
   - Light-blue and white visual hierarchy with dark navy headings (`text-slate-900`) and blue primary buttons (`#1b72e8`).
   - Cards with subtle rounded corners (`rounded-2xl`), delicate borders, and soft shadows matching reference mockups.
2. **Prohibited Elements Removed**:
   - ❌ No left sidebar
   - ❌ No Quick Access section on Home
   - ❌ No AI-related labels, tags, badges, chatbots, or indicators
   - ❌ No public marketing landing pages or role selectors
3. **Driver-Only Entry Flow**:
   - The application launches directly into `/login` with the local `login-bg.jpg` (Image 4 from user assets).
   - On successful sign-in, the driver navigates straight to `/home`.
   - On app relaunch, existing authenticated sessions automatically resume at `/home`.
   - On logout, sessions are destroyed and redirected to `/login`.

---

## 🧭 3. Navigation & Route Hierarchy

| Route | Screen Name | Description |
| :--- | :--- | :--- |
| `/login` | **Driver Sign In** | Fullscreen 3D graphic background (`login-bg.jpg`), email/phone and password inputs, 1-tap demo sign-in |
| `/home` | **Driver Home** | Dynamic time-based greeting, collapsible profile dropdown, current odometer card, summary cards, current maintenance list |
| `/notifications` | **Notifications** | List of driver notifications with colored status icons (maintenance, service, expense, reminders, team) |
| `/odometer/update` | **Update Odometer** | Current reading card, numeric validation (cannot decrease), save button |
| `/maintenance` | **Maintenance** | Filter pills (`Current` / `Previous`), Request Maintenance button, item cards with status badges |
| `/maintenance/request` | **Request Maintenance** | Type of maintenance dropdown, description textarea, priority selector, camera/gallery/document proof upload |
| `/service` | **Services** | Tabs (`Current Services` / `Previous Services`), Add Service button, service history list |
| `/service/request` | **Request Service** | Service reason dropdown, details textarea, 3 proof upload action tiles (Take Photo, Upload Document, Gallery) |
| `/expense` | **Expenses** | Dynamic total expenses card, filter chips (`All`, `Repairs`, `Services`, `Maintenance`), expense list |
| `/expense/item/:id` | **Expense Details & Logs** | Item header card, `Expense Logs` & `Details` tabs, log items, `Add Expense` button |
| `/expense/add/:id` | **Add Expense Form** | Date picker, amount with `$` prefix, description, live calculated total box, save action |
| `/settings` | **Settings** | Organization card (`ABC Transport Co.`), driver details, name & photo, fleet manager contact, admin details, team change, logout |
| `/settings/driver` | **Edit Driver Details** | Editable name, phone, license number, expiry. **Email is strictly READ-ONLY** with lock indicator |
| `/settings/profile` | **Name & Profile Photo** | Upload new profile photo via camera/file picker, change display name |
| `/settings/team` | **Team Change** | Current team display, target team selector, reason textarea, submission workflow |

### Fixed 5-Item Mobile Bottom Navigation:
1. **Home** (`/home`)
2. **Service** (`/service`)
3. **Maintenance** (`/maintenance`)
4. **Expense** (`/expense`)
5. **Settings** (`/settings`)

---

## 🚀 4. How to Run the Web Application

### Development Server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). The app will open directly to `/login`.

### Production Build:
```bash
cd frontend
npm run build
```
Generates a minified, type-checked production bundle in `frontend/dist/`.

---

## 🤖 5. Capacitor Native Android Integration

The project has been configured with Capacitor 6 for Android:
- **App ID**: `com.serviq.driver`
- **App Name**: `Serviq Driver`
- **Native Project Folder**: `frontend/android`

### Commands to Build & Sync Native Android Assets:

1. **Build web bundle**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Sync web build to native Android project**:
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Build APK via Gradle Command Line**:
   ```bash
   cd frontend/android
   ./gradlew assembleDebug
   ```
   *(Or on Windows: `gradlew.bat assembleDebug`)*

   The generated APK will be placed at:
   `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📋 6. Demo & Test Credentials

For quick verification and offline testing:
- **Email**: `driver@serviq.com`
- **Password**: `driver123`
- *Alternatively*: Tap the **"Quick Test: Sign in as John Smith (Driver)"** button on the Login screen to log in with 1 tap.

---

## ⚙️ 7. External Prerequisites for Native Development
1. **Node.js**: v18+ or v20+
2. **JDK**: Java Development Kit 17+ (configured as `JAVA_HOME`)
3. **Android Studio**: With Android SDK Platforms (API 34) and Build Tools installed
4. **Android Device / Emulator**: USB debugging enabled or an active AVD
