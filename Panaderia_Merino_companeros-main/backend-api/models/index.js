const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const Repartidor = require('./Repartidor');

const Pedido = require('./Pedido');
const Producto = require('./Producto');
const Categoria = require('./Categoria');
const DetallePedido = require('./DetallePedido');


// USUARIO - CLIENTE

Usuario.hasOne(Cliente,{
    foreignKey:'id_usuario',
    as:'cliente'
});

Cliente.belongsTo(Usuario,{
    foreignKey:'id_usuario',
    as:'usuario'
});


// USUARIO - REPARTIDOR

Usuario.hasOne(Repartidor,{
    foreignKey:'id_usuario',
    as:'repartidor'
});

Repartidor.belongsTo(Usuario,{
    foreignKey:'id_usuario',
    as:'usuario'
});


// CLIENTE - PEDIDO

Cliente.hasMany(Pedido,{
    foreignKey:'id_cliente',
    as:'pedidos'
});

Pedido.belongsTo(Cliente,{
    foreignKey:'id_cliente',
    as:'cliente'
});


// REPARTIDOR - PEDIDO

Repartidor.hasMany(Pedido,{
    foreignKey:'id_repartidor',
    as:'pedidos'
});

Pedido.belongsTo(Repartidor,{
    foreignKey:'id_repartidor',
    as:'repartidor'
});


// PEDIDO - DETALLE

Pedido.hasMany(DetallePedido,{
    foreignKey:'id_pedido',
    as:'detalles'
});

DetallePedido.belongsTo(Pedido,{
    foreignKey:'id_pedido',
    as:'pedido'
});


// PRODUCTO - DETALLE

Producto.hasMany(DetallePedido,{
    foreignKey:'id_producto',
    as:'detalles'
});

DetallePedido.belongsTo(Producto,{
    foreignKey:'id_producto',
    as:'producto'
});


// CATEGORIA - PRODUCTO

Categoria.hasMany(Producto,{
    foreignKey:'id_categoria',
    as:'productos'
});

Producto.belongsTo(Categoria,{
    foreignKey:'id_categoria',
    as:'categoria'
});


module.exports = {
    Usuario,
    Cliente,
    Repartidor,
    Pedido,
    Producto,
    Categoria,
    DetallePedido
};