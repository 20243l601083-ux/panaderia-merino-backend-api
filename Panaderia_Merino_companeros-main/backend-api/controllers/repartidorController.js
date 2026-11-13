const Repartidor = require('../models/Repartidor');
const Usuario = require('../models/Usuario');

exports.listar = async (req, res) => {

    try {

        const repartidores = await Repartidor.findAll({
            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: [
                    'id_usuario',
                    'nombre',
                    'email',
                    'rol',
                    'estado'
                ]
            }]
        });

        res.status(200).json({
            success: true,
            message: 'Repartidores obtenidos correctamente',
            data: repartidores
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


exports.obtener = async (req, res) => {

    try {

        const repartidor = await Repartidor.findByPk(req.params.id, {

            include: [{
                model: Usuario,
                as: 'usuario',
                attributes: [
                    'id_usuario',
                    'nombre',
                    'email',
                    'rol',
                    'estado'
                ]
            }]

        });

        if (!repartidor) {

            return res.status(404).json({
                success: false,
                message: 'Repartidor no encontrado'
            });

        }

        res.status(200).json({
            success: true,
            data: repartidor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


exports.crear = async (req, res) => {

    try {

        const repartidor = await Repartidor.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Repartidor creado correctamente',
            data: repartidor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


exports.actualizar = async (req, res) => {

    try {

        const repartidor = await Repartidor.findByPk(req.params.id);

        if (!repartidor) {

            return res.status(404).json({
                success: false,
                message: 'Repartidor no encontrado'
            });

        }

        await repartidor.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Repartidor actualizado correctamente',
            data: repartidor
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


exports.eliminar = async (req, res) => {

    try {

        const repartidor = await Repartidor.findByPk(req.params.id);

        if (!repartidor) {

            return res.status(404).json({
                success: false,
                message: 'Repartidor no encontrado'
            });

        }

        await repartidor.destroy();

        res.status(200).json({
            success: true,
            message: 'Repartidor eliminado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};