const express = require('express');
const router = express.Router();
const { createDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/')
  .post(authorize('admin', 'fleet_manager'), upload.single('document'), createDocument)
  .get(getDocuments);

router.delete('/:id', authorize('admin', 'fleet_manager'), deleteDocument);

module.exports = router;
