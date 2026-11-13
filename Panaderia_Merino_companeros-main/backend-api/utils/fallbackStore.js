const jwt = require('jsonwebtoken');

const demoOrders = [];
let orderCounter = 1000;

function createDemoToken(user) {
    const secret = process.env.JWT_SECRET || 'demo-secret';

    return jwt.sign(
        {
            id_usuario: user.id_usuario,
            email: user.email,
            rol: user.rol,
            demo: true
        },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRE || '8h'
        }
    );
}

function getDemoUser(email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const role = normalizedEmail.includes('admin')
        ? 'admin'
        : normalizedEmail.includes('repartidor')
            ? 'repartidor'
            : 'cliente';

    const displayName = role === 'admin'
        ? 'Admin Demo'
        : role === 'repartidor'
            ? 'Repartidor Demo'
            : 'Cliente Demo';

    return {
        id_usuario: role === 'admin' ? 2 : role === 'repartidor' ? 3 : 1,
        nombre: displayName,
        email: normalizedEmail || 'cliente@demo.com',
        rol: role,
        estado: true
    };
}

function createDemoOrder(payload = {}) {
    const details = Array.isArray(payload.detalles) ? payload.detalles : [];
    const computedTotal = Number(payload.total || details.reduce((sum, item) => sum + Number(item.cantidad || 0) * Number(item.precio_unitario || 0), 0));

    const order = {
        id_pedido: ++orderCounter,
        id_cliente: Number(payload.id_cliente || 1),
        estado: 'pendiente',
        total: computedTotal || 0,
        metodo_pago: payload.metodo_pago || 'Efectivo',
        direccion_entrega: payload.direccion_entrega || 'Sin dirección',
        fecha_pedido: new Date().toISOString(),
        detalles: details.map((detalle, index) => ({
            id_detalle_pedido: orderCounter * 10 + index,
            ...detalle
        }))
    };

    demoOrders.push(order);
    return order;
}

function getDemoOrders() {
    return demoOrders;
}

function getDemoOrderById(id) {
    return demoOrders.find((order) => String(order.id_pedido) === String(id));
}

function updateDemoOrder(id, changes = {}) {
    const item = getDemoOrderById(id);
    if (!item) {
        return null;
    }

    Object.assign(item, changes);
    return item;
}

module.exports = {
    createDemoToken,
    getDemoUser,
    createDemoOrder,
    getDemoOrders,
    getDemoOrderById,
    updateDemoOrder
};
