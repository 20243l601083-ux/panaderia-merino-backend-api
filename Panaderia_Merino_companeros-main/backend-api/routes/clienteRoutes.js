const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');
const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');



/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */


/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/', auth, checkRole('admin'), clienteController.listar);


/**
 * @swagger
 * /clientes/usuario/{id_usuario}:
 *   get:
 *     summary: Obtener cliente por ID de usuario
 *     description: Obtiene el perfil del cliente asociado a un usuario registrado en el sistema. Este endpoint permite obtener el id_cliente utilizando el id_usuario obtenido durante el inicio de sesión.
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario asociado al cliente
 *         example: 9
 *     responses:
 *       200:
 *         description: Cliente obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cliente obtenido correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado para el usuario indicado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/usuario/:id_usuario',auth,checkRole('admin'),clienteController.obtenerPorUsuario);


/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.get('/:id',auth,checkRole('admin'),clienteController.obtener);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar datos de un cliente
 *     tags: [Clientes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telefono:
 *                 type: string
 *                 example: "2711234567"
 *               direccion:
 *                 type: string
 *                 example: "Córdoba Veracruz"
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cliente actualizado correctamente
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.put('/:id',auth,checkRole('admin'),clienteController.actualizar);
module.exports = router;