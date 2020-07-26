const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'] // El segundo parámetro es en caso de que no se cumpla, entrega ese mensaje
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //Con esto evitamos que nos manden otros tipos de roles que no deseamos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Do not declare methods using ES6 arrow functions (=>). 
// Arrow functions explicitly prevent binding this, 
// so your method will not have access to the document 
// and the above examples will not work.

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
}

usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe ser único'} )
//Este comando me impide hacer un put del email 


module.exports = mongoose.model('Usuario', usuarioSchema)