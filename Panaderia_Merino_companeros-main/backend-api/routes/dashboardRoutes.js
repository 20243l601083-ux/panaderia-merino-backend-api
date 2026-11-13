const express = require('express');
const router = express.Router();


const verifyToken = require('../middlewares/authMiddleware');

const dashboardController = require('../controllers/dashboardController');



/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints del panel administrativo
 */


/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obtener resumen del dashboard administrativo
 *     description: Retorna ventas del día, cantidad de pedidos y estados de pedidos.
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen del dashboard obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     ventas_hoy:
 *                       type: number
 *                       example: 2500
 *                     pedidos_hoy:
 *                       type: integer
 *                       example: 10
 *                     estados:
 *                       type: array
 *       401:
 *         description: Token no proporcionado o inválido
 */



router.get('/',verifyToken,dashboardController.resumen);



module.exports = router;