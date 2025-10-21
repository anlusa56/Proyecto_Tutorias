const express = require('express');
const router = express.Router();
const tutoriaController = require('../controllers/tutoriasController');
const { verificarToken } = require('../middlewares/auth');
const checkRol = require('../middlewares/checkRol');

// Middleware común para todas las rutas que requieren autenticación
router.use(verificarToken);

// Rutas públicas con autenticación
router.get('/', tutoriaController.getTutoriasByRol);

// Rutas para profesores y admin
router.post('/', 
  checkRol(['admin', 'profesor']),
  tutoriaController.crearTutoria
);

router.post('/asignar',
  checkRol(['admin', 'profesor']),
  tutoriaController.asignarTutor
);

// Rutas exclusivas para admin
router.put('/:id', 
  checkRol(['admin']), 
  tutoriaController.actualizarTutoria
);

router.delete('/:id', 
  checkRol(['admin']), 
  tutoriaController.eliminarTutoria
);
router.get('/profesor/:id', tutoriaController.getTutoriasByProfesor);

module.exports = router;
