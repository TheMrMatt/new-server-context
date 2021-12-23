const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
        
    },
    nombreYapellido: {
        type: String,
        required: true
        
    },
    password: {
        type: String, 
        required: true,
    },
    imagenPerfil: {
        type: [ImageSchema]
        
    },
    imagenPortada: {
        type: [ImageSchema]
    },
    descripcion: {
        type: String
    },
    tipoUsuario: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('User', UserSchema);