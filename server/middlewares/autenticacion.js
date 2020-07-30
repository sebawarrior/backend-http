
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
                err: {
                    message: 'Token no válido'
                }
            })
        }
        //decoded contiene el payload
        req.usuario = decoded.usuario;
        console.log(decoded)
        next();

    })

    // Lo que hace next es que continúe con lo que sigue la función,
    // luego de ejecutar el middleware

};

// ======================
//   Verficar TokenImg
// ======================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }
        //decoded contiene el payload
        req.usuario = decoded.usuario;
        next();

    })

}



// ======================
//     Verficar Admin
// ======================

let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario;
    console.log('-----')
    console.log(usuario)
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
    verificaAdmin,
    verificaTokenImg
}