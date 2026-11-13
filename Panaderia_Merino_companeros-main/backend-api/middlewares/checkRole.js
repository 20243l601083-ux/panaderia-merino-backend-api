const R = require('../utils/response');


/**
 * Middleware para validar permisos por rol
 * 
 * Uso:
 * checkRole('admin')
 * checkRole('cliente')
 * checkRole('repartidor')
 */

module.exports = (rolPermitido) => {


    return (req, res, next) => {


        try {


            // Verificar que exista un usuario autenticado
            if (!req.user) {

                return R.unauthorized(
                    res,
                    'Usuario no autenticado'
                );

            }



            // Validar que el usuario tenga el rol permitido
            if (req.user.rol !== rolPermitido) {


                return R.forbidden(
                    res,
                    'Acceso denegado. No tiene permisos suficientes'
                );


            }



            // Si cumple el rol continúa hacia el controlador
            next();



        } catch (error) {


            console.error(
                'Error en checkRole:',
                error
            );


            return R.serverError(res);


        }


    };


};