const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const Repartidor = require('../models/Repartidor');

const { validationResult } = require('express-validator');
const R = require('../utils/response');


// POST /api/usuarios
exports.registrar = async (req, res) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                errors: errors.array()
            });

        }


        const {
            nombre,
            email,
            password,
            rol
        } = req.body;



        // Verificar correo duplicado

        const existe = await Usuario.findOne({

            where:{
                email
            }

        });


        if(existe){

            return R.conflict(
                res,
                'El correo ya está registrado'
            );

        }



        // Encriptar contraseña

        const hash = await bcrypt.hash(
            password,
            10
        );



        // Crear usuario

        const nuevo = await Usuario.create({

            nombre,

            email,

            password:hash,

            rol: rol || 'cliente',

            estado:true

        });



        // Crear perfil automáticamente según rol


        // CLIENTE

        if((rol || 'cliente') === 'cliente'){


            await Cliente.create({

                id_usuario:nuevo.id_usuario,

                telefono:'',

                direccion:''

            });


        }



        // REPARTIDOR

        if((rol || 'cliente') === 'repartidor'){


            await Repartidor.create({

                id_usuario:nuevo.id_usuario,

                telefono:'',

                disponibilidad:'libre',

                ubicacion_actual_lat:null,

                ubicacion_actual_lng:null

            });


        }




        // Ocultar contraseña

        const {

            password:_,

            ...datos

        } = nuevo.toJSON();



        return R.created(

            res,

            datos,

            'Usuario registrado exitosamente'

        );



    }catch(error){


        console.error(
            'ERROR REGISTRAR:',
            error
        );


        return res.status(500).json({

            success:false,

            error:error.message

        });


    }

};





// GET /api/usuarios

exports.listar = async(req,res)=>{


    try{


        const usuarios = await Usuario.findAll({

            attributes:{
                exclude:['password']
            }

        });



        return R.ok(

            res,

            usuarios

        );



    }catch(error){


        console.error(
            'Error listar usuarios:',
            error
        );


        return R.serverError(res);


    }


};





// GET /api/usuarios/:id

exports.obtener = async(req,res)=>{


    try{


        const usuario = await Usuario.findByPk(

            req.params.id,

            {

                attributes:{
                    exclude:['password']
                }

            }

        );



        if(!usuario){


            return R.notFound(

                res,

                'Usuario no encontrado'

            );


        }



        return R.ok(

            res,

            usuario

        );



    }catch(error){


        console.error(
            'Error obtener usuario:',
            error
        );


        return R.serverError(res);


    }


};





// PUT /api/usuarios/:id

exports.actualizar = async(req,res)=>{


    try{


        const errors = validationResult(req);



        if(!errors.isEmpty()){


            return res.status(400).json({

                success:false,

                errors:errors.array()

            });


        }



        const usuario = await Usuario.findByPk(

            req.params.id

        );



        if(!usuario){


            return R.notFound(

                res,

                'Usuario no encontrado'

            );


        }



        const {

            nombre,

            email,

            password,

            rol,

            estado

        } = req.body;



        const datos = {

            nombre,

            email,

            rol,

            estado

        };



        if(password){


            datos.password = await bcrypt.hash(

                password,

                10

            );


        }



        await usuario.update(datos);



        const {

            password:_,

            ...actualizado

        } = usuario.toJSON();



        return R.ok(

            res,

            actualizado,

            'Usuario actualizado exitosamente'

        );



    }catch(error){


        console.error(
            'Error actualizar:',
            error
        );


        return R.serverError(res);


    }


};





// DELETE /api/usuarios/:id

exports.eliminar = async(req,res)=>{


    try{


        const usuario = await Usuario.findByPk(

            req.params.id

        );



        if(!usuario){


            return R.notFound(

                res,

                'Usuario no encontrado'

            );


        }



        await usuario.destroy();



        return R.ok(

            res,

            null,

            'Usuario eliminado exitosamente'

        );



    }catch(error){


        console.error(
            'Error eliminar:',
            error
        );


        return R.serverError(res);


    }


};