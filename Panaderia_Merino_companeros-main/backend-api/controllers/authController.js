const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Repartidor = require('../models/Repartidor');

const R = require('../utils/response');



// =====================================
// REGISTRO DE USUARIO
// POST /api/usuarios
// =====================================

exports.register = async (req, res) => {

    try {


        const {
            nombre,
            email,
            password,
            rol
        } = req.body;



        // Validar datos obligatorios

        if (!nombre || !email || !password) {

            return R.badRequest(
                res,
                'Nombre, correo y contraseña son requeridos'
            );

        }



        // Verificar correo existente

        const existeUsuario = await Usuario.findOne({

            where:{
                email
            }

        });



        if(existeUsuario){

            return R.badRequest(
                res,
                'El correo ya está registrado'
            );

        }




        // Encriptar contraseña

        const passwordHash = await bcrypt.hash(
            password,
            10
        );



        // Normalizar rol

        const rolUsuario = rol
        ? rol.toLowerCase()
        : 'cliente';



        // Validar roles permitidos

        if(
            ![
                'admin',
                'cliente',
                'repartidor'
            ].includes(rolUsuario)
        ){

            return R.badRequest(
                res,
                'Rol no válido'
            );

        }





        // Crear usuario principal

        const usuario = await Usuario.create({

            nombre,

            email,

            password:passwordHash,

            rol:rolUsuario,

            estado:true

        });






        // =====================================
        // CREACIÓN AUTOMÁTICA SEGÚN ROL
        // =====================================



        // Si es cliente

        if(usuario.rol === 'cliente'){


            await Cliente.create({

                id_usuario:usuario.id_usuario,

                telefono:null,

                direccion:null

            });


        }





        // Si es repartidor

        if(usuario.rol === 'repartidor'){


            await Repartidor.create({

                id_usuario:usuario.id_usuario,

                telefono:null,

                disponibilidad:'libre',

                ubicacion_actual_lat:null,

                ubicacion_actual_lng:null

            });


        }







        return res.status(201).json({

            success:true,

            message:'Usuario registrado exitosamente',

            data:{

                id_usuario:usuario.id_usuario,

                nombre:usuario.nombre,

                email:usuario.email,

                rol:usuario.rol,

                estado:usuario.estado,

                ultimo_acceso:usuario.ultimo_acceso,

                fecha_creacion:usuario.fecha_creacion

            }

        });





    }catch(error){


        console.error(
            'Error registro:',
            error
        );


        return responderFallbackRegistro(req, res);


    }


};









// =====================================
// LOGIN
// POST /api/auth/login
// =====================================


exports.login = async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;





        if(!email || !password){


            return R.badRequest(
                res,
                'Correo y contraseña son requeridos'
            );


        }





        // Buscar usuario


        const usuario = await Usuario.findOne({

            where:{
                email
            }

        });






        if(!usuario){


            return R.unauthorized(
                res,
                'Credenciales incorrectas'
            );


        }







        // Verificar estado


        if(!usuario.estado){


            return R.unauthorized(
                res,
                'Usuario deshabilitado'
            );


        }







        // Comparar contraseña


        const passwordValida =
        await bcrypt.compare(

            password,

            usuario.password

        );







        if(!passwordValida){


            return R.unauthorized(
                res,
                'Credenciales incorrectas'
            );


        }







        // Actualizar último acceso


        await Usuario.update(

            {

                ultimo_acceso:new Date()

            },

            {

                where:{

                    id_usuario:usuario.id_usuario

                }

            }

        );









        // Crear token JWT


        const token = jwt.sign(

            {

                id_usuario:usuario.id_usuario,

                email:usuario.email,

                rol:usuario.rol

            },


            process.env.JWT_SECRET,


            {

                expiresIn:
                process.env.JWT_EXPIRE || '8h'

            }


        );









        return res.json({


            success:true,


            message:'Inicio de sesión exitoso',



            data:{


                token,



                usuario:{


                    id_usuario:usuario.id_usuario,

                    nombre:usuario.nombre,

                    email:usuario.email,

                    rol:usuario.rol


                }


            }


        });







    }catch(error){



        console.error(
            'Error login:',
            error
        );



        return R.serverError(res);



    }



};