const test = require('node:test');
const assert = require('node:assert/strict');

const { createDemoOrder, getDemoOrders } = require('../utils/fallbackStore');

test('createDemoOrder guarda un pedido demo y lo devuelve', () => {
  const initialLength = getDemoOrders().length;

  const order = createDemoOrder({
    id_cliente: 1,
    metodo_pago: 'Efectivo',
    direccion_entrega: 'Calle Demo 123',
    detalles: [{ id_producto: 1, cantidad: 2 }]
  });

  assert.ok(order.id_pedido);
  assert.equal(order.id_cliente, 1);
  assert.equal(order.estado, 'pendiente');
  assert.equal(getDemoOrders().length, initialLength + 1);
  assert.ok(getDemoOrders().some(item => item.id_pedido === order.id_pedido));
});
