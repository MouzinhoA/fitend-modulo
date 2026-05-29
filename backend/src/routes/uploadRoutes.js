const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const auth = require('../middlewares/auth');

const router = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagem inválido. Use jpg, png, gif ou webp.'));
    }
  },
});

router.post('/', auth, upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma foto enviada' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

module.exports = router;
