const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketHandler');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const fleetManagerRoutes = require('./routes/fleetManagerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const repairRoutes = require('./routes/repairRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const documentRoutes = require('./routes/documentRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Initialize MongoDB connection
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
initSocket(server, clientUrl);

// Global Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static directory for file/photo uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'SERVIQ Enterprise Fleet Management API',
    timestamp: new Date().toISOString(),
  });
});

// Ensure DB connection is established for serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fleet-managers', fleetManagerRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[SERVIQ API] Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
