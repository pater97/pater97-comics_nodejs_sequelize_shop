const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

//mostra homepage
router.get('/',shopController.getIndex);
//mostra tutti i prodotti
router.get('/comics',shopController.getComics);
//mostra show
router.get('/comic/:comicId',shopController.getComic);
//mostra carrello
router.get('/cart',shopController.getCart);
//aggiungi a carrello
router.post('/cart',shopController.postCart);
//elimina dal carrello
router.post('/cart-delete-item',shopController.postCartDeleteComic);
//posto gli ordini
router.post('/orders',shopController.postOrder);
//mostra ordini
router.get('/orders',shopController.getOrders);


module.exports = router;