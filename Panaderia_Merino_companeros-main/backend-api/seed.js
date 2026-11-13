const sequelize = require('./config/database');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'sql', 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Dividir el SQL en queries individuales (separadas por ;)
    const queries = sql
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0);

    // Ejecutar cada query
    for (const query of queries) {
      console.log(`Ejecutando: ${query.substring(0, 50)}...`);
      await sequelize.query(query);
    }

    console.log('✅ Base de datos alimentada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al alimentar la base de datos:', error.message);
    process.exit(1);
  }
}

seedDatabase();
