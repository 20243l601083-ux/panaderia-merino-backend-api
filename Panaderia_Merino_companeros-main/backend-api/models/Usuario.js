// models/Usuario.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Usuario = sequelize.define('Usuario', {


    // ID principal
    id_usuario: {

        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id_usuario'

    },


    // Nombre completo
    nombre: {

        type: DataTypes.STRING(100),
        allowNull: false,

        validate: {

            notEmpty:{
                msg:'El nombre no puede estar vacío'
            },

            len:{
                args:[2,100],
                msg:'El nombre debe tener entre 2 y 100 caracteres'
            }

        }

    },


    // Correo electrónico
    email: {

        type: DataTypes.STRING(100),
        allowNull:false,

        unique:{
            msg:'El correo ya está registrado'
        },

        validate:{

            isEmail:{
                msg:'El correo no tiene formato válido'
            }

        }

    },


    // Contraseña cifrada
    password: {

        type: DataTypes.STRING(255),
        allowNull:false

    },


    // Tipo de usuario
    rol: {

        type: DataTypes.STRING(30),
        allowNull:false,
        defaultValue:'cliente',

        validate:{

            isIn:{
                args:[
                    [
                        'admin',
                        'cliente',
                        'repartidor'
                    ]
                ],

                msg:'Rol no válido'
            }

        }

    },

    // Estado del usuario
    estado:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
        field:'estado'
    },

    // Último inicio de sesión
    ultimo_acceso: {

        type: DataTypes.DATE,
        allowNull:true

    },


    // Fecha creación
    fecha_creacion: {

        type: DataTypes.DATE,
        defaultValue:DataTypes.NOW

    }


},{

    tableName:'usuarios',

    schema:'public',

    timestamps:false

});


module.exports = Usuario;