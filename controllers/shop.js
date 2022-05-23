const Comic = require('../models/comic');
const Cart = require('../models/cart');
//home
exports.getIndex = (req,res,next) => {
    res.render('shop/home',{
        pageTitle:'homePage',
        activeClass: 'home'
    })
};
//mostra tutti i fumetti
exports.getComics = (req,res,next) => {
    Comic.findAll()
    .then( comics => {
        res.render('shop/comics' ,{
            comics:comics,
            activeClass:'comics',
            pageTitle: 'comics'
        });
    })
    .catch(err=> console.log(err));
};
//mostra show comic
exports.getComic = (req,res,next) => {
    const comicId = req.params.comicId;
    Comic.findByPk(comicId)
    .then( comic => {
        res.render('shop/comic-details', {
            comic: comic,
            pageTitle: comic.title,
            activeClass:'comics'
        })
    })
};
// carrello ////////////////////////////////////////////////////////////////////7
//mostra carrello
exports.getCart = (req,res,next) => {
    req.user.getCart()
    .then( cart => {
        return cart
        .getComics()
        .then(comics => {
            res.render('shop/cart',{
                pageTitle:'carrello',
                activeClass : 'cart',
                comics:comics,
        });
    })
    .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}
//aggiungere al carrello
exports.postCart =(req,res,next) => {
    const comicId = req.body.comicId;  //productId si riferisce al nome dell'nput
    let fetchedCart;                    //si riferisce al carrello recuperato(devo salvarlo qui per averlo disponibile anche nelle funzioni annidate)
    let newQuantity = 1;                //farà in modo che se il prodotto non esite la qty sarà uno altrimenti la incrementerà
    req.user
    .getCart()                        //qui abbiamo il carrello in base all'utente che lo ha richiesto
    .then(cart => {
      fetchedCart = cart;             //salvo il carrello recuperato nella variabile
      return cart.getComics({ where : {id:comicId}});    //qui selezioniamo il prodotto in base all'id
    })
    .then(comics => {
      let comic;
      if(comics.length > 0){
        comic = comics[0];
      }
      //qui si incrementa la quantità se il prodotto è già presente
      if(comic){
        const oldQuantity = comic.cartItem.quantity;         //prendere la quantità presente     
        newQuantity = oldQuantity + 1;                        //incremento la quantità aggiungendone uno
        return comic;   
      }
      return Comic.findByPk(comicId)   //reupero il prodotto guardando nella tabella comic attraverso l'id
     })
      .then(comic => {
        return fetchedCart.addComic(comic, {  //aggiungo al carrello il prodotto grazie a questo metodo dato da sequelize passando il prodotto filtrato da id
          through : { quantity : newQuantity}     //grazie a through interagisco con la tabella cart-item e ne modifico la quantità
        });    
      })
     .then( () => {
      res.redirect('/cart');
     })
     .catch(err => console.log(err));
  };
  // cancellare dal carrello i prodotti
exports.postCartDeleteComic = (req,res,next) => {
    const comicId = req.body.comicId;                      //recupero l'id del prodotto che voglio eliminare
    req.user.getCart()                                      //passando dalla richiesta dell'utente recupero il carrello
    .then(cart => {
      return cart.getComics({where : {id:comicId}})        //attraverso l'id prendo il prodotto presente nel carrello
    })
    .then( comics => {
      const comic = comics[0];                          //estrapolo dalla risposta del prodotto solo il prodotto
      return comic.cartItem.destroy();                    //lo elimino grazie alla funzione di sequelize
    })
    .then(result => {
      res.redirect('/cart');                              //reindirizzo sul carrello
    })
    .catch(err => console.log(err));
  };
//   ordini     ////////////////////////////////////////////////////////////
//creare un nuovo ordine
exports.postOrder = (req,res,next) => {
    let fetchedCart;                        //variabile utile a tenere traccia del carrello
    req.user.getCart()                      //ottengo il carrello dell'utente partendo proprio dalla richiesta dell'utente
    .then(cart => {
      fetchedCart = cart;                   //inserisco il contenuto del carrello su cui agisco nella variabile
      return cart.getComics();            //ottengo i prodotti contenuti all'interno del carrello
    })
    .then( comics => {
      return req.user.createOrder()       //creo un nuovo ordine
      .then(order => {
        return order.addComics(         //aggiungo i prodoti all'ordine appena creato grazie alla funzione di sequelize
          comics.map(comic => {       //mappo i prodotti per estrapolare la quantità
            comic.orderItem = { quantity : comic.cartItem.quantity};     //grazie alle relazioni mando alla tab orderItem la quantità presa da cartItem
            return comic;
          })
        );
      })
      .catch(err => console.log(err));
    })
    .then( result => {
      fetchedCart.setComics(null);        //funzione predefinita di sequelize che pulirà il carrello
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
  };
//mostra ordini
exports.getOrders = (req,res,next) => {
    req.user.getOrders({include:['comics']})
    .then(orders => {
        res.render('shop/order',{
            pageTitle:'ordini',
            activeClass : 'order',
            orders:orders
    });
   })
   .catch(err => console.log(err));
};