const { JsonWebTokenError } = require("jsonwebtoken");

const jwt = require('jsonwebtoken')

// ======================
//     Verficar Token
// ======================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');
    console.log(token)
    // res.json({
    //     token: token
    // })

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok: false,
                err
            })
        }
        //decoded contiene el payload
        req.usuario = decoded.usuarioDB;
        // console.log(decoded)
        next();

    })

    // Lo que hace next es que continúe con lo que sigue la función,
    // luego de ejecutar el middleware

};

// ======================
//     Verficar Admin
// ======================

let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario;
    if (!(usuario.role === 'ADMIN_ROLE')){
        res.status(401).json({
            ok: false,
            message: 'Usuario no autorizado'
        })
    }
    else{
        next()
    }
}

module.exports = {
    verificaToken,
    verificaAdmin
}