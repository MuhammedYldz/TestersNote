const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const multer = require('multer');
const path = require('path');

// Multer yapılandırması - dosya yükleme için
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Not rotaları
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', upload.single('screenshot'), noteController.createNote);
router.put('/:id', upload.single('screenshot'), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;