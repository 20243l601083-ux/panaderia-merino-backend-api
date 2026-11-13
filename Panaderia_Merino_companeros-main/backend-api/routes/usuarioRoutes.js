const express   = require('express');
const router    = express.Router(); 

const ctrl      = require('../controllers/usuarioController');
const auth = require('../middlewares/authMiddleware');

const {
    validarRegistro,
    validarActualizacion
} = require('../validators/usuarioValidator');
 
/**  
* @swagger
* /usuarios:  
*   post:  
*     summary: Registrar un nuevo usuario  
*     tags: [Usuarios]  
*     requestBody:  
*       required: true  
*       content:  
*         application/json:  
*           schema:  
*             $ref: '#/components/schemas/RegistroInput'  
*     responses:  
*       201:  
*         description: Usuario registrado exitosamente  
*         content:  
*           application/json:  
*             schema:  
*               $ref: '#/components/schemas/Usuario'  
*       400:  
*         description: Datos de entrada inválidos  
*       409:  
*         description: El usuario o correo ya existe  
*/  


// Ruta pública (sin autenticación) 
router.post('/', validarRegistro, ctrl.registrar); 

/**  
* @swagger  
* /usuarios:  
*   get:  
*     summary: Listar todos los usuarios  
*     tags: [Usuarios]  
*     security:  
*       - BearerAuth: []  
*     responses:  
*       200:  
*         description: Lista de usuarios  
*       401:  
*         description: Token no proporcionado o inválido  
*/

/**  
* @swagger  
* /auth/login:  
*   post:  
*     summary: Iniciar sesión y obtener JWT  
*     tags: [Autenticación]  
*     requestBody:  
*       required: true 
*       content:  
*         application/json:  
*           schema:  
*             $ref: '#/components/schemas/LoginInput'  
*     responses:  
*       200:  
*         description: Login exitoso con token JWT  
*       401:  
*         description: Credenciales incorrectas  
*/ 

// Rutas protegidas (requieren JWT) 
router.get('/', auth, ctrl.listar); 

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/:id', auth, ctrl.obtener); 

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', auth, validarActualizacion, ctrl.actualizar); 

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: Token inválido o no proporcionado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', auth, ctrl.eliminar);  

module.exports = router; 