const mongoose = require('mongoose');


const PortadaSchema = new mongoose.Schema({
    portada: {
        type: String,
        trim: true,
        required: [true, 'Please add some text']
        //categoria me da paja cambiar todo 
    },
    principal: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Nota'
        },
        titulo: {
            type: String,
            trim: true,
        },
        img: {
            type: String,

        },
        descripcion: {
            type: String
        },
        categoria: {
            type: String,
            required: true

        },
        subCategoria: {
            type: String

        }
    },
    secundario: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Nota'
            },
            titulo: {
                type: String,
                trim: true,
            },
            img: {
                type: String,

            },
            descripcion: {
                type: String
            },
            categoria: {
                type: String,
                required: true

            },
            subCategoria: {
                type: String

            }
        }
    ],
    subCategorias: [
        {
            subCategoria: {
                type: String,
                trim: true,
                required: [true, 'Please add some text']
            },
            subCatPrincipal: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Nota'
                },
                titulo: {
                    type: String,
                    trim: true,
                },
                img: {
                    type: String,

                },
                descripcion: {
                    type: String
                },
            },
            subCatSecundario: [
                {
                    id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Nota'
                    },
                    titulo: {
                        type: String,
                        trim: true,
                    },
                    img: {
                        type: String,

                    },
                    descripcion: {
                        type: String
                    },
                }
            ],

        }
    ]
})


module.exports = mongoose.model('Portada', PortadaSchema);