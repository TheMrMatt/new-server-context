const Nota = require('./models/notas');
const { notaSchema } = require('./Schemas');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //req.session.returnTo = req.originalUrl
        console.log('error, You must be signed in first!', req.isAuthenticated());
        return res.status(400).json({
            success: false,
            error: 'You need to be log in first'
        });
    }
    console.log('error, You must be signed in first!', req.isAuthenticated());
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
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

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
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