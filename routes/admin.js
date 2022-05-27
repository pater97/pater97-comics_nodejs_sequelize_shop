const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// //mostra index.js di admin
router.get('/',adminController.getComics);
// //mostra il form
router.get('/add-comic',adminController.getAddForm);
// //posta il comic da admin
router.post('/add-comic',adminController.postAddComic);
// //mostra l'edit del comic
router.get('/edit-comic/:comicId',adminController.getEditComic);
// //posta l'edit del comic modificato
router.post('/edit-comic',adminController.postEditComic);
// //rotta delete
router.post('/delete',adminController.deleteComic);

module.exports = router;