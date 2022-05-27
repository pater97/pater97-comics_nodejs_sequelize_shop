//importo i modelli
const Comic = require('../models/comic');
const Order = require('../models/order');

//homepage
exports.getIndex = (req,res,next) => {
  Comic.find()
  .then( comics => {
    res.render('shop/home',{
      pageTitle:'HOME',
      activeClass:'home',
      comics:comics
    })
  })
  .catch(err => console.log(err));
}

//mostra tutti i fumetti
exports.getComics = (req,res,next) => {
  Comic.find()
  .then(comics => {
    res.render('shop/comics',{
      pageTitle: 'comics',
      activeClass: 'comics',
      comics:comics
    })
  })
  .catch(err => console.log(err));
}
//mostra singolo fumetto
exports.getComic = (req,res,next) => {
  //estrapolo dalla richiesta del get l'id che mi serve
  const comicId = req.params.comicId;
  //cerco il fumetto con quel nome
  Comic.findById(comicId)
  //render della pagina alla quale passo i dati estrapolati sopra
  .then(comic => {
    console.log(comic);
    res.render('shop/comic-details' ,{
      comic: comic,
      pageTitle: comic.title,
      activeClass: 'comics'
    })
  })
}

//mostro il carrello
exports.getCart = (req,res,next) => {
  req.user
  .populate('cart.items.comicId')
  // .execPopulate()
  .then(user => {
    const comics = user.cart.items;
    res.render('shop/cart',{
      pageTitle: 'Carrello',
      activeClass: 'cart',
      comics: comics
    })
  })
  .catch(err => console.log(err));
}

//aggiungo al carrello
exports.postCart = (req,res,next) => {
  const comicId = req.body.comicId;
  Comic.findById(comicId)
  .then( comic => {
    return req.user.addToCart(comic)
  })
  .then( result => {
    console.log(result);
    console.log('aggiunto al carrello');
    res.redirect('/cart')
  })
  .catch(err => console.log(err));
}
//rimuovo dal carrelloi un articolo 
exports.postCartDeleteComic = (req, res, next) => {
  const comicId = req.body.comicId;
  req.user
    .removeFromCart(comicId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};
//creo l'ordine
exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.comicId')
    // .execPopulate()
    .then(user => {
      const comics = user.cart.items.map(i => {
        return { quantity: i.quantity, comic: { ...i.comicId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        comics: comics
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
//pagina order mostra
exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/order', {
        activeClass: 'orders',
        pageTitle: 'STORICO ORDINI',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};


