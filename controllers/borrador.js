const Borrador = require('../models/borrador');

exports.borrador = async (req, res, next) => {

    try {
        const nota = new Borrador(req.body);
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

exports.getBorrador = async (req, res, next) => {
    try {

        const borrador = await Borrador.find({});


        console.log('asda', borrador)

        return res.status(200).json({
            success: true,
            count: borrador.length,
            data: borrador
        });

    } catch (err) {
        console.log('el error es:', err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.getBorradorId = async (req, res, next) => {
    try {
        const nota = await Borrador.findById(req.params.id);


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

        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }
}

exports.deleteBorrador = async (req, res, next) => {

    try {
        const nota = await Borrador.findByIdAndDelete(req.params.id);

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


exports.updateBorrador = async (req, res, next) => {

    try {
        const { id } = req.params;

        const nota = await Borrador.findByIdAndUpdate(id, { ...req.body });
        const i = { url: req.file.path, filename: req.file.filename };
        nota.img = i;

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
