//importazioni

//pacchetto per la gestione
const path = require('path');
//pacchetto per utilizzare express
const express = require('express');
//pacchetto per gestire le richieste
const bodyParser = require('body-parser');
//azioni dal db
const sequelize = require('./util/database');
//importo le rotte di shop/admin
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
//importo i controller
const errorController = require('./controllers/error');
//importo i model
const Comic = require('./models/comic');
const User = require('./models/user')
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


//richiamo express per utilizzarlo
const app = express();
//settare template engine
app.set('view engine' , 'ejs');
//attivare il pacchetto per le req
app.use(bodyParser.urlencoded({ extended:false }));
//percorso statico per i file css/img/ecc
app.use(express.static(path.join(__dirname,'public')));
//Creo un middlewere che sarà disponibile in ogni punto dell'applicazione che trasmetterà come richiesta dello user.id il numero 1 
//!!!ATTENZIONE A POSIZIONARLO PRIMA DI USARE LE ROTTE!!!
app.use((req,res,next) => {
    User.findByPk(1)    //seleziona l'utente con id uno e poi lo associerà ad ogni richiesta di user.id presente in ogni punto dell'app
    .then( user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
  });
//uso le rotte di shop/admin
app.use('/admin',adminRoutes);
app.use(shopRoutes);
//rotta per il page not found
app.use(errorController.get404);


//relaziono le tabelle
Comic.belongsTo(User, {constrain:true,onDelete:'CASCADE'})
User.hasMany(Comic);
User.hasOne(Cart);    //un utente ha un carrello
Cart.belongsTo(User)  //un carrello appartiene ad un utente
Cart.belongsToMany(Comic , { through: CartItem });  //più carrelli contentono più comcis
Comic.belongsToMany(Cart, { through:CartItem })     //più comics in più carrelli
Order.belongsTo(User);                                 //un ordine appartiene a un utente
User.hasMany(Order);                                  //un utente può avere più ordini
Order.belongsToMany(Comic, { through : OrderItem })     //un ordine può avere più comcis e li traccia attraverso la tab OrderItem

//attivo il server e in assenza di validazione imposto che creerà sempre uno user con id 1 in caso non ci fosse
sequelize
// .sync({force:true})
.sync()
.then( result => {
  return User.findByPk(1);
})
.then( user =>{
  if (!user){
    return User.create({name:'max',email:'test@test.com'});
  }
  return user;
})
.then(user => {
  return user.createCart();     //qui creo un carrello associato all'utente
})
.then(cart => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});