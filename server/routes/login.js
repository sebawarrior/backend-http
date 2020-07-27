const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if (err) {
            res.status(500)
            .json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos' //Usuario incorecto
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos' //Contraseña incorrecta
                }
            })
        }

        let token = jwt.sign({usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}) // expiresIn está en segundos
        //Ojo, los token van en el header como authorization

        res.json({
            ok: true,
            usuario: usuarioDB,
            token

        })


    }) // Lo que está en el objeto es para ver que el archivo exista

})


module.exports = app;