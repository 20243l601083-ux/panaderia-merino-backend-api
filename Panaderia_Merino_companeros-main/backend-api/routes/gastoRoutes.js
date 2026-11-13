const express = require('express');

const router = express.Router();

const gastoController = require('../controllers/gastoController');


// Middleware seguridad
const verifyToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');



/**
 * @swagger
 * tags:
 *   name: Gastos
 *   description: Administración de gastos de la panadería
 */



/**
 * @swagger
 * /gastos:
 *   get:
 *     summary: Listar gastos registrados
 *     description: |
 *       Obtiene todos los gastos registrados en el sistema.
 *
 *       Este endpoint solamente está disponible para administradores.
 *
 *     tags:
 *       - Gastos
 *
 *     security:
 *       - BearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Lista de gastos obtenida correctamente
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *               items:
 *                 type: object
 *
 *                 properties:
 *
 *                   id_gasto:
 *                     type: integer
 *                     example: 1
 *
 *                   descripcion:
 *                     type: string
 *                     example: Compra de harina
 *
 *                   monto:
 *                     type: number
 *                     example: 500
 *
 *                   fecha_gasto:
 *                     type: string
 *                     example: 2026-07-17
 *
 *       401:
 *         description: Token no proporcionado o inválido
 *
 *       403:
 *         description: Usuario sin permisos de administrador
 *
 */


router.get('/', verifyToken,checkRole('admin'),gastoController.listarGastos);

/**
 * @swagger
 * /gastos:
 *   post:
 *     summary: Registrar un nuevo gasto
 *
 *     description: |
 *       Permite al administrador registrar un gasto.
 *
 *     tags:
 *       - Gastos
 *
 *     security:
 *       - BearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - descripcion
 *               - monto
 *
 *             properties:
 *
 *               descripcion:
 *                 type: string
 *                 example: Compra de ingredientes
 *
 *               monto:
 *                 type: number
 *                 example: 1500
 *
 *
 *     responses:
 *
 *       201:
 *         description: Gasto creado correctamente
 *
 *       401:
 *         description: Token inválido
 *
 *       403:
 *         description: Solo administradores pueden crear gastos
 *
 */


router.post('/',verifyToken,checkRole('admin'),gastoController.crearGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   get:
 *     summary: Obtener gasto por ID
 *
 *     tags:
 *       - Gastos
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *
 *
 *     responses:
 *
 *       200:
 *         description: Gasto encontrado
 *
 *       404:
 *         description: Gasto no encontrado
 *
 */


router.get('/:id',verifyToken,checkRole('admin'),gastoController.obtenerGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   put:
 *     summary: Actualizar gasto
 *
 *     tags:
 *       - Gastos
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               descripcion:
 *                 type: string
 *
 *               monto:
 *                 type: number
 *
 *
 *     responses:
 *
 *       200:
 *         description: Gasto actualizado correctamente
 *
 */


router.put('/:id',verifyToken,checkRole('admin'),gastoController.actualizarGasto);

/**
 * @swagger
 * /gastos/{id}:
 *   delete:
 *     summary: Eliminar gasto
 *
 *     tags:
 *       - Gastos
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *
 *
 *     responses:
 *
 *       200:
 *         description: Gasto eliminado correctamente
 *
 *       404:
 *         description: Gasto no encontrado
 *
 */


router.delete('/:id',verifyToken,checkRole('admin'),gastoController.eliminarGasto);

module.exports = router;