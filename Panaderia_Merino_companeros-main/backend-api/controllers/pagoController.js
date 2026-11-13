const trackingStore = new Map();
const trackingSubscribers = new Map();
const Pedido = require('../models/Pedido');

function broadcastTracking(pedidoId, payload) {
    const subscribers = trackingSubscribers.get(pedidoId) || [];
    const event = `data: ${JSON.stringify(payload)}\n\n`;

    subscribers.forEach((subscriber) => {
        try {
            subscriber.write(event);
        } catch (error) {
            console.error('No se pudo enviar seguimiento SSE:', error.message);
        }
    });
}

function getTrackingSnapshot(pedidoId) {
    const state = trackingStore.get(pedidoId);

    if (!state) {
        return {
            pedidoId,
            estado: 'pendiente',
            progress: 0,
            currentLocation: { lat: 19.0438, lng: -98.1983 },
            destination: { lat: 19.0444, lng: -98.1987 },
            driverName: 'Carlos López',
            lastUpdated: new Date().toISOString()
        };
    }

    return state;
}

exports.actualizarUbicacion = (req, res) => {
    const { lat, lng, estado, driverName } = req.body;
    const pedidoId = req.params.id;

    const snapshot = {
        pedidoId,
        estado: estado || 'en_ruta',
        driverName: driverName || 'Carlos López',
        currentLocation: {
            lat: Number(lat),
            lng: Number(lng)
        },
        destination: { lat: 19.0444, lng: -98.1987 },
        progress: Number.isFinite(Number(req.body.progress)) ? Number(req.body.progress) : 0,
        lastUpdated: new Date().toISOString()
    };

    trackingStore.set(pedidoId, snapshot);
    broadcastTracking(pedidoId, snapshot);

    res.json({
        success: true,
        message: 'Ubicación actualizada correctamente',
        data: snapshot
    });
};

exports.obtenerSeguimientoRealtime = (req, res) => {
    const pedidoId = req.params.id;
    const snapshot = getTrackingSnapshot(pedidoId);

    res.json({
        success: true,
        data: snapshot
    });
};

exports.streamSeguimiento = (req, res) => {
    const pedidoId = req.params.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const subscribers = trackingSubscribers.get(pedidoId) || [];
    subscribers.push(res);
    trackingSubscribers.set(pedidoId, subscribers);

    const initialSnapshot = getTrackingSnapshot(pedidoId);
    res.write(`data: ${JSON.stringify({ type: 'connected', data: initialSnapshot })}\n\n`);

    req.on('close', () => {
        const remaining = (trackingSubscribers.get(pedidoId) || []).filter((subscriber) => subscriber !== res);
        if (remaining.length > 0) {
            trackingSubscribers.set(pedidoId, remaining);
        } else {
            trackingSubscribers.delete(pedidoId);
        }
    });
};

exports.crearPreferencia = async (req, res) => {
    const { title, description, amount, external_reference } = req.body;

    if (!amount) {
        return res.status(400).json({ success: false, message: 'El monto es obligatorio.' });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
        return res.json({
            success: true,
            message: 'Mercado Pago no configurado, se devolvió una preferencia de demostración.',
            data: {
                init_point: 'https://www.mercadopago.com/mla/checkout/start?pref_id=demo-merino',
                external_reference: external_reference || `demo-${Date.now()}`,
                sandbox: true
            }
        });
    }

    try {
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    {
                        title: title || 'Pedido Panadería Merino',
                        description: description || 'Pago de pedido',
                        quantity: 1,
                        currency_id: 'MXN',
                        unit_price: Number(amount)
                    }
                ],
                back_urls: {
                    success: 'http://localhost:4200/exito',
                    failure: 'http://localhost:4200/pago',
                    pending: 'http://localhost:4200/pago'
                },
                auto_return: 'approved',
                external_reference: external_reference || `pedido-${Date.now()}`
            })
        });

        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.message || 'No fue posible crear la preferencia.');
        }

        res.json({
            success: true,
            message: 'Preferencia de Mercado Pago creada correctamente.',
            data: payload
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.confirmarPago = async (req, res) => {
    const pedidoId = req.params.id;

    try {
        const pedido = await Pedido.findByPk(pedidoId);

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        await pedido.update({ estado: 'pagado' });

        res.json({
            success: true,
            message: 'Pago confirmado correctamente',
            data: pedido
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.webhookMercadoPago = async (req, res) => {
    const { type, data } = req.body || {};

    if (type === 'payment' && data?.id) {
        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

        if (accessToken) {
            try {
                const response = await fetch(
                    `https://api.mercadopago.com/v1/payments/${data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );

                const payment = await response.json();

                if (payment.status === 'approved' && payment.external_reference) {
                    const pedido = await Pedido.findByPk(payment.external_reference);

                    if (pedido) {
                        await pedido.update({ estado: 'pagado' });
                    }
                }
            } catch (error) {
                console.error('Error procesando webhook de Mercado Pago:', error.message);
            }
        }
    }

    res.status(200).send('OK');
};
