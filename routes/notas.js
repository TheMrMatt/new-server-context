const express = require('express');
const router = express.Router();
const { getNotas, addNota, showNota, deleteNota, updateNota, getLastNotas } = require('../controllers/notas');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });
const { isLoggedIn, isAutor, validateNota, isAutorizated, authenticateToken } = require('../middleware');


router
        .route('/all')
        .get(getNotas)
        .post(authenticateToken, isAutorizated, upload.single('img'), addNota)

        ;

router
        .route('/last')
        .get(getLastNotas)
        ;

router
        .route('/:id')
        .get(authenticateToken, showNota)
        .put(authenticateToken, isAutorizated, upload.single('img'), updateNota)
        .delete(authenticateToken, isAutorizated, deleteNota) //agregar middleware para que solo los admins puedan eliminar
        ;



module.exports = router;