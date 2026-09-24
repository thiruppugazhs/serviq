export type UserRole = 'admin' | 'fleet_manager' | 'driver';

export interface Organization {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  registrationNumber?: string;
  logo?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  employeeId?: string;
  address?: string;
  status: 'active' | 'inactive';
  organization: Organization | string;
  driverProfile?: Driver;
}

export interface Driver {
  _id: string;
  user: User | string;
  organization: string;
  driverId: string;
  profilePhoto?: string;
  drivingLicenceNumber: string;
  licenceExpiry: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  employmentStatus: 'full_time' | 'contract' | 'probation' | 'part_time';
  joiningDate?: string;
  assignedVehicle?: Vehicle | string | null;
  status: 'active' | 'inactive' | 'on_duty' | 'off_duty';
  createdAt?: string;
}

export interface Vehicle {
  _id: string;
  vehicleNumber: string;
  vehicleType: 'Bus' | 'Truck' | 'Van' | 'Sedan' | 'Hauler' | 'EV' | 'SUV' | 'Other';
  manufacturer: string;
  model: string;
  year: number;
  fuelType: 'Diesel' | 'Petrol' | 'CNG' | 'Electric' | 'Hybrid';
  odometer: number;
  assignedDriver?: Driver | null;
  status: 'available' | 'on_trip' | 'in_shop' | 'out_of_service';
  vin?: string;
  rcNumber?: string;
  insuranceExpiry?: string;
  fitnessExpiry?: string;
  pucExpiry?: string;
  createdAt?: string;
}

export interface Maintenance {
  _id: string;
  vehicle: Vehicle;
  serviceType: string;
  intervalMonths: number;
  intervalKm: number;
  lastServiceDate?: string;
  lastServiceOdometer: number;
  nextDueDate?: string;
  nextDueOdometer?: number;
  cost: number;
  status: 'good' | 'due_soon' | 'overdue' | 'completed';
  serviceCenter?: string;
  notes?: string;
}

export interface Repair {
  _id: string;
  vehicle: Vehicle;
  reportedBy: User;
  issueType: 'Engine' | 'Brakes' | 'Transmission' | 'Electrical' | 'Tire' | 'Body' | 'Suspension' | 'Air Conditioning' | 'Oil / Fluids' | 'Other';
  description: string;
  photos: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'in_progress' | 'completed' | 'rejected';
  odometerAtIncident: number;
  assignedWorkshop?: string;
  cost?: number;
  completedAt?: string;
  notes?: string;
  createdAt?: string;
}

export interface Expense {
  _id: string;
  vehicle: Vehicle;
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Insurance' | 'Fine' | 'Parking' | 'Other';
  amount: number;
  date: string;
  odometer?: number;
  fuelLiters?: number;
  receiptUrl?: string;
  notes?: string;
  loggedBy?: User;
}

export interface DocumentRecord {
  _id: string;
  entityType: 'vehicle' | 'driver' | 'company';
  vehicle?: Vehicle;
  driver?: Driver;
  documentType: string;
  documentNumber?: string;
  fileUrl?: string;
  issueDate?: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  notes?: string;
}

export interface AttentionItem {
  id: string;
  vehicleNumber: string;
  model: string;
  issue: string;
  severity: 'critical' | 'warning';
  type: 'repair' | 'maintenance' | 'document';
}

export interface DashboardStats {
  vehicles: {
    total: number;
    available: number;
    inShop: number;
  };
  drivers: {
    total: number;
    active: number;
  };
  fleetManagers: {
    total: number;
  };
  maintenance: {
    dueOrOverdue: number;
  };
  repairs: {
    active: number;
  };
  documents: {
    expiringOrExpired: number;
  };
  expenses: {
    totalSpent: number;
  };
  vehiclesRequiringAttention: AttentionItem[];
}
