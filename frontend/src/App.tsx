import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Common
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Auth
import { CompanyRegistration } from './components/auth/CompanyRegistration';
import { Login } from './components/auth/Login';

// Admin
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FleetManagersView } from './components/admin/FleetManagersView';
import { CompanySettings } from './components/admin/CompanySettings';

// Fleet Manager
import { FleetManagerDashboard } from './components/fleetManager/FleetManagerDashboard';

// Shared Fleet Operations
import { DriversView } from './components/drivers/DriversView';
import { DriverProfileView } from './components/drivers/DriverProfileView';
import { VehiclesView } from './components/vehicles/VehiclesView';
import { MaintenanceView } from './components/maintenance/MaintenanceView';
import { RepairsView } from './components/repairs/RepairsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';

// Driver Mobile Experience
import { DriverHome } from './components/driverApp/DriverHome';

// Landing Page & Public Content
import { LandingPage } from './components/landing/LandingPage';
import { LegalPage } from './components/legal/LegalPage';
import { DownloadAppPage } from './components/download/DownloadAppPage';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm mt-4">Connecting to SERVIQ...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'fleet_manager') return <Navigate to="/manager/dashboard" replace />;
  if (user.role === 'driver') return <Navigate to="/driver/home" replace />;

  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Dedicated Download App Page */}
            <Route path="/download" element={<DownloadAppPage />} />
            <Route path="/download-app" element={<DownloadAppPage />} />

            {/* Legal & Compliance Dedicated Pages */}
            <Route path="/terms-of-use" element={<LegalPage policyKey="terms-of-use" />} />
            <Route path="/privacy-policy" element={<LegalPage policyKey="privacy-policy" />} />
            <Route path="/grievance-policy" element={<LegalPage policyKey="grievance-policy" />} />
            <Route path="/merchant-terms" element={<LegalPage policyKey="merchant-terms" />} />
            <Route path="/data-protection-standards" element={<LegalPage policyKey="data-protection-standards" />} />
            <Route path="/legal/:slug" element={<LegalPage />} />

            {/* Public Auth Routes */}
            <Route path="/register" element={<CompanyRegistration />} />
            <Route path="/login" element={<Login />} />

            {/* Organization Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="fleet-managers" element={<FleetManagersView />} />
                <Route path="drivers" element={<DriversView />} />
                <Route path="drivers/:id" element={<DriverProfileView />} />
                <Route path="vehicles" element={<VehiclesView />} />
                <Route path="maintenance" element={<MaintenanceView />} />
                <Route path="repairs" element={<RepairsView />} />
                <Route path="expenses" element={<ExpensesView />} />
                <Route path="documents" element={<DocumentsView />} />
                <Route path="reports" element={<ReportsView />} />
                <Route path="settings" element={<CompanySettings />} />
              </Route>
            </Route>

            {/* Fleet Manager Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['fleet_manager']} />}>
              <Route path="/manager" element={<DashboardLayout />}>
                <Route path="dashboard" element={<FleetManagerDashboard />} />
                <Route path="drivers" element={<DriversView />} />
                <Route path="drivers/:id" element={<DriverProfileView />} />
                <Route path="vehicles" element={<VehiclesView />} />
                <Route path="maintenance" element={<MaintenanceView />} />
                <Route path="repairs" element={<RepairsView />} />
                <Route path="expenses" element={<ExpensesView />} />
                <Route path="documents" element={<DocumentsView />} />
                <Route path="reports" element={<ReportsView />} />
              </Route>
            </Route>

            {/* Driver Mobile / APK Protected Route */}
            <Route element={<ProtectedRoute allowedRoles={['driver', 'admin', 'fleet_manager']} />}>
              <Route path="/driver/home" element={<DriverHome />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
