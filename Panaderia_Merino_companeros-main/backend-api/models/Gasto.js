const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Gasto = sequelize.define('Gasto', {

    id_gasto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },


    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },


    monto: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },


    fecha_gasto: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }


}, {

    tableName: 'gastos',

    timestamps: false

});


module.exports = Gasto;