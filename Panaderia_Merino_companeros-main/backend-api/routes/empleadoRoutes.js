const express = require('express');
const router = express.Router();

const empleadoController = require('../controllers/empleadoController');
const auth = require('../middlewares/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Empleados
 *   description: Gestión de empleados internos de la panadería
 */


/**
 * @swagger
 * /empleados:
 *   get:
 *     summary: Listar empleados
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empleados
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/', auth, empleadoController.listar);



/**
 * @swagger
 * /empleados/{id}:
 *   get:
 *     summary: Obtener empleado por ID
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado encontrado correctamente
 *       404:
 *         description: Empleado no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/:id', auth, empleadoController.obtener);



/**
 * @swagger
 * /empleados:
 *   post:
 *     summary: Crear empleado
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos Pérez"
 *               puesto:
 *                 type: string
 *                 example: "Panadero"
 *               salario:
 *                 type: number
 *                 example: 8500
 *               fecha_contratacion:
 *                 type: string
 *                 example: "2026-07-16"
 *               telefono:
 *                 type: string
 *                 example: "4421234567"
 *     responses:
 *       201:
 *         description: Empleado creado correctamente
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.post('/', auth, empleadoController.crear);



/**
 * @swagger
 * /empleados/{id}:
 *   put:
 *     summary: Actualizar empleado
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Carlos Pérez"
 *               puesto:
 *                 type: string
 *                 example: "Encargado de producción"
 *               salario:
 *                 type: number
 *                 example: 9000
 *               telefono:
 *                 type: string
 *                 example: "4421234567"
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *       404:
 *         description: Empleado no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.put('/:id', auth, empleadoController.actualizar);



/**
 * @swagger
 * /empleados/{id}:
 *   delete:
 *     summary: Eliminar empleado
 *     tags: [Empleados]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente
 *       404:
 *         description: Empleado no encontrado
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.delete('/:id', auth, empleadoController.eliminar);



module.exports = router;