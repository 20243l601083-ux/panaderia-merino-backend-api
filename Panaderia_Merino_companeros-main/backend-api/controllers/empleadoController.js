const Empleado = require('../models/Empleado');


// Listar empleados
exports.listar = async (req, res) => {

    try {

        const empleados = await Empleado.findAll();


        res.json({

            success: true,
            message: "Empleados obtenidos correctamente",
            data: empleados

        });


    } catch(error) {

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// Obtener empleado por ID
exports.obtener = async(req,res)=>{

    try{

        const empleado = await Empleado.findByPk(req.params.id);


        if(!empleado){

            return res.status(404).json({

                success:false,
                message:"Empleado no encontrado"

            });

        }


        res.json({

            success:true,
            message:"Empleado encontrado correctamente",
            data:empleado

        });



    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// Crear empleado
exports.crear = async(req,res)=>{

    try{

        const empleado = await Empleado.create(req.body);


        res.status(201).json({

            success:true,
            message:"Empleado creado correctamente",
            data:empleado

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};





// Actualizar empleado
exports.actualizar = async(req,res)=>{

    try{


        const empleado = await Empleado.findByPk(req.params.id);


        if(!empleado){

            return res.status(404).json({

                success:false,
                message:"Empleado no encontrado"

            });

        }


        await empleado.update(req.body);



        res.json({

            success:true,
            message:"Empleado actualizado correctamente",
            data:empleado

        });



    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};






// Eliminar empleado
exports.eliminar = async(req,res)=>{


    try{


        const empleado = await Empleado.findByPk(req.params.id);



        if(!empleado){

            return res.status(404).json({

                success:false,
                message:"Empleado no encontrado"

            });

        }



        await empleado.destroy();



        res.json({

            success:true,
            message:"Empleado eliminado correctamente"

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};