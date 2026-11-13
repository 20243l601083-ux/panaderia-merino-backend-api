const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');


// =====================================
// LISTAR CLIENTES
// =====================================

exports.listar = async (req, res) => {

    try {

        const clientes = await Cliente.findAll({

            include: [

                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: [
                        'id_usuario',
                        'nombre',
                        'email',
                        'rol',
                        'estado'
                    ]
                }

            ]

        });


        res.status(200).json({

            success: true,
            message: 'Clientes obtenidos correctamente',
            data: clientes

        });


    } catch (error) {

        console.error('ERROR LISTAR CLIENTES:', error);


        res.status(500).json({

            success:false,
            message:'Error al obtener clientes',
            error:error.message

        });

    }

};




// =====================================
// OBTENER CLIENTE POR ID
// =====================================

exports.obtener = async (req,res)=>{

    try{


        const {id}=req.params;


        const cliente = await Cliente.findByPk(id,{

            include:[

                {
                    model:Usuario,
                    as:'usuario',
                    attributes:[
                        'id_usuario',
                        'nombre',
                        'email',
                        'rol',
                        'estado'
                    ]
                }

            ]

        });



        if(!cliente){

            return res.status(404).json({

                success:false,
                message:'Cliente no encontrado'

            });

        }



        res.json({

            success:true,
            message:'Cliente encontrado correctamente',
            data:cliente

        });



    }catch(error){


        console.error('ERROR OBTENER CLIENTE:',error);


        res.status(500).json({

            success:false,
            message:'Error al obtener cliente',
            error:error.message

        });


    }

};




// =====================================
// ACTUALIZAR CLIENTE
// =====================================

exports.actualizar = async(req,res)=>{

    try{


        const {id}=req.params;


        const {
            telefono,
            direccion
        }=req.body;



        const cliente = await Cliente.findByPk(id);



        if(!cliente){

            return res.status(404).json({

                success:false,
                message:'Cliente no encontrado'

            });

        }



        await cliente.update({

            telefono,
            direccion

        });



        res.json({

            success:true,
            message:'Cliente actualizado correctamente',
            data:cliente

        });



    }catch(error){


        console.error('ERROR ACTUALIZAR CLIENTE:',error);


        res.status(500).json({

            success:false,
            message:'Error al actualizar cliente',
            error:error.message

        });


    }

};




// =====================================
// OBTENER CLIENTE POR ID USUARIO
// =====================================

exports.obtenerPorUsuario = async(req,res)=>{


    try{


        const {id_usuario}=req.params;



        const cliente = await Cliente.findOne({

            where:{
                id_usuario
            },


            include:[

                {
                    model:Usuario,
                    as:'usuario',
                    attributes:[
                        'id_usuario',
                        'nombre',
                        'email',
                        'rol',
                        'estado'
                    ]
                }

            ]

        });



        if(!cliente){


            return res.status(404).json({

                success:false,
                message:'Cliente no encontrado para este usuario'

            });


        }



        res.json({

            success:true,
            message:'Cliente obtenido correctamente',
            data:cliente

        });



    }catch(error){


        console.error('ERROR CLIENTE USUARIO:',error);


        res.status(500).json({

            success:false,
            message:'Error al obtener cliente',
            error:error.message

        });


    }


};




// =====================================
// ELIMINAR CLIENTE
// =====================================

exports.eliminar = async(req,res)=>{


    try{


        const {id}=req.params;



        const cliente = await Cliente.findByPk(id);



        if(!cliente){


            return res.status(404).json({

                success:false,
                message:'Cliente no encontrado'

            });


        }



        await cliente.destroy();



        res.json({

            success:true,
            message:'Cliente eliminado correctamente'

        });



    }catch(error){


        console.error('ERROR ELIMINAR CLIENTE:',error);


        res.status(500).json({

            success:false,
            message:'Error al eliminar cliente',
            error:error.message

        });


    }


};