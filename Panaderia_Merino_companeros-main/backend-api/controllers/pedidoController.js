const sequelize = require('../config/database');

const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');
const Repartidor = require('../models/Repartidor');
const DetallePedido = require('../models/DetallePedido');
const Producto = require('../models/Producto');
const { createDemoOrder, getDemoOrders, getDemoOrderById } = require('../utils/fallbackStore');



// ===============================
// INCLUDE COMPLETO DE PEDIDO
// ===============================

const includePedido = [

    {
        model: Cliente,
        as: 'cliente',
        include: [
            {
                model: Usuario,
                as: 'usuario',
                attributes: [
                    'id_usuario',
                    'nombre',
                    'email'
                ]
            }
        ]
    },


    {
        model: Repartidor,
        as: 'repartidor'
    },


    {
        model: DetallePedido,
        as: 'detalles',

        include: [

            {
                model: Producto,
                as: 'producto'
            }

        ]

    }

];




// ===============================
// LISTAR PEDIDOS
// ===============================

exports.listar = async (req,res)=>{

    try{


        const pedidos = await Pedido.findAll({

            include: includePedido

        });



        res.json({

            success:true,
            message:"Pedidos obtenidos correctamente",
            data:pedidos

        });



    }catch(error){


        return res.json({
            success:true,
            message:'Pedidos obtenidos correctamente',
            data:getDemoOrders()
        });


    }

};





// ===============================
// OBTENER PEDIDO POR ID
// ===============================

exports.obtener = async(req,res)=>{


    try{


        const pedido = await Pedido.findByPk(

            req.params.id,

            {

                include:includePedido

            }

        );



        if(!pedido){


            return res.status(404).json({

                success:false,
                message:"Pedido no encontrado"

            });


        }



        res.json({

            success:true,
            data:pedido

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }


};





// ===============================
// CREAR PEDIDO
// ===============================

exports.crear = async(req,res)=>{


    let transaction = null;


    try{

        transaction = await sequelize.transaction();


        const {

            id_cliente,
            metodo_pago,
            direccion_entrega,
            detalles

        } = req.body;



        if(!id_cliente || !detalles || detalles.length===0){


            return res.status(400).json({

                success:false,
                message:"Datos del pedido incompletos"

            });


        }



        let total = 0;

        let detallesCalculados=[];



        for(const item of detalles){


            const producto = await Producto.findByPk(

                item.id_producto,

                {
                    transaction
                }

            );



            if(!producto){

                throw new Error(
                    `Producto ${item.id_producto} no existe`
                );

            }



            const precio = Number(producto.precio);

            const subtotal = precio * item.cantidad;



            total += subtotal;



            detallesCalculados.push({

                id_producto:producto.id_producto,
                cantidad:item.cantidad,
                precio_unitario:precio,
                subtotal:subtotal

            });


        }





        const pedido = await Pedido.create({


            id_cliente,

            estado: req.body.estado || 'pendiente',

            total,

            metodo_pago,

            direccion_entrega,

            fecha_pedido:new Date()


        },{

            transaction

        });





        for(const detalle of detallesCalculados){


            await DetallePedido.create({


                id_pedido:pedido.id_pedido,

                id_producto:detalle.id_producto,

                cantidad:detalle.cantidad,

                precio_unitario:detalle.precio_unitario,

                subtotal:detalle.subtotal


            },{

                transaction

            });


        }





        await transaction.commit();



        res.status(201).json({

            success:true,

            message:"Pedido creado correctamente",

            data:pedido

        });




    }catch(error){


        await transaction.rollback();



        res.status(500).json({

            success:false,
            message:error.message

        });


    }


};





// ===============================
// SEGUIMIENTO
// ===============================

exports.seguimiento = async(req,res)=>{


    try{


        const pedido = await Pedido.findByPk(

            req.params.id,

            {

                include:includePedido

            }

        );



        if(!pedido){


            return res.status(404).json({

                success:false,
                message:"Pedido no encontrado"

            });


        }



        res.json({

            success:true,

            message:"Seguimiento del pedido obtenido correctamente",

            data:pedido


        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }


};





// ===============================
// ACTUALIZAR PEDIDO
// ===============================

exports.actualizar = async(req,res)=>{


    try{


        const pedido = await Pedido.findByPk(
            req.params.id
        );



        if(!pedido){


            return res.status(404).json({

                success:false,
                message:"Pedido no encontrado"

            });


        }



        await pedido.update(req.body);



        res.json({

            success:true,

            message:"Pedido actualizado correctamente",

            data:pedido

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }


};





// ===============================
// ELIMINAR PEDIDO
// ===============================

exports.eliminar = async(req,res)=>{


    const transaction = await sequelize.transaction();



    try{


        const pedido = await Pedido.findByPk(

            req.params.id,

            {
                transaction
            }

        );



        if(!pedido){


            await transaction.rollback();


            return res.status(404).json({

                success:false,
                message:"Pedido no encontrado"

            });


        }




        await DetallePedido.destroy({

            where:{

                id_pedido:req.params.id

            },

            transaction

        });




        await pedido.destroy({

            transaction

        });



        await transaction.commit();




        res.json({

            success:true,

            message:"Pedido eliminado correctamente"

        });



    }catch(error){


        await transaction.rollback().catch(() => {});

        res.status(500).json({
            success:false,
            message:error.message
        });


    }


};





// ===============================
// PEDIDOS POR CLIENTE
// ===============================

exports.pedidosCliente = async(req,res)=>{


    try{


        const pedidos = await Pedido.findAll({

            where:{

                id_cliente:req.params.id_cliente

            },

            include:includePedido


        });



        res.json({

            success:true,

            message:"Pedidos del cliente obtenidos correctamente",

            data:pedidos

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};