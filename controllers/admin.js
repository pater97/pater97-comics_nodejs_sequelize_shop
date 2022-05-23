//importo il modello comic
const Comic = require('../models/comic');

//mostra index.js di admin
exports.getComics = (req,res,next) => {
    req.user.getComics()
    .then(comics => {
        res.render('admin/index',{
            comics: comics,
            pageTitle: 'ADMIN MODE',
            activeClass: 'admin'
        });
    })
    .catch(err => console.log(err));
};

//mostra il form add-comic
exports.getAddForm = (req,res,next) => {
    res.render('admin/edit-comic',{
        pageTitle:'aggiungi comic',
        activeClass: 'admin',
        editing:false
    });
}

//post di aggiungi comic
exports.postAddComic = (req, res, next) => {
    const title = req.body.title;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;
    req.user.createComic({                //in questo modo parto dalla richiesta utente per creare un prodotto, di conseguenza saranno collegati
      title: title,
      price: price,
      image:image,
      description:description
    })
    .then( result => {
      // console.log(result)
      console.log('record aggiunto')
      res.redirect('/admin')
    })
    .catch(err => {
      console.log(err)
    })
  };

//render dell'edit comic
exports.getEditComic = (req, res, next) => {
    const editMode = req.query.edit;       //serve per ottenere la quary (da utilizzare come check)
    if(!editMode){
        res.redirect('/admin');                //in questo modo comunichiamo che se la quary non è edit allora si reindirizzerà alla home
    }
   const prodId = req.params.comicId;    //estrapolo l'id dal parametro della rotta (attenzione a mettere lo stesso nome)
   req.user.getComics({where:{id:prodId}})    //grazie a questa sorta di validazione avremmo indietro solo il prodotto associato all'id
   .then( comics =>{
     const comic = comics[0];
       if(!comic){
           return res.redirect('/admin');       //nel caso non ci fosse il prodotto lo reindirizzerebbe
       }
       res.render('admin/edit-comic', {
           pageTitle: 'Edit comic',
           activeClass:'admin',     //questo può rimanere così in quanto è solo per la navigazione
           editing: editMode,
           comic: comic                //in questo modo passo le variabili del prodotto selezionato
       });
   })
   .catch(err => {
     console.log(err)
   })
   };

//post di edit
exports.postEditComic = (req,res,next) => {
    //recupero i dati tramite req
    const comicId = req.body.comicId;
    const uptadedTitle = req.body.title;
    const uptadedPrice = req.body.price;
    const uptadedImage = req.body.image;
    const uptadedDescription = req.body.description;
    //creo il costrutto
    Comic.findByPk(comicId)
    .then( comic => {
        comic.title = uptadedTitle,
        comic.price = uptadedPrice,
        comic.image = uptadedImage;
        comic.description = uptadedDescription;
        return comic.save()
    })
    .then( result => {
        console.log('comic modificato');
        res.redirect('/admin')
    })
    .catch(err => console.log(err));
};

//delete 
exports.deleteComic = (req,res,next) => {
    const comicId = req.body.comicId;
    Comic.findByPk(comicId)
    .then( comic => {
        return comic.destroy()
    })
    .then( result => {
        console.log('comic eliminato');
        res.redirect('/admin')
    })
    .catch( err => console.log(err));
};