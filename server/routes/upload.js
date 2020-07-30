const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('./../models/usuario');
const Producto = require('./../models/producto')
const fs = require('fs');
const path = require('path');

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        })
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if ( tiposValidos.indexOf( tipo ) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos válidos son ' + tiposValidos.join(', '),
            }
        })
    }




    //En el postman usamos form-data para el body, no el encoded
    let archivo = req.files.archivo; //archivo será el nombre de lo que postiemos en postman
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length-1]

    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo.
    // Hay que procurar que el nombre sea único y adjuntarle algo que sea único y prevenir cache de navegador web 
    // 183912kuasidauso-123.jpg
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ extension }`


    //Los archivos hay que renombrarlos en el servidor para que nos se borren cuando suba archivos con el mismo nombre
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aquí la imagen está cargada
        if (tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);

        }
        if (tipo === 'productos'){
            imagenProducto(id, res, nombreArchivo);
        }

    })

})

function imagenUsuario(id, res, nombreArchivo){
    
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioDB.img, 'usuarios')


        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuario) => {
            res.json({
                ok: true,
                usuario,
                img: nombreArchivo
            })
        })


    })
}

function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `./../../uploads/${ tipo }/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos')
            res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }
        if (productoDB.img){
            borrarArchivo(productoDB.img, 'productos')
        }
        productoDB.img = nombreArchivo
        productoDB.save((err, producto) => {
            res.json({
                ok: true,
                producto,
                img: nombreArchivo
            });
        });
    
    });
}

module.exports = app;
