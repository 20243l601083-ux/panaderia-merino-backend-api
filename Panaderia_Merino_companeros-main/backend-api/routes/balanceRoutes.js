const express = require('express');

const router = express.Router();

const balanceController = require('../controllers/balanceController');


// Middleware de autenticación y roles
const verifyToken = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');



/**
 * @swagger
 * tags:
 *   name: Balance
 *   description: Endpoints para consultar información financiera de la panadería
 */


/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Obtener balance general
 *     description: |
 *       Obtiene ventas, gastos y ganancias de la panadería.
 *       Disponible únicamente para administradores.
 *
 *     tags:
 *       - Balance
 *
 *     security:
 *       - BearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Balance obtenido correctamente
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *               properties:
 *
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: "Balance obtenido correctamente"
 *
 *                 data:
 *                   type: object
 *
 *                   properties:
 *
 *                     ventas:
 *                       type: string
 *                       example: "25000.00"
 *
 *                     gastos:
 *                       type: string
 *                       example: "5000.00"
 *
 *                     ganancias:
 *                       type: string
 *                       example: "20000.00"
 *
 *
 *       401:
 *         description: Token inválido o no proporcionado
 *
 *       403:
 *         description: Usuario sin permisos de administrador
 *
 *       500:
 *         description: Error interno del servidor
 */

// Obtener balance financiero
router.get(
    '/',
    verifyToken,
    checkRole('admin'),
    balanceController.obtenerBalance
);



module.exports = router;