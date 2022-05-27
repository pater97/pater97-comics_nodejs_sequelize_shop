//importazioni

//pacchetto per la gestione
const path = require('path');
//pacchetto per utilizzare express
const express = require('express');
//pacchetto per gestire le richieste
const bodyParser = require('body-parser');
//importo mongoose
const mongoose = require('mongoose');
//importo il model user per crearlo all'avvio del server
const User = require('./models/user');
//importo le rotte di shop/admin
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
//importo i controller
const errorController = require('./controllers/error');
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
    User.findById('628f85b70129fba06515ef66')    //seleziona l'utente con id uno e poi lo associerà ad ogni richiesta di user.id presente in ogni punto dell'app
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

//imposto connessione con db mongoose
mongoose.connect('mongodb+srv://root:hdJVk1UWmv8JF2Co@cluster0.1uaxy.mongodb.net/comics?retryWrites=true&w=majority')
.then(result => {
  User.findOne().then(user => {             //findOne ci restituirà il primo oggetto nel caso in cui ci fosse
    if (!user) {
      const user = new User({
        name: 'Max',
        email: 'max@test.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  });
  app.listen(3000);
  console.log('connesso')
})
.catch(err => {
  console.log(err);
});