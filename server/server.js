const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

require('./config/config')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))

// Esto se va aconectar solo si ya ejecutamos mongod en terminal:
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