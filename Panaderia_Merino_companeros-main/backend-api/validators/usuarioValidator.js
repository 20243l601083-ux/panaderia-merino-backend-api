const { body } = require('express-validator');


exports.validarRegistro = [

    body('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),


    body('email')
        .notEmpty()
        .withMessage('El correo es requerido')
        .isEmail()
        .withMessage('El correo no es válido'),


    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener mínimo 6 caracteres')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[0-9]/)
        .withMessage('La contraseña debe contener al menos un número'),


    body('rol')
        .optional()
        .isIn([
            'admin',
            'cliente',
            'repartidor'
        ])
        .withMessage('Rol no válido')

];



exports.validarActualizacion = [

    body('nombre')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),


    body('email')
        .optional()
        .isEmail()
        .withMessage('El correo no es válido'),


    body('rol')
        .optional()
        .isIn([
            'admin',
            'cliente',
            'repartidor'
        ])
        .withMessage('Rol no válido')
];
console.log("Validator cargado");
console.log(module.exports);