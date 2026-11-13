const Categoria = require('../models/Categoria');


// LISTAR CATEGORÍAS
exports.listar = async(req,res)=>{

    try{

        const categorias = await Categoria.findAll();

        res.json({
            success:true,
            data:categorias
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



// OBTENER POR ID
exports.obtener = async(req,res)=>{

    try{

        const categoria = await Categoria.findByPk(req.params.id);


        if(!categoria){

            return res.status(404).json({
                success:false,
                message:"Categoría no encontrada"
            });

        }


        res.json({
            success:true,
            data:categoria
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};




// CREAR CATEGORÍA
exports.crear = async(req,res)=>{

    try{

        const categoria = await Categoria.create(req.body);


        res.status(201).json({

            success:true,
            message:"Categoría creada correctamente",
            data:categoria

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};




// ACTUALIZAR
exports.actualizar = async(req,res)=>{

    try{

        const categoria = await Categoria.findByPk(req.params.id);


        if(!categoria){

            return res.status(404).json({
                success:false,
                message:"Categoría no encontrada"
            });

        }


        await categoria.update(req.body);


        res.json({

            success:true,
            message:"Categoría actualizada",
            data:categoria

        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};




// ELIMINAR
exports.eliminar = async(req,res)=>{

    try{

        const categoria = await Categoria.findByPk(req.params.id);


        if(!categoria){

            return res.status(404).json({
                success:false,
                message:"Categoría no encontrada"
            });

        }


        await categoria.destroy();


        res.json({

            success:true,
            message:"Categoría eliminada"

        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};