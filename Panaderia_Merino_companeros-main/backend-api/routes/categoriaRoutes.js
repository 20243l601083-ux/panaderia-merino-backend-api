const express = require('express');

const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

const auth = require('../middlewares/authMiddleware');



/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gestión de categorías de productos de la panadería
 */


/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar categorías
 *     tags: [Categorias]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/',auth,categoriaController.listar);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/:id',auth,categoriaController.obtener);

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Crear categoría
 *     tags: [Categorias]
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
 *                 example: Pan dulce
 *               descripcion:
 *                 type: string
 *                 example: Conchas, donas, cuernitos y panqués
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.post('/',auth,categoriaController.crear);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Pan salado
 *               descripcion:
 *                 type: string
 *                 example: Bolillos y teleras
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.put('/:id',auth,categoriaController.actualizar);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Eliminar categoría
 *     tags: [Categorias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.delete('/:id',auth,categoriaController.eliminar);

module.exports = router;