

// ====================
//        Puerto
// ====================

const { urlencoded } = require("body-parser");

process.env.PORT = process.env.PORT || 3000;

// ====================
//        Entorno
// ====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// ====================
//    Base de datos
// ====================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:12345/cafe'
}
else{
    // Al abrir mongo Compass, ir a la collection test, ahí estará almacenada esta base de datos
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB

// ========================
//  Vencimiento del Token
// ========================

process.env.CADUCIDAD_TOKEN = '48h'  //60 * 60 * 24 * 30 // En segundos

// ========================
//  Seed de autenticación
// ========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ====================
//   Google Client ID
// ====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '907524797416-tf14scmrghcbq7dfojojd53uni55o3ma.apps.googleusercontent.com'