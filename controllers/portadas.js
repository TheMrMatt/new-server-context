const Portada = require('../models/portadas');



exports.getPortadas = async (req, res, next) => {
    try {
        const portadas = await Portada.find();

        return res.status(200).json({
            success: true,
            count: portadas.length,
            data: portadas
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.addPortada = async (req, res, next) => {

    try {
        const portada = new Portada(req.body);



        await portada.save();

        return res.status(201).json({
            sucess: true,
            data: portada

        })
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);

            return res.status(400).json({
                sucess: true,
                errors: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
            })
        }
    }

}


exports.showPortada = async (req, res, next) => {
    try {
        const portada = await Portada.findById(req.params.id);

        console.log('portada a buscar', req.params)

        if (portada) {
            return res.status(200).json({
                success: true,
                data: portada
            });
        } else {
            return res.status(404).json({
                sucess: false,
                error: 'Nota not found'
            });
        }

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }
}

exports.getCategoria = async (req, res, next) => {
    try {
        const parametro = req.params.categoriaId.toUpperCase();
        const portada = await Portada.findOne({ portada: parametro });

        if (portada) {
            return res.status(200).json({
                success: true,
                data: portada
            });
        } else {
            return res.status(404).json({
                sucess: false,
                error: 'Nota not found'
            });
        }

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }
}

exports.deletePortada = async (req, res, next) => {

    try {
        const portada = await Portada.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.updatePortada = async (req, res, next) => {

    try {
        const { id } = req.params;
        console.log(req.body);
        const portada = await Portada.findByIdAndUpdate(id, { ...req.body });

        await portada.save();

        return res.status(200).json({
            success: true,
            data: portada
        });
    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}