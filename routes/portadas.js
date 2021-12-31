const express = require('express');
const router = express.Router();
const { getCategoria, addPortada, showPortada, deletePortada, updatePortada, getPortadas } = require('../controllers/portadas');
const { isLoggedIn, isAutor, validateNota, isAutorizated, authenticateToken } = require('../middleware');




router
        .route('/portadas')
        .get(getPortadas)
        .post(addPortada)
        ;


router.route('/portadas/:categoriaId')
        .get(getCategoria);

router
        .route('/:id')
        .get(showPortada)
        .put(authenticateToken, isAutorizated, updatePortada)
        .delete(deletePortada) //agregar middleware para que solo los admins puedan eliminar
        ;

module.exports = router;