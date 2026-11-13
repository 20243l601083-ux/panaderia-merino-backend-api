require('dotenv').config();
console.log("JWT configurado:", process.env.JWT_SECRET);
console.log("Expiración:", process.env.JWT_EXPIRE);

require('./models');

const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {

        await sequelize.authenticate();

        console.log('✅ Conexión a PostgreSQL establecida.');

    } catch (error) {

        console.warn('⚠️ No fue posible conectar a PostgreSQL, continuando en modo demo:', error.message);

    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
        console.log(`📚 Documentación: http://0.0.0.0:${PORT}/api-docs`);
        console.log(`🌐 Accesible desde la red en http://<TU_IP>:${PORT}`);
    });
}

iniciarServidor();
