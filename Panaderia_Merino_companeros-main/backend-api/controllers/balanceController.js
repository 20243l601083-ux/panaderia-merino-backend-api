const Pedido = require('../models/Pedido');
const Gasto = require('../models/Gasto');


// =====================================
// OBTENER BALANCE GENERAL
// =====================================

exports.obtenerBalance = async (req, res) => {

    try {


        // ================================
        // TOTAL VENTAS ENTREGADAS
        // ================================

        const ventas = await Pedido.sum('total', {

            where: {

                estado: 'entregado'

            }

        });



        // ================================
        // TOTAL GASTOS
        // ================================

        const gastos = await Gasto.sum('monto');



        const totalVentas = Number(ventas || 0);

        const totalGastos = Number(gastos || 0);



        // ================================
        // GANANCIA
        // ================================

        const ganancias =
        totalVentas - totalGastos;




        // ================================
        // RESPUESTA
        // ================================

        res.status(200).json({

            success:true,

            message:"Balance obtenido correctamente",

            data:{


                ventas:
                totalVentas.toFixed(2),



                gastos:
                totalGastos.toFixed(2),



                ganancias:
                ganancias.toFixed(2)


            }


        });



    } catch(error){


        console.error(
            "Error balance:",
            error
        );


        res.status(500).json({

            success:false,

            message:"Error al obtener balance",

            error:error.message

        });


    }

};