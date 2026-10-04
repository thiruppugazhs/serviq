# SERVIQ Driver Mobile Application

Official React Native mobile application for SERVIQ fleet drivers, connected to the central SERVIQ MERN stack backend.

---

## 📱 Features

1. **Driver Authentication**
   - Professional login supporting Email or Phone number + Password.
   - Secure JWT storage with session persistence via `@react-native-async-storage/async-storage`.
   - Strict backend verification: User identity, Organization isolation, and `DRIVER` role verification.
   - Automatic logout and token expiry handling.
   - Built-in API server configurator for testing on local emulators (`http://10.0.2.2:5000`) and physical devices (`http://<LAN-IP>:5000`).

2. **Mobile-First Driver Dashboard**
   - Dynamic greeting and driver profile banner.
   - **Assigned Vehicle Hero Card**: License plate, manufacturer, model, fuel type, and real-time status badge (`Active`, `In Shop`, etc.).
   - **2x2 Telemetry Grid**:
     - Current Odometer reading
     - Vehicle Health status (`Good`, `Attention Needed`, `Needs Critical Service`)
     - Next Preventive Service date and type
     - Active Breakdown / Repair ticket status
   - **Quick Actions**: One-touch `[ Report Issue ]` and `[ Update Odometer ]`.
   - Upcoming maintenance preview card and recent notifications ticker.
   - Pull-to-refresh telemetry synchronization.

3. **My Vehicle (`VehicleScreen`)**
   - Comprehensive vehicle specifications: Registration number, vehicle type, manufacturer, model, manufacturing year, fuel type, current odometer, status, RC number, VIN, and assigned date.
   - Hub navigation shortcuts: Vehicle Health, Odometer, Maintenance, Service History, Documents, and Repairs.
   - Enforces read-only permissions (drivers cannot edit core fleet assets).

4. **Vehicle Health Diagnostics (`VehicleHealthScreen`)**
   - Real-time subsystem health status computed directly from backend repair records, maintenance schedules, and document compliance:
     - Engine (✓ Normal / Attention)
     - Brakes (✓ Normal / Attention)
     - Tyres (✓ Normal / Attention)
     - Battery / Electrical (✓ Normal / Attention)
     - Suspension & Transmission (✓ Normal)
     - AC (✓ Normal)
     - Service (✓ Up to Date / Overdue)
     - Compliance Documents (✓ Valid / Expiring)
   - Diagnostic status banner and warning highlights.

5. **Odometer Tracking (`OdometerScreen`)**
   - Hero display of current verified odometer reading.
   - Update Odometer form with strict validation: numeric verification and prevention of lower/invalid readings.
   - Real-time synchronization with backend vehicle telemetry and preventive maintenance triggers.
   - Chronological odometer reading history logs.

6. **Preventive Maintenance (`MaintenanceScreen`)**
   - Upcoming scheduled maintenance items with due dates, due odometer targets, service centers, and statuses (`UPCOMING`, `DUE`, `IN_PROGRESS`, `COMPLETED`, `OVERDUE`).
   - Recently completed maintenance history.
   - View-only driver access.

7. **Service History (`ServiceHistoryScreen`)**
   - Unified chronological work log combining completed preventive maintenance and completed repair tickets.
   - Displays service date, odometer at service, servicing center / workshop, cost, and technician notes.

8. **Report Vehicle Issue (`ReportIssueScreen`)**
   - Core driver breakdown ticket creation.
   - Automatically selects the driver's assigned vehicle.
   - Category picker: `Engine`, `Brakes`, `Tyres`, `Electrical`, `Battery`, `AC`, `Lights`, `Suspension`, `Transmission`, `Other`.
   - Priority / Severity selector: `Low`, `Medium`, `High`, `Critical`.
   - Camera and gallery photo attachments with preview and removal (`react-native-image-picker`).
   - Multi-photo upload support via multipart `FormData`.
   - Automatically notifies Fleet Command in real time.

9. **Repair Tracking (`RepairDetailScreen`)**
   - Step-by-step visual progress timeline:
     - `✓ Reported`
     - `✓ Reviewed`
     - `✓ Approved`
     - `● In Progress`
     - `○ Completed`
   - Detailed workshop telemetry, incident odometer, estimated repair cost, and attached inspection photos.

10. **Compliance Documents (`DocumentsScreen`)**
    - View transport compliance documents: Registration Certificate (RC), Insurance, Pollution (PUC), Road Fitness, Commercial Permit, and Driving Licence.
    - Status pills: `VALID`, `EXPIRING SOON`, `EXPIRED`.
    - Read-only driver access.

11. **Real-time Notifications (`NotificationsScreen`)**
    - WebSocket integration via `socket.io-client` connected to the SERVIQ Socket.IO backend (`org_<organizationId>` room).
    - Real-time updates for newly reported issues, repair status changes, odometer updates, and dispatch alerts.
    - Read/unread indicators, mark as read, and mark all as read.

12. **Driver Profile (`ProfileScreen`)**
    - Displays driver photo, full name, driver ID (`DRV-1001`), email, phone, residential address, driving licence number, licence expiry, and employment status.
    - Secure editing of permitted driver fields: phone number, address, and emergency contact details.
    - Profile picture upload support.
    - Secure Logout with state clearing.

---

## 🏗️ Architecture & Project Structure

```
serviq-driver/
├── src/
│   ├── components/
│   │   ├── Button.js               # Accessible primary, secondary, outline, danger buttons
│   │   ├── Card.js                 # Mobile card container
│   │   ├── EmptyState.js           # Empty list placeholder
│   │   ├── ErrorView.js            # Network and API error retry screen
│   │   ├── Header.js               # App header with back button & notification bell
│   │   ├── Input.js                # Form input with password toggle & validation
│   │   ├── LoadingScreen.js        # Centered loading spinner
│   │   ├── StatusBadge.js          # Status badge pill component
│   │   └── TabBarIcon.js           # Bottom tab bar icons with badge counters
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.js      # Driver login with server URL configurator
│   │   ├── home/
│   │   │   └── DashboardScreen.js  # Mobile driver home screen
│   │   ├── vehicle/
│   │   │   ├── VehicleScreen.js    # My Vehicle detailed specs & shortcuts
│   │   │   ├── VehicleHealthScreen.js # Subsystem diagnostics
│   │   │   ├── MaintenanceScreen.js # Maintenance schedules
│   │   │   ├── ServiceHistoryScreen.js # Completed service records
│   │   │   ├── OdometerScreen.js   # Odometer update & history logs
│   │   │   └── DocumentsScreen.js  # Compliance documents
│   │   ├── issues/
│   │   │   ├── IssuesScreen.js     # Reported breakdown history
│   │   │   └── ReportIssueScreen.js # Issue reporting with camera/gallery
│   │   ├── repairs/
│   │   │   └── RepairDetailScreen.js # Visual timeline tracking
│   │   ├── notifications/
│   │   │   └── NotificationsScreen.js # Real-time notification feed
│   │   └── profile/
│   │       └── ProfileScreen.js    # Driver profile & emergency contact
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js         # Root stack navigator with auth gating
│   │   └── BottomTabNavigator.js   # 5-tab bottom navigation
│   │
│   ├── services/
│   │   ├── api.js                  # Centralized REST API client
│   │   ├── authStorage.js          # AsyncStorage persistence wrapper
│   │   └── socketService.js        # Socket.IO client
│   │
│   ├── context/
│   │   ├── AuthContext.js          # Authentication lifecycle & session context
│   │   └── NotificationContext.js  # Real-time notification & Socket.IO context
│   │
│   ├── constants/
│   │   ├── colors.js               # SERVIQ Mobile Light Design System colors
│   │   └── config.js               # Default API URLs and storage keys
│   │
│   └── utils/
│       └── helpers.js              # Date, km, currency, and status formatters
│
├── android/                        # Android native project (Gradle 9.2, Java 21)
├── App.tsx                         # App entry with SafeArea and Context Providers
├── index.js                        # AppRegistry registration
├── package.json                    # Dependencies & scripts
└── README.md
```

---

## 🔌 Backend Integration Mapping

The application connects to the central SERVIQ MERN backend via `src/services/api.js`:

| Endpoint | Method | Driver App Usage |
|---|---|---|
| `/api/auth/login` | `POST` | Driver authentication (email/phone + password) |
| `/api/auth/me` | `GET` | Session restoration and verification |
| `/api/driver/profile` | `GET`, `PATCH` | Driver profile details & emergency contact update |
| `/api/driver/vehicle` | `GET` | Assigned vehicle specifications & summary metrics |
| `/api/driver/vehicle/health` | `GET` | Subsystem diagnostics & overall health rating |
| `/api/driver/vehicle/maintenance` | `GET` | Upcoming & overdue maintenance schedules |
| `/api/driver/vehicle/service-history` | `GET` | Completed maintenance & repair history |
| `/api/driver/vehicle/documents` | `GET` | Vehicle certificates, permits & licence status |
| `/api/driver/odometer` | `GET`, `POST` | Current odometer, log history & odometer updates |
| `/api/driver/issues` | `GET`, `POST` | Issue ticket list and breakdown reporting with photos |
| `/api/driver/repairs` | `GET` | Active & historical repair list |
| `/api/driver/repairs/:id` | `GET` | Single repair details and multi-step progress timeline |
| `/api/driver/notifications` | `GET` | Driver notification list |
| `/api/driver/notifications/:id/read` | `PATCH` | Mark single notification as read |
| `/api/driver/notifications/read-all` | `PATCH` | Mark all notifications as read |

---

## 🧪 Testing Credentials

A dedicated driver account with realistic telemetry, vehicle assignment, maintenance schedules, repairs, documents, and notifications is pre-seeded in the database:

- **Email**: `driver@serviq.com`
- **Phone**: `+91 98765 43210`
- **Password**: `password123`
- **Assigned Vehicle**: `TN 01 AB 1234` (Ashok Leyland XYZ Hauler)

To re-seed test data at any time from the backend directory:
```bash
node backend/src/utils/seedDriverData.js
```

---

## 🚀 Running the App

### 1. Ensure Backend is Running
```bash
cd backend
npm start
```
The backend server runs on `http://localhost:5000` with MongoDB and Socket.IO.

### 2. Run the Driver Mobile Application
```bash
cd serviq-driver
npm start
```

### 3. Run on Android Emulator or Device
```bash
cd serviq-driver
npx react-native run-android
```
Or build the debug APK directly:
```bash
cd serviq-driver/android
./gradlew assembleDebug
```
The generated APK will be located at:
`serviq-driver/android/app/build/outputs/apk/debug/app-debug.apk`.
