const express = require('express');
const app = express();
const {verificaToken} = require('./../middlewares/autenticacion');
let Producto = require('./../models/producto');
const _ = require('underscore');
const producto = require('./../models/producto');

// ==================================
//   Obtener productos
// ==================================

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = Number(req.query.desde || 0);


    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        Producto.countDocuments({disponible: true}, (err, conteo) => {
            res.json({
                ok: true,
                productos,
                cantidad: conteo
            });
        });


    });


});

// ==================================
//   Obtener un producto por ID
// ==================================

app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id
    Producto.find({_id: id})
    .populate('usuario', 'role estado nombre email')
    .populate('categoria')
    .exec((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                message: 'Producto no encontrado'
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

// ==================================
//   Buscar producto
// ==================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i') //Esto es una expresión regular. La i es que es insensible a mayúsculas y minñusculas

    Producto.find({nombre: regex, disponible: true})
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productos
        })
    })
})





// ==================================
//   Crear un producto
// ==================================

app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

// ==================================
//   Actualizar un producto por ID
// ==================================

app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria'])
    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            return 
        }
        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err
            })
            return 
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

// ==================================
//   Eliminar un producto por ID
// ==================================

app.delete('/producto/:id', verificaToken, (req, res) => {
    // eliminar el producto
    // grabar una categoria del listado
    //cambiar disponible
    let id = req.params.id
    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true}, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

module.exports = app;