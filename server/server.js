const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function (req, res) {
  //res.send('Hello World!'); // Esto envía un html
  //Queremos enviar un json
  res.json('GET usuario')
});

app.post('/usuario', function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json

    //En un post lo que queremos es enviar un body, al que luego debemos acceder (payload)
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    }else{
        res.json({
            persona: body
        })   
    }

});

app.put('/usuario/:id', function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json

    //Para obtener los datos asociados a la request:
    let id = req.params.id

    res.json('PUT usuario: ' + id)
});

app.delete('/usuario', function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json
    res.json('DELETE usuario')
});

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});