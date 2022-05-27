# installare dipendeze 
- installare le varie dipendenze
    + express
    + body-parser
    + ejs
    + mongodb
    + mongoose 

- npm init per creare il package.json e impostare lo script per npm start

# creare le varie cartelle
- controllers -> x i controller
- models -> x i modelli
- public -> x i file pubblici come i css
- routes -> x le rotte 
- util -> x il db
- views -> per le pagine da visualizzare 

# collegare il db 
# in app.js
- creare file app.js che gestirà il tutto
- importare
    + body-parser
    + path
    + express
    + mongoose
    + tramite mongoose avviare il server passando l'url fornito da mongoDb inserendo user e password e (facoltativo) nome
    mongoose
  .connect(
    'mongodb+srv://root:hdJVk1UWmv8JF2Co@cluster0.1uaxy.mongodb.net/prova?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


# creare rotte e view

- nelle view(impostazione solita, ma non fondamentale):
    + cartella admin con le visualizzazioni admin(es.CRUD)
    + cartella principale con le views date al pubblico(es. pagina principale)
    + cartella includes o partials dove mettere ciò che si ripete (es.navbar)

- impostare rotte per file.js (es. se è un negozio avrò shop.js e admin.js solitamente)
    + importare express
    + utilizzare il router di express -> const router = express.Router()
    + importare il controller che gestirà i middlewere delle rotte (quando sarà creato)
    + es di rotta: router.get('/',shopController.getIndex)
    = spiego: 
            * get -> si riferisce al metodo (ci sono post/delete/put/patch)
            * '/' -> si riferisce all'url
            * shopController -> è il controller che lo gestisce
            * getIndex -> è il middlewere che gestirà le chiamate
    + esportare le rotte chiamndole router -> module.exports = router; 
    + importarle in app.js e usarle con express 
        - const shopRoutes = require('./routes/shop') -> importo
        - app.use(shopRoutes); -> utilizzo 
        - n.b: quando le uso posso mettere un prefisso alla quale risponderanno 
        -> app.use('/admin',adminRoutes) -> tutti gli url avranno /admin come prefisso

# controller 

- nei controller creare i middlewere, es:
    + exports.getProduct = (req,res,next) => {corpo del middlewere}
    + importare i modelli la dove c'è bisogno 

# models

- importare mongoose -> const mongoose = require('mongoose');
- attivare lo Schema -> const Schema = mongoose.Schema;
- impostare il modello tramite schema
    + es:  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

- aggiungere metodi se necessario 

- esportarlo indicando il nome che prenderà la collaction e lo schema da seguire
module.exports = mongoose.model('Product', productSchema);


# in app.js quindi
- Importare i models se necessario

# procedimento possibile
- dopo aver creato i modelli:
  + mostrare add
  + post di add
  + mostra tutti i prodotti
  + vista show
  + edit
  + delete