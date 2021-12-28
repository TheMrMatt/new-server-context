const express = require('express');
const router = express.Router();
const { getNotas, addNota, showNota, deleteNota, updateNota, getLastNotas } = require('../controllers/notas');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });
const { isLoggedIn, isAutor, validateNota, isAutorizated } = require('../middleware');


router
        .route('/all')
        .get(getNotas)
        .post(isLoggedIn, upload.single('img'), addNota)

        ;

router
        .route('/last')
        .get(getLastNotas)
        ;

router
        .route('/:id')
        .get(isLoggedIn, showNota)
        .put(upload.single('img'), updateNota)
        .delete(deleteNota) //agregar middleware para que solo los admins puedan eliminar
        ;



module.exports = router;