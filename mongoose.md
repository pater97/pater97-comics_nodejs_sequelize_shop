# installare dipendeze 
- installare le varie dipendenze
    + express
    + body-parser
    + ejs
    + mysql2
    + sequalize 

- npm init per creare il package.json e impostare lo script per npm start

# creare le varie cartelle
- controllers -> x i controller
- models -> x i modelli
- public -> x i file pubblici come i css
- routes -> x le rotte 
- util -> x il db
- views -> per le pagine da visualizzare 

# collegare il db 

- nella cartella "util" creare un file chiamato database.js
- importare sequelize -> const Sequelize = require('sequelize')
- creare l'istanza dove specifico la connessione del db 
- esportarlo -> module.exports = sequelize;

# app.js
- creare file app.js che gestirà il tutto
- importare
    + body-parser
    + path
    + express
    + il db -> const sequelize = require('./util/database');
- richiamare express per utilizzarlo -> const app = express()
- settare il template engine che utilizzerò
- settare il pacchetto per le req
- indicare il percorso statico per i file css
- richiamare il server -> 
                        sequelize
                        .sync()
                        .then( result => {
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

- importare sequelize -> const Sequelize = require('sequelize');
- importare db -> const sequelize = require('../util/database');
- impostare il modello 
    + es:  const Product = sequelize.define('product', {
      id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
      },
      title: Sequelize.STRING,
      price:{
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      imageUrl: {
        type : Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

- renderlo esportabile
    + module.exports = Product;

# in app.js quindi
- Importare i models 
- relazionare le tabelle 
    + esempio di serie di associazioni: 
    = 
        Product.belongsTo(User, {constrain:true,onDelete:'CASCADE'})
        User.hasMany(Product);
        User.hasOne(Cart);    //un utente ha un carrello
        Cart.belongsTo(User)  //un carrello appartiene ad un utente
        Cart.belongsToMany(Product , { through: CartItem });  //più carrelli contentono più prodotti
        Product.belongsToMany(Cart, { through:CartItem })     //più prodotti in più carrelli
        Order.belongsTo(User);                                 //un ordine appartiene a un utente
        User.hasMany(Order);                                  //un utente può avere più ordini
        Order.belongsToMany(Product, { through : OrderItem })  

- grazie a sync le tabelle si sincronizzeranno automaitcamente, ma se c'è la necessita si può forzare la creazione usando il force -> 
                    sequelize
                    .sync({force:true})
                    .then( result => {
                    app.listen(3000);
                    })
                    .catch(err => {
                    console.log(err);
                    });
!!!ATTENZIONE PERò PERCHè RESETTERà TUTTO!!!

