-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    estado BOOLEAN DEFAULT true,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- Insertar categoría si no existe
INSERT INTO categorias (id_categoria, nombre, descripcion) 
VALUES (1, 'Panes Dulces', 'Panes y pasteles dulces artesanales')
ON CONFLICT (id_categoria) DO NOTHING;

-- Insertar productos de panadería
INSERT INTO productos (id_categoria, nombre, descripcion, precio, stock, estado) VALUES
(1, 'Concha de vainilla', 'Pan dulce tradicional con sabor a vainilla', 18.00, 50, true),
(1, 'Mantecada tradicional', 'Pan dulce suave y esponjoso', 20.00, 40, true),
(1, 'Bolillo suave', 'Bolillo artesanal crujiente por fuera', 16.00, 60, true),
(1, 'Cuernito crujiente', 'Cuernito de mantequilla fresco del horno', 22.00, 35, true),
(1, 'Oreja de azúcar', 'Oreja hojaldrada cubierta de azúcar', 19.00, 30, true),
(1, 'Dona azucarada', 'Dona fresca con cobertura de azúcar', 24.00, 25, true),
(1, 'Pan de muerto', 'Pan típico para temporada de difuntos', 28.00, 20, true),
(1, 'Pan de queso', 'Pan con queso derretido en el interior', 26.00, 22, true),
(1, 'Hojaldra', 'Hojaldra de manteca crujiente', 21.00, 18, true),
(1, 'Barquillo', 'Barquillo crujiente y ligero', 17.00, 24, true),
(1, 'Brioche', 'Pan suave de mantequilla premium', 30.00, 15, true),
(1, 'Telera', 'Pan clásico para tortas y bocadillos', 18.00, 28, true),
(1, 'Pan dulce de chocolate', 'Pan con cobertura de chocolate delicioso', 25.00, 18, true),
(1, 'Rosca de Reyes', 'Rosca tradicional para celebraciones', 35.00, 12, true),
(1, 'Concha de chocolate', 'Concha con cobertura de chocolate negro', 22.00, 20, true),
(1, 'Rebanada de pan', 'Pan de caja para desayuno nutritivo', 15.00, 45, true),
(1, 'Pan integral', 'Pan con granos y semillas saludables', 24.00, 16, true),
(1, 'Birote', 'Pan blando tradicional de la región', 19.00, 26, true),
(1, 'Concha de fresa', 'Concha con sabor fresco a fresa', 21.00, 14, true),
(1, 'Muffin de pan', 'Muffin con textura de pan artesanal', 23.00, 17, true)
ON CONFLICT DO NOTHING;
