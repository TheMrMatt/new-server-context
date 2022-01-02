const Nota = require('../models/notas');
const User = require('../models/users')

exports.getLastNotas = async (req, res, next) => {
    try {
        const notas = await Nota.find();



        const data = notas.slice(-3)


        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.getNotas = async (req, res, next) => {
    try {

        const notas = await Nota.find({});




        return res.status(200).json({
            success: true,
            count: notas.length,
            data: notas
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.getNotasTags = async (req, res, next) => {
    try {

        const notas = await Nota.find();




        return res.status(200).json({
            success: true,
            count: notas.length,
            data: notas
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.addNota = async (req, res, next) => {

    try {
        const nota = new Nota(req.body);
        console.log('user', req.user);
        nota.autor = req.user._id;
        nota.img = { url: req.file.path, filename: req.file.filename };
        var dat = new Date().toISOString().
            replace(/T/, ' ').      // replace T with a space
            replace(/\..+/, ''); //Obtienes la fecha
        nota.fechaDeCreacion = dat;
        await nota.save();

        return res.status(201).json({
            sucess: true,
            data: nota

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


exports.showNota = async (req, res, next) => {
    try {
        const nota = await Nota.findById(req.params.id);


        if (nota) {


            return res.status(200).json({
                success: true,
                data: nota
            });
        } else {
            return res.status(404).json({
                sucess: false,
                error: 'Nota not found'
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }
}


exports.deleteNota = async (req, res, next) => {

    try {
        const nota = await Nota.findByIdAndDelete(req.params.id);

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

exports.updateNota = async (req, res, next) => {

    try {
        const { id } = req.params;
        console.log('body', req.body);
        const nota = await Nota.findByIdAndUpdate(id, { ...req.body });
        const i = { url: req.file.path, filename: req.file.filename };
        nota.img = i;
        console.log('nota', nota);
        await nota.save();

        return res.status(200).json({
            success: true,
            data: nota
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

