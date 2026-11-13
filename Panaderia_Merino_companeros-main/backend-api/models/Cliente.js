const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Cliente = sequelize.define('Cliente', {

    id_cliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },


    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },


    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },


    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },


    puntos_fidelidad: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

}, 
{
    tableName: 'clientes',
    timestamps: false
});


module.exports = Cliente;