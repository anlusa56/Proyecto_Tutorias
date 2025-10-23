const { sequelize, Tutoria, Usuario } = require('../models');

const limpiarTutorias = async () => {
    try {
        // Obtener todas las tutorías
        const tutorias = await Tutoria.findAll({
            include: [
                { 
                    model: Usuario, 
                    as: 'tutoriasComoTutor',
                    required: false
                },
                { 
                    model: Usuario, 
                    as: 'tutoriasComoTutoriado',
                    required: false
                }
            ]
        });

        console.log(`Total tutorías encontradas: ${tutorias.length}`);

        // Identificar tutorías incompletas
        const tutoriasIncompletas = tutorias.filter(tutoria => 
            !tutoria.tutoriasComoTutor.length || 
            !tutoria.tutoriasComoTutoriado.length
        );

        console.log(`Tutorías incompletas encontradas: ${tutoriasIncompletas.length}`);

        // Eliminar tutorías incompletas
        for (const tutoria of tutoriasIncompletas) {
            console.log(`Eliminando tutoría ID: ${tutoria.id}`);
            await tutoria.destroy();
        }

        console.log('Limpieza completada con éxito');
        process.exit(0);

    } catch (error) {
        console.error('Error durante la limpieza:', error);
        process.exit(1);
    }
};

// Ejecutar la limpieza
limpiarTutorias();