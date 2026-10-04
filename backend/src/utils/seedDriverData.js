const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const connectDB = require('../config/db');

const User = require('../models/User');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Organization = require('../models/Organization');
const Maintenance = require('../models/Maintenance');
const Repair = require('../models/Repair');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const OdometerLog = require('../models/OdometerLog');

async function seed() {
  try {
    await connectDB();
    console.log('[Seed] Connected to database');

    // 1. Get or create Organization
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create({
        name: 'SERVIQ Fleet Logistics',
        email: 'admin@serviq.com',
        phone: '+91 90000 00000',
        address: '100 Tech Park, Chennai, India',
        registrationNumber: 'SRVQ-ORG-2026',
      });
      console.log('[Seed] Created default Organization');
    }

    // 2. Check if Driver User exists
    let driverUser = await User.findOne({ email: 'driver@serviq.com' });
    if (!driverUser) {
      driverUser = await User.create({
        name: 'Rajesh Kumar',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'driver@serviq.com',
        password: 'password123',
        role: 'driver',
        organization: org._id,
        phone: '+91 98765 43210',
        address: 'No. 45, Anna Salai, Guindy, Chennai - 600032',
        status: 'active',
      });
      console.log('[Seed] Created Driver User account: driver@serviq.com / password123');
    }

    // 3. Check or create Vehicle
    let vehicle = await Vehicle.findOne({ vehicleNumber: 'TN 01 AB 1234', organization: org._id });
    if (!vehicle) {
      vehicle = await Vehicle.create({
        organization: org._id,
        vehicleNumber: 'TN 01 AB 1234',
        vehicleType: 'Hauler',
        manufacturer: 'Ashok Leyland',
        model: 'XYZ',
        year: 2023,
        fuelType: 'Diesel',
        odometer: 45280,
        status: 'available',
        vin: 'MB1A2B3C4D5E6F7G8',
        rcNumber: 'RC-TN01-AB1234-2023',
        insuranceExpiry: new Date('2027-05-15'),
        fitnessExpiry: new Date('2027-08-20'),
        pucExpiry: new Date('2027-03-10'),
      });
      console.log('[Seed] Created Vehicle: TN 01 AB 1234');
    }

    // 4. Check or create Driver Profile
    let driverProfile = await Driver.findOne({ user: driverUser._id });
    if (!driverProfile) {
      driverProfile = await Driver.create({
        user: driverUser._id,
        organization: org._id,
        driverId: 'DRV-1001',
        drivingLicenceNumber: 'TN01 2020 0004567',
        licenceExpiry: new Date('2028-12-31'),
        dateOfBirth: new Date('1990-05-14'),
        emergencyContact: {
          name: 'Sunita Kumar',
          phone: '+91 98765 43211',
          relationship: 'Spouse',
        },
        employmentStatus: 'full_time',
        assignedVehicle: vehicle._id,
        status: 'active',
      });
      console.log('[Seed] Created Driver profile linked to vehicle');
    } else {
      driverProfile.assignedVehicle = vehicle._id;
      await driverProfile.save();
    }

    // Link vehicle to driver
    vehicle.assignedDriver = driverProfile._id;
    await vehicle.save();

    // 5. Seed Odometer History
    const odoCount = await OdometerLog.countDocuments({ vehicle: vehicle._id });
    if (odoCount === 0) {
      await OdometerLog.create([
        {
          organization: org._id,
          vehicle: vehicle._id,
          driver: driverProfile._id,
          reading: 44300,
          recordedAt: new Date('2026-09-20T09:00:00Z'),
          notes: 'Pre-trip reading Chennai Hub',
        },
        {
          organization: org._id,
          vehicle: vehicle._id,
          driver: driverProfile._id,
          reading: 44900,
          recordedAt: new Date('2026-09-28T14:30:00Z'),
          notes: 'Weekly inspection log',
        },
        {
          organization: org._id,
          vehicle: vehicle._id,
          driver: driverProfile._id,
          reading: 45280,
          recordedAt: new Date('2026-10-04T10:15:00Z'),
          notes: 'Updated before departure',
        },
      ]);
      console.log('[Seed] Created Odometer log history');
    }

    // 6. Seed Maintenance
    const maintCount = await Maintenance.countDocuments({ vehicle: vehicle._id });
    if (maintCount === 0) {
      await Maintenance.create([
        {
          organization: org._id,
          vehicle: vehicle._id,
          serviceType: 'Oil Change',
          intervalMonths: 3,
          intervalKm: 5000,
          lastServiceDate: new Date('2026-08-10'),
          lastServiceOdometer: 42500,
          nextDueDate: new Date('2026-10-12'),
          nextDueOdometer: 45500,
          cost: 3500,
          status: 'good',
          serviceCenter: 'Ashok Leyland Authorized - Guindy',
          notes: 'Full synthetic 15W-40 engine oil and filter change',
        },
        {
          organization: org._id,
          vehicle: vehicle._id,
          serviceType: 'General Service',
          intervalMonths: 6,
          intervalKm: 15000,
          lastServiceDate: new Date('2026-09-15'),
          lastServiceOdometer: 45000,
          nextDueDate: new Date('2026-11-20'),
          nextDueOdometer: 50000,
          cost: 8200,
          status: 'good',
          serviceCenter: 'SERVIQ Central Workshop',
          notes: 'Brake pad check, coolant flush, filter clean',
        },
      ]);
      console.log('[Seed] Created Maintenance records');
    }

    // 7. Seed Repairs & Issues
    const repCount = await Repair.countDocuments({ vehicle: vehicle._id });
    if (repCount === 0) {
      await Repair.create([
        {
          organization: org._id,
          vehicle: vehicle._id,
          reportedBy: driverUser._id,
          issueType: 'Engine',
          description: '[Engine Noise] Slight vibration and humming noise observed on cold start at idle',
          priority: 'high',
          status: 'in_progress',
          odometerAtIncident: 45200,
          assignedWorkshop: 'SERVIQ Express Fleet Care',
          notes: 'Technician inspected belt tensioner and valve clearances; parts ordered',
        },
        {
          organization: org._id,
          vehicle: vehicle._id,
          reportedBy: driverUser._id,
          issueType: 'Brakes',
          description: '[Brake Issue] Minor squeak during high speed braking',
          priority: 'medium',
          status: 'completed',
          odometerAtIncident: 44100,
          completedAt: new Date('2026-09-18'),
          cost: 2100,
          assignedWorkshop: 'Ashok Leyland Express',
          notes: 'Brake shoes cleaned and caliper lubricated',
        },
        {
          organization: org._id,
          vehicle: vehicle._id,
          reportedBy: driverUser._id,
          issueType: 'Tire',
          description: '[Tyre Problem] Left rear tyre pressure drop detected',
          priority: 'low',
          status: 'completed',
          odometerAtIncident: 43500,
          completedAt: new Date('2026-09-05'),
          cost: 450,
          assignedWorkshop: 'City Tyre Hub',
          notes: 'Tubeless puncture plugged and balanced',
        },
      ]);
      console.log('[Seed] Created Repair records');
    }

    // 8. Seed Documents
    const docCount = await Document.countDocuments({ vehicle: vehicle._id });
    if (docCount === 0) {
      await Document.create([
        {
          organization: org._id,
          entityType: 'vehicle',
          vehicle: vehicle._id,
          documentType: 'Registration (RC)',
          documentNumber: 'RC-TN01-AB1234-2023',
          issueDate: new Date('2023-04-10'),
          expiryDate: new Date('2038-04-09'),
          status: 'valid',
          notes: 'Government of Tamil Nadu Transport Dept',
        },
        {
          organization: org._id,
          entityType: 'vehicle',
          vehicle: vehicle._id,
          documentType: 'Insurance',
          documentNumber: 'ICICI-LOMB-789456123',
          issueDate: new Date('2026-05-16'),
          expiryDate: new Date('2027-05-15'),
          status: 'valid',
          notes: 'Comprehensive Commercial Vehicle Policy',
        },
        {
          organization: org._id,
          entityType: 'vehicle',
          vehicle: vehicle._id,
          documentType: 'PUC Certificate',
          documentNumber: 'PUC-2026-TN01-9988',
          issueDate: new Date('2026-09-11'),
          expiryDate: new Date('2027-03-10'),
          status: 'valid',
          notes: 'Emission compliant BS6',
        },
        {
          organization: org._id,
          entityType: 'vehicle',
          vehicle: vehicle._id,
          documentType: 'Commercial Permit',
          documentNumber: 'AITP-TN-2026-4411',
          issueDate: new Date('2025-01-01'),
          expiryDate: new Date('2030-12-31'),
          status: 'valid',
          notes: 'All India Tourist / Goods Permit',
        },
        {
          organization: org._id,
          entityType: 'vehicle',
          vehicle: vehicle._id,
          documentType: 'Road Fitness',
          documentNumber: 'FIT-TN01-2026-88',
          issueDate: new Date('2025-08-21'),
          expiryDate: new Date('2027-08-20'),
          status: 'valid',
          notes: 'Passed annual inspection',
        },
      ]);
      console.log('[Seed] Created Compliance Documents');
    }

    // 9. Seed Notifications
    const notifCount = await Notification.countDocuments({
      organization: org._id,
      $or: [{ recipient: driverUser._id }, { targetRole: 'driver' }],
    });
    if (notifCount === 0) {
      await Notification.create([
        {
          organization: org._id,
          recipient: driverUser._id,
          targetRole: 'driver',
          title: 'Repair Update',
          message: 'Your reported engine issue is now: IN PROGRESS. Technician assigned.',
          type: 'repair',
          link: '/repairs',
          readBy: [],
        },
        {
          organization: org._id,
          recipient: driverUser._id,
          targetRole: 'driver',
          title: 'Maintenance Due Soon',
          message: 'Oil Change is scheduled for 12 Oct 2026 (Due at 45,500 km).',
          type: 'maintenance',
          link: '/maintenance',
          readBy: [],
        },
        {
          organization: org._id,
          recipient: driverUser._id,
          targetRole: 'driver',
          title: 'Vehicle Assigned',
          message: 'Vehicle TN 01 AB 1234 (Ashok Leyland XYZ) has been assigned to you.',
          type: 'vehicle',
          link: '/vehicle',
          readBy: [driverUser._id],
        },
      ]);
      console.log('[Seed] Created Driver Notifications');
    }

    console.log('[Seed] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
}

seed();
