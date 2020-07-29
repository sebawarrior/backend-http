const express = require('express');
const app = express();
const _ = require('underscore');

const Categoria = require('../models/categoria');
const {verificaToken, verificaAdmin} = require('./../middlewares/autenticacion');

// =================================
//   Mostrar todas las categorias
// =================================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email') // populate permite entregar la info de la insancia de schema asociado (usuario en este caso)
    .exec((err, categorias) => {
        if (err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        Categoria.count((err, conteo) => {

            res.json({
                ok: true,
                categorias,
                cantidad: conteo
            })
        })

    })
})

// =================================
//   Mostrar una categoria por ID
// =================================

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })


})

// =================================
//   Crear nueva categoria
// =================================

app.post('/categoria', verificaToken, function (req, res) {
    // regresa la nueva categoria
    // req.usuario._id
    let id = "5f1c8c7a57c2889e7be04ddc" //req.usuario._id;
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    })

    categoria.save((err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })   
        }
        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            }) 
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

// =================================
//   Actualizar una categoria por ID
// =================================

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['descripcion'])

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, categoriaDB) => {
        if (err){
            res.status(400).json({
                ok: false,
                err
            }) 
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

// =================================
//   Eliminar una categoria por ID
// =================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {
    // Solo un admin puede borrar categorias
    // Debe usar Token
    let id = req.params.id
    Categoria.findByIdAndDelete(id, (err, categoria) => {
        if (err){
            res.status(500).json({
                ok: false,
                err
            }) 
        }
        if (!categoria){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })

})


module.exports = app;