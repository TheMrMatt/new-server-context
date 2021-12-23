const express = require('express');
const router = express.Router();
const { getCategoria, addPortada, showPortada, deletePortada, updatePortada, getPortadas } = require('../controllers/portadas');
const { isLoggedIn, isAutor, validateNota, isAutorizated } = require('../middleware');




router
        .route('/portadas')
        .get(getPortadas)
        .post(isLoggedIn, isAutorizated, addPortada)
        ;


router.route('/portadas/:categoriaId')
        .get(getCategoria);

router
        .route('/:id')
        .get(isLoggedIn, isAutorizated, showPortada)
        .put(isLoggedIn, isAutorizated, updatePortada)
        .delete(isLoggedIn, isAutorizated, deletePortada) //agregar middleware para que solo los admins puedan eliminar
        ;

module.exports = router;