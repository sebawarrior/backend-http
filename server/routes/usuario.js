const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore')

const Usuario = require('../models/usuario')
const {verificaToken, verificaAdmin} = require('./../middlewares/autenticacion')

//Un middleware va en el segundo argumento de las funciones

app.get('/usuario', verificaToken, function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json
    //res.json('GET usuario')
    

    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 0)

    //el primer {} de find es el filtro que quiero, y el string de 
    //segundo parámetro son los atributos que quiero que regrese la petición
    Usuario.find({estado: true}, 'nombre email role estado google img') // para llamar al desde se usa /usuarios?desde=10&limite=5 por ejemplo en la url
    .skip(desde) // Se salta los primeros "desde" elementos
    .limit(limite) //limit permite ver el máximo número de usuarios
    .exec((err, usuarios) => {
        if (err) {
            res.status(400).json({
                ok:false,
                err
            })
        }

        Usuario.countDocuments({estado: true}, (err, conteo) => { // el {} sirve para hacer un filtro

            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            })
        })

    })

});
  
app.post('/usuario', [verificaToken, verificaAdmin], function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json

    //En un post lo que queremos es enviar un body, al que luego debemos acceder (payload)
    let body = req.body;
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //El 10 es la cantidad de veces que deseo que se aplique la función de hash
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                of:false,
                err
            })
        }

        //usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

  });
  
app.put('/usuario/:id', [verificaToken, verificaAdmin], function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json

    //Pick elige cuáles de los elementos que uso son válidos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //Para obtener los datos asociados a la request:
    let id = req.params.id

    //Esto es una mala idea porque puede que la base de datos tenga cientos de atributos que no deseo poder modificar
    //delete body.password
    //delete body.google

    //new hace que se muestre el nuevo archivo updated
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        
        if (err) {
            res.status(400).json({
                ok:false,
                err
            })
        }

        //usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    // res.json('PUT usuario: ' + id)
});

// En general yo no quiero borrar registros, sino que solamente cambiar un estado a false
app.delete('/usuario/:id', [verificaToken, verificaAdmin], function (req, res) {
    //res.send('Hello World!'); // Esto envía un html
    //Queremos enviar un json
    //res.json('DELETE usuario')

    let id = req.params.id

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true, runValidators: true}, (err, usuarioDB) => {
        if (err){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })



});

module.exports = app;

