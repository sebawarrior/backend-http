
// =================================
//    Correr mongo DB en terminal
// =================================

// mongod --dbpath /System/Volumes/Data/data/db --port 12345 


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')

require('./config/config')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Para evitar decalrar cada uno de estos
// app.use(require('./routes/usuario'))
// app.use(require('./routes/login'))

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

//Rutas
app.use(require('./routes/index'))


// Esto se va a conectar solo si ya ejecutamos mongod en terminal:
// mongod --dbpath /System/Volumes/Data/data/db --port 12345
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) {
        throw err
    }
    console.log('Base de datos online')
})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});