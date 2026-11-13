const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Repartidor = sequelize.define('Repartidor', {

    id_repartidor: {

        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },


    id_usuario: {

        type: DataTypes.INTEGER,
        allowNull:false,
        unique:true

    },


    telefono: {

        type: DataTypes.STRING(20),
        allowNull:true

    },


    disponibilidad: {

        type: DataTypes.STRING(20),
        defaultValue:'libre'

    },


    ubicacion_actual_lat: {

        type: DataTypes.DECIMAL(10,6),
        allowNull:true

    },


    ubicacion_actual_lng: {

        type: DataTypes.DECIMAL(10,6),
        allowNull:true

    }


},{

    tableName:'repartidores',

    timestamps:false

});


module.exports = Repartidor;