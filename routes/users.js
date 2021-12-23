const express = require('express');
const router = express.Router();

const { getUsers, register, login, logout, getUser, loginFc, getAutor } = require('../controllers/users');
const { forwardAuthenticated } = require('../config/auth');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });
const passport = require('passport');




router.route('/login')
        .get(getUser)
        .post(passport.authenticate('local', {}), login);

router.route('/register')
        .get(getUsers)
        .post(upload.fields([{ name: 'imagenPerfil', maxCount: 1 }, { name: 'imagenPortada', maxCount: 1 }]), register);

router.route('/logout')
        .get(logout);

router.route('/auth/facebook')
        .get(passport.authenticate('facebook', { scope: ['email'] }));

router.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook'), loginFc, (req, res) => { res.redirect('http://localhost:3000/') }
        );

router.route('/user/:id')
        .get(getAutor);


module.exports = router;