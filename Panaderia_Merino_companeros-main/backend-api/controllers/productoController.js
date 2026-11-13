const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');

const productosPorDefecto = [
    { id_categoria: 1, nombre: 'Concha de vainilla', descripcion: 'Pan dulce tradicional', precio: 18, stock: 50, estado: true },
    { id_categoria: 1, nombre: 'Mantecada tradicional', descripcion: 'Pan dulce suave', precio: 20, stock: 40, estado: true },
    { id_categoria: 1, nombre: 'Bolillo suave', descripcion: 'Bolillo artesanal', precio: 16, stock: 60, estado: true },
    { id_categoria: 1, nombre: 'Cuernito crujiente', descripcion: 'Cuernito de mantequilla', precio: 22, stock: 35, estado: true },
    { id_categoria: 1, nombre: 'Oreja de azúcar', descripcion: 'Oreja hojaldrada', precio: 19, stock: 30, estado: true },
    { id_categoria: 1, nombre: 'Dona azucarada', descripcion: 'Dona fresca', precio: 24, stock: 25, estado: true },
    { id_categoria: 1, nombre: 'Pan de muerto', descripcion: 'Pan típico para temporada', precio: 28, stock: 20, estado: true },
    { id_categoria: 1, nombre: 'Pan de queso', descripcion: 'Pan con queso derretido', precio: 26, stock: 22, estado: true },
    { id_categoria: 1, nombre: 'Hojaldra', descripcion: 'Hojaldra de manteca', precio: 21, stock: 18, estado: true },
    { id_categoria: 1, nombre: 'Barquillo', descripcion: 'Barquillo crujiente', precio: 17, stock: 24, estado: true },
    { id_categoria: 1, nombre: 'Brioche', descripcion: 'Pan suave de mantequilla', precio: 30, stock: 15, estado: true },
    { id_categoria: 1, nombre: 'Telera', descripcion: 'Pan clásico para tortas', precio: 18, stock: 28, estado: true },
    { id_categoria: 1, nombre: 'Pan dulce de chocolate', descripcion: 'Pan con cobertura de chocolate', precio: 25, stock: 18, estado: true },
    { id_categoria: 1, nombre: 'Rosca de Reyes', descripcion: 'Rosca tradicional', precio: 35, stock: 12, estado: true },
    { id_categoria: 1, nombre: 'Concha de chocolate', descripcion: 'Concha con cobertura de chocolate', precio: 22, stock: 20, estado: true },
    { id_categoria: 1, nombre: 'Rebanada de pan', descripcion: 'Pan de caja para desayuno', precio: 15, stock: 45, estado: true },
    { id_categoria: 1, nombre: 'Pan integral', descripcion: 'Pan con granos y semillas', precio: 24, stock: 16, estado: true },
    { id_categoria: 1, nombre: 'Birote', descripcion: 'Pan blando tradicional', precio: 19, stock: 26, estado: true },
    { id_categoria: 1, nombre: 'Concha de fresa', descripcion: 'Concha con sabor a fresa', precio: 21, stock: 14, estado: true },
    { id_categoria: 1, nombre: 'Muffin de pan', descripcion: 'Muffin con textura de pan', precio: 23, stock: 17, estado: true }
];



// LISTAR PRODUCTOS
exports.listar = async (req, res) => {

    try {

        const productos = await Producto.findAll({

            where: {
                estado: true
            },

            include: [
                {
                    model: Categoria,
                    as: 'categoria'
                }
            ],

            order: [
                ['id_producto', 'ASC']
            ]

        });

        res.status(200).json({

            success: true,
            message: "Productos obtenidos correctamente",
            data: productos

        });

    } catch (error) {

        console.error("ERROR LISTAR PRODUCTOS:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// OBTENER PRODUCTO POR ID

exports.obtener = async(req,res)=>{


    try{


        const producto = await Producto.findByPk(
            req.params.id,
            {

                include:[
                    {
                        model:Categoria,
                        as:'categoria'
                    }
                ]

            }
        );


        if(!producto){

            return res.status(404).json({

                success:false,
                message:"Producto no encontrado"

            });

        }


        res.json({

            success:true,
            data:producto

        });


    } catch (error) {

        console.error("ERROR OBTENER PRODUCTO:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });
    }
};

// CREAR PRODUCTO

exports.crear = async(req,res)=>{


    try{


        const producto = await Producto.create(req.body);



        res.status(201).json({

            success:true,
            message:"Producto creado correctamente",
            data:producto

        });



    } catch (error) {

        console.error("ERROR CREAR PRODUCTO:", error);

        res.status(500).json({

            success:false,
            message:error.message

        });


    }


};

// ACTUALIZAR PRODUCTO

exports.actualizar = async(req,res)=>{


    try{


        const producto = await Producto.findByPk(req.params.id);



        if(!producto){


            return res.status(404).json({

                success:false,
                message:"Producto no encontrado"

            });


        }



        await producto.update(req.body);



        res.json({

            success:true,
            message:"Producto actualizado correctamente",
            data:producto

        });

   } catch (error) {

        console.error("ERROR ACTUALIZAR PRODUCTO:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });
    }
};


// ELIMINAR PRODUCTO (DESACTIVAR)

exports.eliminar = async(req,res)=>{


    try{


        const producto = await Producto.findByPk(req.params.id);



        if(!producto){


            return res.status(404).json({

                success:false,
                message:"Producto no encontrado"

            });


        }



        await producto.update({

            estado:false

        });



        res.json({

            success:true,
            message:"Producto desactivado correctamente"

        });



 } catch (error) {

        console.error("ERROR ELIMINAR PRODUCTO:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });
    }
};