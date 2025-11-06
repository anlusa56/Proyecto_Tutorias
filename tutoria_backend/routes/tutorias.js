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
    getTutoriasByTutor,
    getTutoriasByTutoriado,
    actualizarEstadoTutoria,
    updateTutoriaEstado,
    cancelarTutoria
} = require('../controllers/tutoriasController');

const { validarJWT } = require('../middlewares/validar-jwt');
const { cargarConfiguracion } = require('../middlewares/configuracion');
// Aplicar validación JWT a todas las rutas
router.use(validarJWT);

// Rutas base
router.post('/', cargarConfiguracion, crearTutoria);
router.post('/asignar', cargarConfiguracion, asignarTutoria);
router.get('/rol', getTutoriasByRol);
router.get('/calendario', getCalendarioTutorias);

// Rutas específicas
router.get('/profesor/:id', getTutoriasByProfesor);
router.get('/tutor/:id', getTutoriasByTutor);
router.get('/tutoriado/:id', getTutoriasByTutoriado);
router.put('/:id', actualizarTutoria);
router.delete('/:id', eliminarTutoria);
router.put('/:id/estado', actualizarEstadoTutoria);
router.put('/:id/cancelar', cancelarTutoria);




module.exports = router;
