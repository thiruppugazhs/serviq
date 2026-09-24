const Document = require('../models/Document');

// @desc    Upload / add compliance document
// @route   POST /api/documents
// @access  Private (Admin & Fleet Manager)
exports.createDocument = async (req, res, next) => {
  try {
    const {
      entityType,
      vehicleId,
      driverId,
      documentType,
      documentNumber,
      issueDate,
      expiryDate,
      notes,
    } = req.body;

    if (!documentType || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Document type and expiry date are required',
      });
    }

    const expDate = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = (expDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

    let status = 'valid';
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 30) {
      status = 'expiring_soon';
    }

    const document = await Document.create({
      organization: req.organizationId,
      entityType: entityType || 'vehicle',
      vehicle: vehicleId || null,
      driver: driverId || null,
      documentType,
      documentNumber: documentNumber || '',
      fileUrl: req.file ? `/uploads/${req.file.filename}` : '',
      issueDate: issueDate || null,
      expiryDate: expDate,
      status,
      notes: notes || '',
    });

    const populated = await Document.findById(document._id)
      .populate('vehicle', 'vehicleNumber model manufacturer')
      .populate('driver', 'driverId user');

    res.status(201).json({
      success: true,
      message: 'Document registered successfully',
      document: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    const query = { organization: req.organizationId };
    if (req.query.vehicleId) query.vehicle = req.query.vehicleId;
    if (req.query.status) query.status = req.query.status;

    const documents = await Document.find(query)
      .populate('vehicle', 'vehicleNumber model manufacturer')
      .populate({
        path: 'driver',
        populate: { path: 'user', select: 'name email phone' },
      })
      .sort({ expiryDate: 1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};
