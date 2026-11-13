const Pedido = require('../models/Pedido');

const { 
    Op, 
    fn, 
    col 
} = require('sequelize');



// ===================================
// DASHBOARD ADMINISTRATIVO
// ===================================

exports.resumen = async (req, res) => {


    try {



        // ===============================
        // FECHAS
        // ===============================


        const ahora = new Date();



        const inicioDia = new Date();

        inicioDia.setHours(
            0,
            0,
            0,
            0
        );



        const finDia = new Date();

        finDia.setHours(
            23,
            59,
            59,
            999
        );



        const inicioMes = new Date(

            ahora.getFullYear(),

            ahora.getMonth(),

            1

        );





        // ===============================
        // VENTAS DEL DÍA
        // ===============================


        const ventasDia = await Pedido.sum(

            'total',

            {

                where: {

                    fecha_pedido: {

                        [Op.between]: [

                            inicioDia,

                            finDia

                        ]

                    }

                }

            }

        );





        // ===============================
        // PEDIDOS DEL DÍA
        // ===============================


        const pedidosDia = await Pedido.count({

            where: {

                fecha_pedido: {

                    [Op.between]: [

                        inicioDia,

                        finDia

                    ]

                }

            }

        });







        // ===============================
        // PEDIDOS PENDIENTES
        // ===============================


        const pedidosPendientes = await Pedido.count({

            where: {

                estado:'pendiente'

            }

        });






        // ===============================
        // PEDIDOS PREPARANDO
        // ===============================


        const pedidosPreparando = await Pedido.count({

            where: {

                estado:'preparando'

            }

        });







        // ===============================
        // INGRESOS DEL MES
        // ===============================


        const ingresosMes = await Pedido.sum(

            'total',

            {

                where: {

                    fecha_pedido: {

                        [Op.gte]: inicioMes

                    }

                }

            }

        );







        // ===============================
        // VENTAS MENSUALES
        // PARA GRÁFICA
        // ===============================


        const ventasMensuales = await Pedido.findAll({

            where:{},


            attributes:[


                [

                    fn(

                        'TRIM',

                        fn(

                            'TO_CHAR',

                            col('fecha_pedido'),

                            'Month'

                        )

                    ),

                    'mes'

                ],



                [

                    fn(

                        'SUM',

                        col('total')

                    ),

                    'total'

                ]

            ],



            group:[


                fn(

                    'TRIM',

                    fn(

                        'TO_CHAR',

                        col('fecha_pedido'),

                        'Month'

                    )

                )

            ],



            order:[


                [

                    fn(

                        'MIN',

                        col('fecha_pedido')

                    ),

                    'ASC'

                ]

            ]

        });







        // ===============================
        // PEDIDOS POR ESTADO
        // ===============================


        const estados = await Pedido.findAll({


            attributes:[


                'estado',


                [

                    fn(

                        'COUNT',

                        col('estado')

                    ),

                    'cantidad'

                ]

            ],



            group:[

                'estado'

            ]

        });







        // ===============================
        // RESPUESTA
        // ===============================


        res.json({


            success:true,


            data:{



                ventas_hoy:

                Number(

                    ventasDia || 0

                ).toFixed(2),




                pedidos_hoy:

                pedidosDia,




                pedidos_pendientes:

                pedidosPendientes,




                pedidos_preparando:

                pedidosPreparando,




                ingresos_mes:

                Number(

                    ingresosMes || 0

                ).toFixed(2),




                ventas_mensuales:

                ventasMensuales,




                estados:

                estados


            }


        });





    } catch(error){



        console.error(

            'Error dashboard:',

            error

        );



        res.status(500).json({


            success:false,


            mensaje:

            'Error al obtener dashboard',



            error:

            error.message


        });



    }



};