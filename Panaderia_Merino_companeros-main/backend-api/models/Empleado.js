const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Empleado = sequelize.define('Empleado', {

    id_empleado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    puesto: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    salario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },

    fecha_contratacion: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    }

}, {

    tableName: 'empleados',
    timestamps: false

});


module.exports = Empleado;