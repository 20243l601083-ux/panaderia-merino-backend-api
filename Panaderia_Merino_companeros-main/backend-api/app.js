const express = require('express');
const cors = require('cors');

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const repartidorRoutes = require('./routes/repartidorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

// Importar configuración de Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// Crear instancia de Express
const app = express();

// ── Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Ruta raíz de verificación
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST funcionando correctamente',
    version: '1.0.0',
    documentacion: '/api-docs'
  });
});

// ── Especificación OpenAPI en formato JSON
app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

// ── Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/repartidores', repartidorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/pagos', pagoRoutes);


// ── Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});


module.exports = app;