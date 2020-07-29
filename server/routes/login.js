const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

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

        let token = jwt.sign({usuario: usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}) // expiresIn está en segundos
        //Ojo, los token van en el header como authorization

        res.json({
            ok: true,
            usuario: usuarioDB,
            token

        })


    }) // Lo que está en el objeto es para ver que el archivo exista

})

// Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

   
  }
  //verify().catch(console.error);


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    console.log(token)

    let googleUser = await verify(token)
    .catch(e => {
        res.status(403).json({
            ok: false,
            err: e
        })
        return 
    })

    // Verificamos que no hayan dos usuarios con el mismo email

    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if (err) {
            res.status(500)
            .json({
                ok: false,
                err
            })
        }
        if (usuarioDB) {
            //Revisamos si se ha autenticado con google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }
                })
            } else {
                let token = jwt.sign({usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else{
            //Si el usuario no existe en nuestra base de datos lo creamos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = 'esto solo para pasar validación de DB'; // Porque es obligatoria, pero nunca le vamos nosotros a dar esta password 

            usuario.save((err, usuarioDB) => {
                if (err) {
                    res.status(500)
                    .json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({usuarioDB}, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });

});


module.exports = app;