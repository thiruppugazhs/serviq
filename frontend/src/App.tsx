import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Common
import { Sidebar } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { GearLoader } from './components/common/GearLoader';

// Auth
import { CompanyRegistration } from './components/auth/CompanyRegistration';
import { Login } from './components/auth/Login';

// Admin
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FleetManagersView } from './components/admin/FleetManagersView';
import { CompanySettings } from './components/admin/CompanySettings';
import { ProfileView } from './components/profile/ProfileView';

// Fleet Manager
import { FleetManagerDashboard } from './components/fleetManager/FleetManagerDashboard';

// Shared Fleet Operations (Admin / Manager)
import { DriversView } from './components/drivers/DriversView';
import { DriverProfileView } from './components/drivers/DriverProfileView';
import { VehiclesView } from './components/vehicles/VehiclesView';
import { MaintenanceView as AdminMaintenanceView } from './components/maintenance/MaintenanceView';
import { RepairsView } from './components/repairs/RepairsView';
import { ExpensesView as AdminExpensesView } from './components/expenses/ExpensesView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ReportsView } from './components/reports/ReportsView';

// Driver Website Experience
import { DriverLayout } from './components/driver/DriverLayout';
import { DriverHomeView } from './components/driver/DriverHomeView';
import { NotificationsView } from './components/driver/NotificationsView';
import { UpdateOdometerView } from './components/driver/UpdateOdometerView';
import { MaintenanceView } from './components/driver/MaintenanceView';
import { RequestMaintenanceView } from './components/driver/RequestMaintenanceView';
import { ServicesView } from './components/driver/ServicesView';
import { RequestServiceView } from './components/driver/RequestServiceView';
import { ExpensesView } from './components/driver/ExpensesView';
import { ExpenseItemDetailView } from './components/driver/ExpenseItemDetailView';
import { AddExpenseView } from './components/driver/AddExpenseView';
import { SettingsView } from './components/driver/SettingsView';
import { EditDriverDetailsView } from './components/driver/EditDriverDetailsView';
import { EditProfilePhotoView } from './components/driver/EditProfilePhotoView';
import { TeamChangeView } from './components/driver/TeamChangeView';

// Public Website Content
import { LandingPage } from './components/landing/LandingPage';
import { LegalPage } from './components/legal/LegalPage';
import { DownloadAppPage } from './components/download/DownloadAppPage';
import { PricingPage } from './components/pricing/PricingPage';

const DashboardLayoutContent: React.FC = () => {
  const { isCollapsed } = useDashboard();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Anek_Latin',sans-serif]">
      {/* Fixed Top Header */}
      <TopHeader />

      <div className="flex pt-16 min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main
          className={`flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 w-full overflow-y-auto ${
            isCollapsed ? 'lg:ml-16' : 'lg:ml-60'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardLayoutContent />
    </DashboardProvider>
  );
};

export const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <GearLoader
        fullScreen
        theme="dark"
        color="text-emerald-500"
        text="Connecting to SERVIQ..."
      />
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
            {/* Public Website Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Dedicated Pricing Page */}
            <Route path="/pricing" element={<PricingPage />} />

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

            {/* Public Unified Auth Routes (Admin, Fleet Manager, and Driver) */}
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
                <Route path="tracking" element={<Navigate to="../vehicles" replace />} />
                <Route path="map" element={<Navigate to="../vehicles" replace />} />
                <Route path="maintenance" element={<AdminMaintenanceView />} />
                <Route path="repairs" element={<RepairsView />} />
                <Route path="expenses" element={<AdminExpensesView />} />
                <Route path="documents" element={<DocumentsView />} />
                <Route path="reports" element={<ReportsView />} />
                <Route path="settings" element={<CompanySettings />} />
                <Route path="profile" element={<ProfileView />} />
              </Route>
            </Route>

            {/* Fleet Manager Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['fleet_manager']} />}>
              <Route path="/manager" element={<DashboardLayout />}>
                <Route path="dashboard" element={<FleetManagerDashboard />} />
                <Route path="drivers" element={<DriversView />} />
                <Route path="drivers/:id" element={<DriverProfileView />} />
                <Route path="vehicles" element={<VehiclesView />} />
                <Route path="tracking" element={<Navigate to="../vehicles" replace />} />
                <Route path="map" element={<Navigate to="../vehicles" replace />} />
                <Route path="maintenance" element={<AdminMaintenanceView />} />
                <Route path="repairs" element={<RepairsView />} />
                <Route path="expenses" element={<AdminExpensesView />} />
                <Route path="documents" element={<DocumentsView />} />
                <Route path="reports" element={<ReportsView />} />
                <Route path="profile" element={<ProfileView />} />
              </Route>
            </Route>

            {/* Driver Protected Routes (Accessible through Website) */}
            <Route element={<ProtectedRoute allowedRoles={['driver', 'admin', 'fleet_manager']} />}>
              <Route element={<DriverLayout />}>
                <Route path="/driver/home" element={<DriverHomeView />} />
                <Route path="/home" element={<Navigate to="/driver/home" replace />} />
                <Route path="/notifications" element={<NotificationsView />} />
                <Route path="/odometer/update" element={<UpdateOdometerView />} />
                <Route path="/maintenance" element={<MaintenanceView />} />
                <Route path="/maintenance/request" element={<RequestMaintenanceView />} />
                <Route path="/service" element={<ServicesView />} />
                <Route path="/service/request" element={<RequestServiceView />} />
                <Route path="/expense" element={<ExpensesView />} />
                <Route path="/expense/item/:id" element={<ExpenseItemDetailView />} />
                <Route path="/expense/add/:id" element={<AddExpenseView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/settings/driver" element={<EditDriverDetailsView />} />
                <Route path="/settings/profile" element={<EditProfilePhotoView />} />
                <Route path="/settings/team" element={<TeamChangeView />} />
              </Route>
            </Route>

            {/* Catch-all: Redirects to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
