 const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Pedido = sequelize.define('Pedido', {

    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_repartidor: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    estado: {
        type: DataTypes.STRING(30),
        defaultValue: 'pendiente'
    },

    total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },

    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: true
    },

    direccion_entrega: {
        type: DataTypes.TEXT,
        allowNull:true
    },

    fecha_pedido:{
        type:DataTypes.DATE,
        allowNull:true
    }

},{

    tableName:'pedidos',
    timestamps:false

});


module.exports = Pedido;