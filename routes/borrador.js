const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });
const { isLoggedIn, isAutor, validateNota, isAutorizated } = require('../middleware');
const { borrador, getBorrador, getBorradorId, deleteBorrador, updateBorrador } = require('../controllers/borrador');

router
    .route('/')
    .post(upload.single('img'), borrador)
    ;

router
    .route('/all')
    .get(getBorrador)
    ;
router
    .route('/:id')
    .get(getBorradorId)
    .put(upload.single('img'), updateBorrador)
    .delete(deleteBorrador) //agregar middleware para que solo los admins puedan eliminar
    ;

module.exports = router;