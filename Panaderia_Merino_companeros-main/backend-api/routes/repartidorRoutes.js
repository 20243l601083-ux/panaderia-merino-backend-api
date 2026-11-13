const express = require('express');

const router = express.Router();

const repartidorController = require('../controllers/repartidorController');

const auth = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');


/**
 * @swagger
 * tags:
 *   name: Repartidores
 *   description: Gestión de repartidores de la panadería
 */


/**
 * @swagger
 * /repartidores:
 *   get:
 *     summary: Listar repartidores
 *     tags: [Repartidores]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de repartidores
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/', auth, checkRole('admin'), repartidorController.listar);


/**
 * @swagger
 * /repartidores:
 *   post:
 *     summary: Crear repartidor
 *     tags: [Repartidores]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 10
 *               telefono:
 *                 type: string
 *                 example: "2717654321"
 *               disponibilidad:
 *                 type: string
 *                 example: "libre"
 *               ubicacion_actual_lat:
 *                 type: number
 *                 example: 18.884320
 *               ubicacion_actual_lng:
 *                 type: number
 *                 example: -96.925610
 *     responses:
 *       201:
 *         description: Repartidor creado correctamente
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.post('/', auth, checkRole('admin'), repartidorController.crear);


/**
 * @swagger
 * /repartidores/{id}:
 *   get:
 *     summary: Obtener repartidor por ID
 *     tags: [Repartidores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del repartidor
 *     responses:
 *       200:
 *         description: Repartidor encontrado correctamente
 *       404:
 *         description: Repartidor no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/:id', auth, checkRole('admin'), repartidorController.obtener);


/**
 * @swagger
 * /repartidores/{id}:
 *   put:
 *     summary: Actualizar repartidor
 *     tags: [Repartidores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del repartidor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telefono:
 *                 type: string
 *                 example: "2717654321"
 *               disponibilidad:
 *                 type: string
 *                 example: "ocupado"
 *               ubicacion_actual_lat:
 *                 type: number
 *                 example: 18.884320
 *               ubicacion_actual_lng:
 *                 type: number
 *                 example: -96.925610
 *     responses:
 *       200:
 *         description: Repartidor actualizado correctamente
 *       404:
 *         description: Repartidor no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.put('/:id', auth, checkRole('admin'), repartidorController.actualizar);


/**
 * @swagger
 * /repartidores/{id}:
 *   delete:
 *     summary: Eliminar repartidor
 *     tags: [Repartidores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del repartidor
 *     responses:
 *       200:
 *         description: Repartidor eliminado correctamente
 *       404:
 *         description: Repartidor no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.delete('/:id', auth, checkRole('admin'), repartidorController.eliminar);

module.exports = router;