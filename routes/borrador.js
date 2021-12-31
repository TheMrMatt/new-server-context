const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });
const { isLoggedIn, isAutor, validateNota, isAutorizated, authenticateToken } = require('../middleware');
const { borrador, getBorrador, getBorradorId, deleteBorrador, updateBorrador } = require('../controllers/borrador');

router
    .route('/')
    .post(authenticateToken, isAutorizated, upload.single('img'), borrador)
    ;

router
    .route('/all')
    .get(getBorrador)
    ;
router
    .route('/:id')
    .get(authenticateToken, isAutorizated, getBorradorId)
    .put(authenticateToken, isAutorizated, upload.single('img'), updateBorrador)
    .delete(authenticateToken, isAutorizated, deleteBorrador) //agregar middleware para que solo los admins puedan eliminar
    ;

module.exports = router;