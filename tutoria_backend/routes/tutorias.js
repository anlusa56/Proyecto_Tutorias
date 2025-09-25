const express = require('express');
const router = express.Router();
const tutoriaController = require('../controllers/tutoriaController');
const { verificarToken } = require('../middlewares/auth');
const checkRol = require('../middlewares/checkRol');

// Rutas públicas que requieren autenticación
router.get('/', verificarToken, tutoriaController.getTutoriasByRol);

// Rutas para profesores y admin
router.post('/', 
  verificarToken, 
  checkRol(['admin', 'profesor']), 
  tutoriaController.crearTutoria
);
ayud
router.post('/asignar',
  verificarToken,
  checkRol(['admin', 'profesor']),
  tutoriaController.asignarTutor
);

// Rutas solo para admin
router.put('/:id', 
  verificarToken, 
  checkRol(['admin']), 
  tutoriaController.actualizarTutoria
);

router.delete('/:id', 
  verificarToken, 
  checkRol(['admin']), 
  tutoriaController.eliminarTutoria
);

module.exports = router;
