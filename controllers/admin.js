const Comic = require('../models/comic');


exports.getComics = (req,res,next) => {
    //estrapolo i fumetti grazie a find
    Comic.find()
    .then(comics => {
        res.render('admin/index',{
            comics: comics,
            pageTitle: 'ADMIN MODE',
            activeClass: 'admin'
        })
    })
    .catch(err => console.log(err));
}

//mostra il form add-comi
exports.getAddForm = (req,res,next) => {
    res.render('admin/edit-comic',{
        pageTitle:'Aggiungi fumetto',
        activeClass: 'admin',
        editing: false
    })
};

//post del form add-comic
exports.postAddComic = (req,res,next) => {
    //recupero i dati dalla richiest
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.body.image;
    const isNew = req.body.isNew;
    //invio il costrutto con i dati
    const comic = new Comic({
        title:title,
        price:price,
        description:description,
        image:image,
        isNew:isNew,
        userId: req.user
    });
    //salvo e reindirizzo
    comic.save()
    .then( result => {
        console.log(result);
        console.log('fumetto creato');
        res.redirect('/admin');
    })
    .catch(err => console.log(err));
};

//mostra l'edit
exports.getEditComic = (req,res,next) => {
    //verifico se nella quary è presente edit
    const editMode = req.query.edit;
    //se non è edit rimando all'index di admin
    if(!editMode){
        return res.redirect('/admin')
    }
    const comicId = req.params.comicId;
    Comic.findById(comicId)
    .then(comic => {
        if(!comic){
            return res.redirect('/admin');
        }
        res.render('admin/edit-comic',{
            pageTitle: comic.title,
            activeClass:'admin',
            comic:comic,
            editing:editMode
        })
    })
};

//posta le modifiche
exports.postEditComic = (req,res,next) => {
    //inserisco nelle variabili gli input del form
    const comicId = req.body.comicId;
    const upTitle = req.body.title;
    const upPrice = req.body.price;
    const upImage = req.body.image;
    const upDescription = req.body.description; 
    const upIsNew = req.body.isNew;
    //cerco il fumetto in questione
    Comic.findById(comicId)
    //sovrascrivo i dati
    .then(comic => {
        comic.title = upTitle;
        comic.price = upPrice;
        comic.image = upImage;
        comic.description = upDescription;
        comic.isNew = upIsNew
        //infine salvo le modifiche
        return comic.save();
    })
    .then( result =>{
        console.log('fumetto modificato con sucesso!');
        res.redirect('/admin')
    })
    .catch(err => console.log(err));
}
//eliminare il fumetto

exports.deleteComic = (req,res,next) => {
    //estrapolo l'id grazie all'input nascosto
    const comicId = req.body.comicId;
    //cerco il fumetto in questione e lo elimino grazie a una funzione di mongoose
    Comic.findByIdAndRemove(comicId)
    .then(result => {
        console.log('fumetto eliminato');
        res.redirect('/admin');
    })
    .catch(err => console.log(err));
}