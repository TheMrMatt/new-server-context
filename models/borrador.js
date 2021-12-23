const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const BorradorSchema = new mongoose.Schema({
    titulo: {
        type: String,
        trim: true,
        required: [true, 'Please add some text']

    },
    categoria: {
        type: String,
        required: true

    },
    subCategoria: {
        type: String

    },
    img: {
        type: [ImageSchema]
    },
    descripcion: {
        type: String
    },
    fechaDeCreacion: {
        type: String
    },
    contenido: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [
        {
            type: String,
            trim: true
        }
    ]
})


module.exports = mongoose.model('Borrador', BorradorSchema);