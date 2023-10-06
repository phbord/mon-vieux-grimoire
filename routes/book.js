const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const compressImage = require('../middleware/compress');
const bookCtrl = require('../controllers/book');


// Routes PUBLIQUES
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRatingBooks);
router.get('/:id', bookCtrl.getOneBook);

// Routes PRIVEES
router.post('/', auth, multer, compressImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.newRating);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;