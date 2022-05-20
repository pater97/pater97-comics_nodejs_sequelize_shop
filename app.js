//pacchetto per la gestione
const path = require('path');
//pacchetto per utilizzare express
const express = require('express');
//pacchetto per gestire le richieste
const bodyParser = require('body-parser');
//azioni dal db
const sequelize = require('./util/database');
//richiamo express per utilizzarlo
const app = express();
//settare template engine
app.set('view engine' , 'ejs');
//attivare il pacchetto per le req
app.use(bodyParser.urlencoded({ extended:false }));
//percorso statico per i file css/img/ecc
app.use(express.static(path.join(__dirname,'public')));


//attivo il server
sequelize.sync()
.then( result => {
    app.listen(3000);
})
.catch(err => console.log(err));