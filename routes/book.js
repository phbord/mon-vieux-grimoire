const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/book');

// PUBLIC
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRatingBooks);
router.get('/:id', bookCtrl.getOneBook);

// PRIVATE
router.post('/', bookCtrl.createBook);
router.post('/:id/rating', bookCtrl.newRating);
router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;