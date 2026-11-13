const express = require('express');

const router = express.Router();

const pedidoController = require('../controllers/pedidoController');
const pagoController = require('../controllers/pagoController');

const auth = require('../middlewares/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos de la panadería
 */


// =======================================
// LISTAR TODOS LOS PEDIDOS
// =======================================

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Listar pedidos
 *     description: Obtiene todos los pedidos registrados con información del cliente, repartidor y productos incluidos.
 *     tags: [Pedidos]
 *
 *     security:
 *       - BearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida correctamente
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.get('/', auth, pedidoController.listar);


// =======================================
// CREAR PEDIDO
// =======================================

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear pedido
 *     description: Crea un pedido con sus productos. El sistema calcula automáticamente precio_unitario, subtotal y total.
 *
 *     tags: [Pedidos]
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
 *               - id_cliente
 *               - detalles
 *
 *             properties:
 *
 *               id_cliente:
 *                 type: integer
 *                 example: 2
 *                 description: ID del cliente que realiza el pedido
 *
 *               metodo_pago:
 *                 type: string
 *                 example: Efectivo
 *                 description: Método de pago seleccionado
 *
 *               direccion_entrega:
 *                 type: string
 *                 example: Córdoba Veracruz
 *                 description: Dirección donde se entregará el pedido
 *
 *               detalles:
 *                 type: array
 *                 description: Productos incluidos en el pedido
 *
 *                 items:
 *                   type: object
 *
 *                   properties:
 *
 *                     id_producto:
 *                       type: integer
 *                       example: 3
 *                       description: ID del producto
 *
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *                       description: Cantidad solicitada
 *
 *     responses:
 *
 *       201:
 *         description: Pedido creado correctamente
 *
 *       400:
 *         description: Datos del pedido incompletos
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.post('/', auth, pedidoController.crear);

// =======================================
// SEGUIMIENTO EN TIEMPO REAL
// =======================================

router.post('/seguimiento/:id/ubicacion', pagoController.actualizarUbicacion);
router.get('/seguimiento/:id/stream', pagoController.streamSeguimiento);

// =======================================
// OBTENER SEGUIMIENTO DEL PEDIDO
// =======================================

/**
 * @swagger
 * /pedidos/seguimiento/{id}:
 *   get:
 *     summary: Obtener seguimiento de un pedido
 *
 *     description: Obtiene la información completa de seguimiento de un pedido, incluyendo el estado actual, cliente, repartidor asignado, dirección de entrega y productos solicitados. Este endpoint será utilizado por la aplicación móvil para mostrar el seguimiento del pedido en tiempo real.
 *
 *     tags: [Pedidos]
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID del pedido
 *         example: 9
 *
 *     responses:
 *
 *       200:
 *         description: Seguimiento del pedido obtenido correctamente
 *
 *       404:
 *         description: Pedido no encontrado
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.get('/seguimiento/:id', pedidoController.seguimiento);


// =======================================
// PEDIDOS POR CLIENTE
// =======================================

/**
 * @swagger
 * /pedidos/cliente/{id_cliente}:
 *   get:
 *     summary: Obtener pedidos de un cliente
 *
 *     description: Obtiene todos los pedidos realizados por un cliente específico incluyendo productos y detalles.
 *
 *     tags: [Pedidos]
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id_cliente
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID del cliente
 *
 *     responses:
 *
 *       200:
 *         description: Pedidos del cliente obtenidos correctamente
 *
 *       404:
 *         description: El cliente no tiene pedidos registrados
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.get('/cliente/:id_cliente', auth, pedidoController.pedidosCliente);


// =======================================
// OBTENER PEDIDO POR ID
// =======================================

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Obtener pedido por ID
 *
 *     description: Obtiene un pedido específico con cliente, repartidor y productos asociados.
 *
 *     tags: [Pedidos]
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID del pedido
 *
 *     responses:
 *
 *       200:
 *         description: Pedido encontrado correctamente
 *
 *       404:
 *         description: Pedido no encontrado
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.get('/:id', auth, pedidoController.obtener);


// =======================================
// ACTUALIZAR PEDIDO
// =======================================

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Actualizar pedido
 *
 *     description: Actualiza información del pedido como estado, repartidor asignado, método de pago o dirección.
 *
 *     tags: [Pedidos]
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID del pedido
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
 *             properties:
 *
 *               id_repartidor:
 *                 type: integer
 *                 example: 1
 *
 *               estado:
 *                 type: string
 *                 example: preparando
 *
 *               metodo_pago:
 *                 type: string
 *                 example: Efectivo
 *
 *               direccion_entrega:
 *                 type: string
 *                 example: Córdoba Veracruz
 *
 *     responses:
 *
 *       200:
 *         description: Pedido actualizado correctamente
 *
 *       404:
 *         description: Pedido no encontrado
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.put('/:id', auth, pedidoController.actualizar);


// =======================================
// ELIMINAR PEDIDO
// =======================================

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Eliminar pedido
 *
 *     description: Elimina un pedido registrado del sistema.
 *
 *     tags: [Pedidos]
 *
 *     security:
 *       - BearerAuth: []
 *
 *     parameters:
 *
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID del pedido
 *
 *     responses:
 *
 *       200:
 *         description: Pedido eliminado correctamente
 *
 *       404:
 *         description: Pedido no encontrado
 *
 *       401:
 *         description: Token inválido o no proporcionado
 */

router.delete('/:id', auth, pedidoController.eliminar);

module.exports = router;