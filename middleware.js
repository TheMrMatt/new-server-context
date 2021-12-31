const Nota = require('./models/notas');
const { notaSchema } = require('./Schemas');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //req.session.returnTo = req.originalUrl
        console.log('error, You must be signed in first!', req.user, req);
        return res.status(400).json({
            success: false,
            error: 'You need to be log in first'
        });
    }
    console.log('autenticado', req.isAuthenticated(), req.user);
    next();
}

module.exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log('token', req.headers)
    if (token == null) return res.status(401).json({
        success: false,
        error: 'You need to be log in first'
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            success: false,
            error: 'You need to be log in first'
        })
        console.log('success');
        req.user = user
        next()
    })

}

module.exports.validateNota = (req, res, next) => {
    const { error } = notaSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    console.log('error', error);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return res.status(400).json({
            success: false,
            error: `${msg}`
        });
    } else {
        next();
    }
}

module.exports.isAutor = async (req, res, next) => {
    const { id } = req.params;
    const nota = await Nota.findById(id);
    if (!nota.autor.equals(req.user._id)) {
        return res.redirect(`/nota/${id}`);
    }
    next();
}

module.exports.isAutorizated = async (req, res, next) => {

    if (req.user.tipoUsuario === 'normal') {
        return res.status(401).json({
            success: false,
            error: 'You need to be authorizated'
        });
    }
    next();
}