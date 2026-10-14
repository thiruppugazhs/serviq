// Driver Service and Data Layer
// Supports typed access, persistent local state, and API synchronization

export interface DriverProfile {
  id: string;
  name: string;
  role: string;
  driverId: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  email: string; // Strictly read-only
  team: string;
  photoUrl: string;
  assignedVehicle: {
    plateNumber: string;
    make: string;
    model: string;
    year: number;
    odometer: number;
  };
}

export interface MaintenanceItem {
  id: string;
  title: string;
  type: string;
  dueKmText: string;
  dueDate: string;
  status: 'In Progress' | 'Pending' | 'Completed' | 'Scheduled';
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
  description?: string;
  photoUrl?: string;
  isPrevious?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  serviceReason: string;
  date: string;
  scheduledDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  details?: string;
  proofUrl?: string;
  proofName?: string;
  isPrevious?: boolean;
}

export interface ExpenseLog {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Services' | 'Repairs' | 'Maintenance';
  date: string;
  subtitle: string;
  totalAmount: number;
  logs: ExpenseLog[];
}

export interface DriverNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  type: 'maintenance' | 'service' | 'expense' | 'reminder' | 'team';
  read: boolean;
}

export interface OrganizationInfo {
  name: string;
  subtitle: string;
  logoUrl?: string;
}

export interface FleetManagerContact {
  name: string;
  phone: string;
  email: string;
  department: string;
}

export interface AdminContact {
  name: string;
  team: string;
  email: string;
  supportHours: string;
}

// Initial Seed Data accurately matching the reference UI images
const INITIAL_DRIVER_PROFILE: DriverProfile = {
  id: 'driv-001',
  name: 'John Smith',
  role: 'Driver',
  driverId: 'DRIV-001',
  licenseNumber: 'DL123456',
  licenseExpiry: '15 May 2028',
  phone: '+1 987 654 3210',
  email: 'john.smith@serviq.com', // Read-only
  team: 'Operations',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  assignedVehicle: {
    plateNumber: 'TN 09 AB 1234',
    make: 'Toyota',
    model: 'Hilux Fleet',
    year: 2023,
    odometer: 48532,
  },
};

const INITIAL_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'maint-1',
    title: 'Engine Oil Service',
    type: 'Oil Change',
    dueKmText: 'Due due 500 km',
    dueDate: '15 Jan 2025',
    status: 'In Progress',
    priority: 'High',
    description: 'Routine synthetic engine oil and filter change',
    isPrevious: false,
  },
  {
    id: 'maint-2',
    title: 'Brake Inspection',
    type: 'Brakes',
    dueKmText: 'Due 1,200 km',
    dueDate: '20 Apr 2025',
    status: 'Pending',
    priority: 'Normal',
    description: 'Inspect front and rear brake pads, calipers, and fluid',
    isPrevious: false,
  },
  {
    id: 'maint-3',
    title: 'Tire Rotation',
    type: 'Tires',
    dueKmText: 'Due 2,000 km',
    dueDate: '10 Dec 2025',
    status: 'Pending',
    priority: 'Normal',
    description: 'Four-wheel rotation and tread wear inspection',
    isPrevious: false,
  },
  {
    id: 'maint-4',
    title: 'Air Filter Replacement',
    type: 'Filters',
    dueKmText: 'Due 5,000 km',
    dueDate: '30 Dec 2025',
    status: 'In Progress',
    priority: 'Low',
    description: 'Replace cabin and engine air intake filters',
    isPrevious: false,
  },
  // Previous maintenance items
  {
    id: 'maint-prev-1',
    title: 'Coolant Flush & Refill',
    type: 'Cooling System',
    dueKmText: 'Completed at 42,000 km',
    dueDate: '12 Nov 2024',
    status: 'Completed',
    priority: 'Normal',
    isPrevious: true,
  },
  {
    id: 'maint-prev-2',
    title: 'Transmission Fluid Service',
    type: 'Transmission',
    dueKmText: 'Completed at 38,500 km',
    dueDate: '18 Aug 2024',
    status: 'Completed',
    priority: 'High',
    isPrevious: true,
  },
  {
    id: 'maint-prev-3',
    title: 'Battery Health Inspection',
    type: 'Electrical',
    dueKmText: 'Completed at 35,000 km',
    dueDate: '04 May 2024',
    status: 'Completed',
    priority: 'Normal',
    isPrevious: true,
  },
];

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Oil Change Service',
    serviceReason: 'Regular Scheduled Service',
    date: '12 Feb 2025',
    scheduledDate: '12 Feb 2025',
    status: 'Completed',
    details: 'Completed scheduled 10k km synthetic oil service',
    isPrevious: false,
  },
  {
    id: 'srv-2',
    title: 'Air Filter Replacement',
    serviceReason: 'Periodic Maintenance',
    date: '28 Jan 2025',
    scheduledDate: '28 Jan 2025',
    status: 'Completed',
    details: 'Replaced cabin air filter and checked airflow sensors',
    isPrevious: false,
  },
  {
    id: 'srv-3',
    title: 'Brake Service',
    serviceReason: 'Pre-Trip Inspection',
    date: '10 Apr 2025',
    scheduledDate: '10 Apr 2025',
    status: 'In Progress',
    details: 'Front disc inspection and fluid top-up in progress',
    isPrevious: false,
  },
  {
    id: 'srv-4',
    title: 'Tire Rotation',
    serviceReason: 'Scheduled Service',
    date: '20 Dec 2024',
    scheduledDate: '20 Dec 2024',
    status: 'Completed',
    details: 'Rotated tires and calibrated TPMS sensors',
    isPrevious: false,
  },
  // Previous services
  {
    id: 'srv-prev-1',
    title: 'Wheel Alignment & Balancing',
    serviceReason: 'Alignment adjustment',
    date: '14 Oct 2024',
    scheduledDate: '14 Oct 2024',
    status: 'Completed',
    details: 'Laser alignment completed with verified specs',
    isPrevious: true,
  },
  {
    id: 'srv-prev-2',
    title: 'Suspension Check',
    serviceReason: 'Annual check',
    date: '02 Aug 2024',
    scheduledDate: '02 Aug 2024',
    status: 'Completed',
    details: 'Shock absorbers and bushings inspected',
    isPrevious: true,
  },
];

const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Engine Oil Service',
    category: 'Services',
    date: '12 Apr 2025',
    subtitle: 'Date In 50m • 12 Apr 2025',
    totalAmount: 120,
    logs: [
      { id: 'log-1', date: '12 Apr 2025', description: 'Oil Change + Filter', amount: 120 },
      { id: 'log-2', date: '10 Jan 2025', description: 'Oil Change + Filter', amount: 110 },
      { id: 'log-3', date: '15 Oct 2024', description: 'Oil Change', amount: 95 },
    ],
  },
  {
    id: 'exp-2',
    title: 'Brake Repair',
    category: 'Repairs',
    date: '08 Mar 2025',
    subtitle: 'Date In 90 • 08 Mar 2025',
    totalAmount: 200,
    logs: [
      { id: 'log-4', date: '08 Mar 2025', description: 'Front Ceramic Brake Pads & Rotor Resurface', amount: 200 },
    ],
  },
  {
    id: 'exp-3',
    title: 'Tire Rotation',
    category: 'Maintenance',
    date: '21 Dec 2025',
    subtitle: 'Date in 200m • 21 Dec 2025',
    totalAmount: 90,
    logs: [
      { id: 'log-5', date: '21 Dec 2025', description: 'Wheel Balancing & 4-Tire Rotation', amount: 90 },
    ],
  },
  {
    id: 'exp-4',
    title: 'Air Filter Replacement',
    category: 'Maintenance',
    date: '01 Dec 2025',
    subtitle: 'Maintenance • 1st Dec 2025',
    totalAmount: 75,
    logs: [
      { id: 'log-6', date: '01 Dec 2025', description: 'OEM Engine Air Filter + Cabin Filter', amount: 75 },
    ],
  },
  // Additional past expenses to reflect overall fleet total ($2,450)
  {
    id: 'exp-5',
    title: 'Transmission Flush',
    category: 'Services',
    date: '18 Nov 2024',
    subtitle: 'Services • 18 Nov 2024',
    totalAmount: 380,
    logs: [
      { id: 'log-7', date: '18 Nov 2024', description: 'Full fluid replacement and gasket', amount: 380 },
    ],
  },
  {
    id: 'exp-6',
    title: 'Suspension Bushing Replacement',
    category: 'Repairs',
    date: '05 Oct 2024',
    subtitle: 'Repairs • 05 Oct 2024',
    totalAmount: 485,
    logs: [
      { id: 'log-8', date: '05 Oct 2024', description: 'Control arm bushing kit & installation', amount: 485 },
    ],
  },
  {
    id: 'exp-7',
    title: 'Battery & Alternator Service',
    category: 'Repairs',
    date: '14 Aug 2024',
    subtitle: 'Repairs • 14 Aug 2024',
    totalAmount: 290,
    logs: [
      { id: 'log-9', date: '14 Aug 2024', description: 'Heavy duty commercial battery replacement', amount: 290 },
    ],
  },
  {
    id: 'exp-8',
    title: 'Annual Comprehensive Inspection',
    category: 'Maintenance',
    date: '22 Jul 2024',
    subtitle: 'Maintenance • 22 Jul 2024',
    totalAmount: 810,
    logs: [
      { id: 'log-10', date: '22 Jul 2024', description: 'Commercial vehicle certification and tune-up', amount: 810 },
    ],
  },
];

const INITIAL_NOTIFICATIONS: DriverNotification[] = [
  {
    id: 'notif-1',
    title: 'Maintenance Request',
    description: 'Your maintenance Request has been approved.',
    timeAgo: '3 hours ago',
    type: 'maintenance',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Service Completed',
    description: 'Vehicle service completed successfully',
    timeAgo: '5 hours ago',
    type: 'service',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Expense Added',
    description: 'A new expense has been added for Engine Oil Service.',
    timeAgo: '1 day ago',
    type: 'expense',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Reminder',
    description: 'Next service due in 500 km.',
    timeAgo: '1 day ago',
    type: 'reminder',
    read: true,
  },
  {
    id: 'notif-5',
    title: 'Team Update',
    description: "Team update: moved to Operations Team.",
    timeAgo: '2 days ago',
    type: 'team',
    read: true,
  },
];

const INITIAL_ORGANIZATION: OrganizationInfo = {
  name: 'ABC Transport Co.',
  subtitle: 'Safe Drive, Better Tomorrow',
};

const INITIAL_FLEET_MANAGER: FleetManagerContact = {
  name: 'David Miller',
  phone: '+1 987 654 3210',
  email: 'david.miller@abctransport.com',
  department: 'Fleet Operations',
};

const INITIAL_ADMIN: AdminContact = {
  name: 'Central Admin Team',
  team: 'Operations',
  email: 'support@abctransport.com',
  supportHours: 'Mon - Fri, 8:00 AM - 6:00 PM',
};

// Storage keys
const STORAGE_KEYS = {
  PROFILE: 'serviq_driver_profile',
  MAINTENANCE: 'serviq_driver_maintenance',
  SERVICES: 'serviq_driver_services',
  EXPENSES: 'serviq_driver_expenses',
  NOTIFICATIONS: 'serviq_driver_notifications',
  ORGANIZATION: 'serviq_driver_organization',
  FLEET_MANAGER: 'serviq_driver_manager',
  ADMIN: 'serviq_driver_admin',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to store key ${key}:`, err);
  }
}

export const driverService = {
  // Profile
  getProfile(): DriverProfile {
    return getStored<DriverProfile>(STORAGE_KEYS.PROFILE, INITIAL_DRIVER_PROFILE);
  },

  updateProfile(partial: Partial<DriverProfile>): DriverProfile {
    const current = this.getProfile();
    // Enforce email is strictly read-only
    const updated: DriverProfile = {
      ...current,
      ...partial,
      email: current.email, // Locked
    };
    setStored(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // Odometer
  getOdometer(): number {
    return this.getProfile().assignedVehicle.odometer;
  },

  updateOdometer(newKm: number): { success: boolean; error?: string; reading?: number } {
    const current = this.getOdometer();
    if (isNaN(newKm) || newKm <= 0) {
      return { success: false, error: 'Please enter a valid positive odometer reading' };
    }
    if (newKm < current) {
      return {
        success: false,
        error: `New reading (${newKm.toLocaleString()} km) cannot be lower than current reading (${current.toLocaleString()} km)`,
      };
    }

    const profile = this.getProfile();
    profile.assignedVehicle.odometer = newKm;
    setStored(STORAGE_KEYS.PROFILE, profile);

    // Also push a notification
    this.addNotification({
      title: 'Odometer Updated',
      description: `Odometer reading successfully updated to ${newKm.toLocaleString()} km.`,
      type: 'reminder',
    });

    return { success: true, reading: newKm };
  },

  // Maintenance
  getMaintenance(filter: 'current' | 'previous' = 'current'): MaintenanceItem[] {
    const all = getStored<MaintenanceItem[]>(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
    if (filter === 'previous') {
      return all.filter((item) => item.isPrevious || item.status === 'Completed');
    }
    return all.filter((item) => !item.isPrevious && item.status !== 'Completed');
  },

  requestMaintenance(request: {
    title: string;
    type: string;
    description: string;
    priority: 'Low' | 'Normal' | 'High' | 'Urgent';
    photoUrl?: string;
  }): MaintenanceItem {
    const all = getStored<MaintenanceItem[]>(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
    const newItem: MaintenanceItem = {
      id: `maint-${Date.now()}`,
      title: request.title || `${request.type} Service`,
      type: request.type,
      dueKmText: 'Due scheduled',
      dueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      priority: request.priority,
      description: request.description,
      photoUrl: request.photoUrl,
      isPrevious: false,
    };
    const updated = [newItem, ...all];
    setStored(STORAGE_KEYS.MAINTENANCE, updated);

    this.addNotification({
      title: 'Maintenance Request Submitted',
      description: `Request for ${newItem.title} submitted to Fleet Manager.`,
      type: 'maintenance',
    });

    return newItem;
  },

  // Services
  getServices(filter: 'current' | 'previous' = 'current'): ServiceItem[] {
    const all = getStored<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (filter === 'previous') {
      return all.filter((item) => item.isPrevious || item.status === 'Completed');
    }
    return all.filter((item) => !item.isPrevious);
  },

  requestService(request: {
    serviceReason: string;
    details: string;
    proofUrl?: string;
    proofName?: string;
  }): ServiceItem {
    const all = getStored<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const dateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newItem: ServiceItem = {
      id: `srv-${Date.now()}`,
      title: request.serviceReason,
      serviceReason: request.serviceReason,
      date: dateFormatted,
      scheduledDate: dateFormatted,
      status: 'In Progress',
      details: request.details,
      proofUrl: request.proofUrl,
      proofName: request.proofName,
      isPrevious: false,
    };
    const updated = [newItem, ...all];
    setStored(STORAGE_KEYS.SERVICES, updated);

    this.addNotification({
      title: 'Service Request Added',
      description: `New service request registered for ${newItem.title}.`,
      type: 'service',
    });

    return newItem;
  },

  // Expenses
  getExpenses(categoryFilter: string = 'All'): { totalOverall: number; items: ExpenseItem[] } {
    const items = getStored<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const totalOverall = items.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    if (categoryFilter === 'All') {
      return { totalOverall, items };
    }
    const filtered = items.filter(
      (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
    );
    return { totalOverall, items: filtered };
  },

  getExpenseItem(id: string): ExpenseItem | undefined {
    const items = getStored<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    return items.find((item) => item.id === id);
  },

  addExpenseLog(
    itemId: string,
    log: { date: string; amount: number; description: string }
  ): { success: boolean; item?: ExpenseItem; totalOverall?: number; error?: string } {
    if (!log.amount || isNaN(log.amount) || log.amount <= 0) {
      return { success: false, error: 'Please enter a valid expense amount' };
    }
    if (!log.description?.trim()) {
      return { success: false, error: 'Description is required' };
    }

    const items = getStored<ExpenseItem[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const index = items.findIndex((it) => it.id === itemId);
    if (index === -1) {
      return { success: false, error: 'Expense item not found' };
    }

    const item = items[index];
    const newLog: ExpenseLog = {
      id: `log-${Date.now()}`,
      date: log.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: log.description,
      amount: Number(log.amount),
    };

    item.logs = [newLog, ...(item.logs || [])];
    item.totalAmount = item.logs.reduce((sum, l) => sum + l.amount, 0);
    items[index] = item;
    setStored(STORAGE_KEYS.EXPENSES, items);

    const totalOverall = items.reduce((acc, curr) => acc + curr.totalAmount, 0);

    this.addNotification({
      title: 'Expense Added',
      description: `Added $${log.amount} to ${item.title}.`,
      type: 'expense',
    });

    return { success: true, item, totalOverall };
  },

  // Notifications
  getNotifications(): DriverNotification[] {
    return getStored<DriverNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  getUnreadCount(): number {
    const list = this.getNotifications();
    return list.filter((n) => !n.read).length;
  },

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  markAllNotificationsAsRead(): void {
    const list = this.getNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  addNotification(notif: { title: string; description: string; type: DriverNotification['type'] }): void {
    const list = this.getNotifications();
    const newNotif: DriverNotification = {
      id: `notif-${Date.now()}`,
      title: notif.title,
      description: notif.description,
      timeAgo: 'Just now',
      type: notif.type,
      read: false,
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...list]);
  },

  // Organization & Contacts
  getOrganization(): OrganizationInfo {
    return getStored<OrganizationInfo>(STORAGE_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
  },

  getFleetManagerContact(): FleetManagerContact {
    return getStored<FleetManagerContact>(STORAGE_KEYS.FLEET_MANAGER, INITIAL_FLEET_MANAGER);
  },

  getAdminContact(): AdminContact {
    return getStored<AdminContact>(STORAGE_KEYS.ADMIN, INITIAL_ADMIN);
  },

  // Team Change Request
  requestTeamChange(targetTeam: string, reason: string): { success: boolean; message: string } {
    if (!targetTeam) return { success: false, message: 'Please select a target team' };
    this.addNotification({
      title: 'Team Change Requested',
      description: `Transfer request to ${targetTeam} submitted for manager approval.`,
      type: 'team',
    });
    return {
      success: true,
      message: `Your request to transfer to "${targetTeam}" has been submitted for fleet review.`,
    };
  },
};
