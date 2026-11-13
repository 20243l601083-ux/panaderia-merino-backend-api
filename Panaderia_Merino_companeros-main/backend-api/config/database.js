const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: console.log,
  }
);


sequelize.authenticate()
.then(async () => {

    console.log("✅ Conexión correcta");

    const [db] = await sequelize.query(`
        SELECT current_database(), current_schema();
    `);

    console.log("Base y esquema:", db);


    const [columnas] = await sequelize.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'usuarios';
    `);

    console.log("Columnas vistas por Node:", columnas);

})
.catch(err => console.error(err));


module.exports = sequelize;