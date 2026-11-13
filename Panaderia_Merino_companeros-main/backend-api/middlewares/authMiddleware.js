const jwt = require('jsonwebtoken');
const R = require('../utils/response');

module.exports = (req, res, next) => {

    try {

        const authHeader = req.headers['authorization'];

        // Verificar que exista el token
        if (!authHeader) {
            return R.unauthorized(res, 'Token no proporcionado');
        }


        // Extraer solo el token (quitar 'Bearer ')
        const parts = authHeader.split(' ');


        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return R.unauthorized(
                res,
                'Formato de token inválido. Use: Bearer <token>'
            );
        }


        const token = parts[1];


        // Verificar y decodificar el token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Guardar información del usuario autenticado
        // Disponible como req.user.id_usuario, req.user.email, req.user.rol
        req.user = decoded;


        // Continuar con la siguiente función
        next();


    } catch (error) {


        if (error.name === 'TokenExpiredError') {
            return R.unauthorized(
                res,
                'El token ha expirado. Inicia sesión nuevamente.'
            );
        }


        if (error.name === 'JsonWebTokenError') {
            return R.unauthorized(
                res,
                'Token inválido o manipulado.'
            );
        }


        return R.serverError(res);

    }

};