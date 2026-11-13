const Gasto = require('../models/Gasto');


// =====================================
// LISTAR GASTOS
// =====================================

exports.listarGastos = async (req, res) => {

    try {


        const gastos = await Gasto.findAll({

            order: [

                ['fecha_gasto', 'DESC']

            ]

        });



        res.status(200).json({

            success: true,

            data: gastos

        });



    } catch (error) {


        console.error(
            'Error obteniendo gastos:',
            error
        );


        res.status(500).json({

            success: false,

            mensaje: 'Error al obtener gastos',

            error: error.message

        });


    }

};





// =====================================
// CREAR GASTO
// =====================================

exports.crearGasto = async (req, res) => {

    try {


        const {

            descripcion,

            monto

        } = req.body;



        if (!descripcion || !monto) {


            return res.status(400).json({

                success:false,

                mensaje:'Descripción y monto son obligatorios'

            });


        }




        const nuevoGasto = await Gasto.create({

            descripcion,

            monto

        });





        res.status(201).json({

            success:true,

            mensaje:'Gasto registrado correctamente',

            data:nuevoGasto

        });




    } catch(error){



        console.error(
            'Error creando gasto:',
            error
        );



        res.status(500).json({

            success:false,

            mensaje:'Error al registrar gasto',

            error:error.message

        });



    }

};






// =====================================
// OBTENER GASTO POR ID
// =====================================

exports.obtenerGasto = async (req,res)=>{


    try{


        const gasto = await Gasto.findByPk(
            req.params.id
        );



        if(!gasto){


            return res.status(404).json({

                success:false,

                mensaje:'Gasto no encontrado'

            });


        }





        res.status(200).json({

            success:true,

            data:gasto

        });





    }catch(error){



        console.error(
            'Error obteniendo gasto:',
            error
        );



        res.status(500).json({

            success:false,

            mensaje:'Error al obtener gasto',

            error:error.message

        });



    }


};







// =====================================
// ACTUALIZAR GASTO
// =====================================

exports.actualizarGasto = async(req,res)=>{


    try{


        const gasto = await Gasto.findByPk(
            req.params.id
        );



        if(!gasto){


            return res.status(404).json({

                success:false,

                mensaje:'Gasto no encontrado'

            });


        }




        await gasto.update({

            descripcion:req.body.descripcion,

            monto:req.body.monto

        });






        res.status(200).json({

            success:true,

            mensaje:'Gasto actualizado correctamente',

            data:gasto

        });






    }catch(error){



        console.error(
            'Error actualizando gasto:',
            error
        );



        res.status(500).json({

            success:false,

            mensaje:'Error al actualizar gasto',

            error:error.message

        });



    }


};








// =====================================
// ELIMINAR GASTO
// =====================================

exports.eliminarGasto = async(req,res)=>{


    try{


        const gasto = await Gasto.findByPk(
            req.params.id
        );



        if(!gasto){


            return res.status(404).json({

                success:false,

                mensaje:'Gasto no encontrado'

            });


        }




        await gasto.destroy();





        res.status(200).json({

            success:true,

            mensaje:'Gasto eliminado correctamente'

        });






    }catch(error){



        console.error(
            'Error eliminando gasto:',
            error
        );



        res.status(500).json({

            success:false,

            mensaje:'Error al eliminar gasto',

            error:error.message

        });



    }


};