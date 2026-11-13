const express = require('express');

const router = express.Router();

const productoController = require('../controllers/productoController');
const auth = require('../middlewares/authMiddleware');

const checkRole = require('../middlewares/checkRole');

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos de la panadería
 */



/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Listar productos
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/', productoController.listar);





/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado correctamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/:id', productoController.obtener);





/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear producto
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_categoria
 *               - nombre
 *               - precio
 *             properties:
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Concha"
 *               descripcion:
 *                 type: string
 *                 example: "Pan dulce tradicional"
 *               precio:
 *                 type: number
 *                 example: 12.50
 *               stock:
 *                 type: integer
 *                 example: 50
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.post( '/',auth,checkRole('admin'),productoController.crear);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Concha rellena"
 *               descripcion:
 *                 type: string
 *                 example: "Concha rellena de chocolate"
 *               precio:
 *                 type: number
 *                 example: 18.00
 *               stock:
 *                 type: integer
 *                 example: 40
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.put('/:id',auth,checkRole('admin'),productoController.actualizar);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Desactivar producto
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto desactivado correctamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.delete('/:id',auth,checkRole('admin'),productoController.eliminar);


module.exports = router;