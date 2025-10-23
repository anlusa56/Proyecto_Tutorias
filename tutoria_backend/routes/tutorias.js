const express = require('express');
const router = express.Router();
const { 
    crearTutoria,
    getTutoriasByRol,
    getCalendarioTutorias,
    asignarTutoria,
    actualizarTutoria,
    eliminarTutoria,
    getTutoriasByProfesor,
    getTutoriasByTutor
} = require('../controllers/tutoriasController');

const { validarJWT } = require('../middleware/validar-jwt');

// Aplicar validación JWT a todas las rutas
router.use(validarJWT);

// Rutas base
router.post('/', crearTutoria);
router.post('/asignar', asignarTutoria);
router.get('/rol', getTutoriasByRol);
router.get('/calendario', getCalendarioTutorias);

// Rutas específicas
router.get('/profesor/:id', getTutoriasByProfesor);
router.get('/tutor/:id', getTutoriasByTutor);
router.put('/:id', actualizarTutoria);
router.delete('/:id', eliminarTutoria);

module.exports = router;
