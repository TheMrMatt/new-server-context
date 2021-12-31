const User = require('../models/users')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({ path: '../config/config.env' });


exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.updateUser = async (req, res, next) => {

    try {
        const { id } = req.params;
        console.log('body', req.body);
        const user = await User.findByIdAndUpdate(id, { ...req.body });
        const i = { url: req.file.path, filename: req.file.filename };
        user.img = i;
        console.log('user act', user);
        await user.save();

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}

exports.getAutor = async (req, res, next) => {
    try {
        const autor = await User.findById(req.params.id);

        if (autor) {
            return res.status(200).json({
                success: true,
                data: autor
            });
        } else {
            return res.status(404).json({
                sucess: false,
                data: undefined,
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

exports.getUser = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        console.log(user)
        bcrypt.compare(password, user.password, function (err, r) {
            if (r) {
                return res.send(true)
            } else {
                return res.send(false)
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'

        })
    }

}


exports.register = async (req, res, next) => {

    try {

        let er = [];
        const { nombreYapellido, email, password, descripcion, tipoUsuario = 'Normal' } = req.body;
        let imagenPerfil = '';
        let imagenPortada = '';
        if (!nombreYapellido || !email || !password) {
            er.push({ msg: 'Please enter all fields' })
        }

        if (password.length < 8) {
            er.push({ msg: 'Password must be at least 8 characters' });
        }

        if (er.length > 0) {
            console.log(er)
        } else {
            User.findOne({ email: email }).then(user => {
                if (user) {
                    return res.status(401).json({
                        sucess: true,
                        errors: 'email already exist'
                    })

                } else {
                    imagenPerfil = { url: req.files.imagenPerfil[0].path, filename: req.files.imagenPerfil[0].filename };
                    imagenPortada = { url: req.files.imagenPortada[0].path, filename: req.files.imagenPortada[0].filename };

                    const user = new User({
                        nombreYapellido,
                        email,
                        password,
                        imagenPerfil,
                        imagenPortada,
                        descripcion,
                        tipoUsuario
                    })


                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if (err) throw err;
                            user.password = hash;
                            user.save()

                        });
                    });

                    return res.status(201).json({
                        sucess: true,
                        data: user
                    });

                }

            }
            )
        }

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                sucess: true,
                errors: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: `Error ${err}`
            })
        }
    }
}

exports.login = async (req, res, next) => {

    console.log('despues: ', req.isAuthenticated())
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1 days" })
        console.log(accessToken);
        return res.send({ user, accessToken: accessToken })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: `Error ${err}`
        })
    }

}

exports.loginFc = async (req, res, next) => {

    console.log('despues: ', req.isAuthenticated())
    try {
        const { email, password } = req.user;
        const user = await User.findOne({ email: email });
        console.log(req.user)


        return res.redirect('/')
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: `Error ${err}`
        })
    }

}

exports.logout = async (req, res, next) => {
    req.logout();
    console.log('you log out')
    return res.send({ user: {} })
}


