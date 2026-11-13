# Configuración de Panadería Merino - Guía Completa

## 🎯 Estado Actual

El proyecto está en fase de demostración con funcionalidades principales implementadas:
- ✅ Catálogo de productos (20 tipos de panes)
- ✅ Carrito de compras
- ✅ Seguimiento de pedidos en tiempo real
- ✅ Integración con Mercado Pago (modo demostración)
- ✅ Autenticación con JWT
- ✅ Backend API con Express + Sequelize

## 🚀 Pasos para Completar la Instalación

### 1. Configurar la Base de Datos PostgreSQL

```bash
# Asegúrate de que PostgreSQL está corriendo
# Las credenciales están en backend-api/.env

# Conectarse a PostgreSQL
psql -U postgres -h localhost

# Crear la base de datos
CREATE DATABASE panaderia_merino1;

# Salir
\q
```

### 2. Llenar la Base de Datos con Productos

```bash
# Ir al directorio del backend
cd backend-api

# Ejecutar el seed que crea tablas e inserta 20 productos
npm run seed

# Deberías ver:
# 🌱 Iniciando seed de la base de datos...
# ✅ Base de datos alimentada correctamente
```

### 3. Configurar Mercado Pago (Opcional)

Para activar pagos reales con Mercado Pago:

1. Ir a https://www.mercadopago.com/developers/
2. Crear una cuenta de desarrollador
3. Obtener el Access Token desde el dashboard
4. Actualizar `backend-api/.env`:
   ```
   MERCADO_PAGO_ACCESS_TOKEN=APP_USR_1234567890...
   ```

**Sin esta configuración**, la app funciona en modo demo y muestra:
- Preferencias de pago de demostración
- Links a la página de Mercado Pago de prueba

### 4. Iniciar el Proyecto

```bash
# Terminal 1: Backend API
cd backend-api
npm run dev

# Deberías ver:
# ✅ Conexión correcta
# Server running on port 3000

# Terminal 2: Frontend Ionic
cd ..
ionic serve

# Deberías ver:
# [ERROR] Cannot find module 'ionic'
# Si es así, instala Ionic globalmente:
# npm install -g @ionic/cli
# Luego: ionic serve
```

## 📱 Acceder a la App

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Swagger API Docs**: http://localhost:3000/api-docs (si está configurado)

## 🧪 Pruebas Rápidas

### Verificar que los productos se cargaron:
```bash
curl http://localhost:3000/api/productos
```

Deberías obtener un JSON con 20 productos.

### Verificar seguimiento:
```bash
curl http://localhost:3000/api/pedidos/1/seguimiento
```

### Crear preferencia de pago:
```bash
curl -X POST http://localhost:3000/api/pagos/preferencia \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","amount":100,"external_reference":"test-123"}'
```

## 📋 Funcionalidades Implementadas

### Página de Productos
- ✅ Carga desde API backend (o fallback de 20 panes si BD está vacía)
- ✅ Carrito de compras funcional
- ✅ Búsqueda y filtros

### Seguimiento (Tracking)
- ✅ Simulación de recorrido del repartidor
- ✅ Actualización en tiempo real vía Server-Sent Events (SSE)
- ✅ Mapa Leaflet con ubicación actual y destino
- ✅ Progreso de entrega (%)
- ✅ Botón para usar tu ubicación con geolocalización

### Pago
- ✅ Método Mercado Pago integrado
- ✅ Fallback a demo si no hay token
- ✅ Validación de productos y usuario
- ✅ Redireccionamiento a seguimiento post-pago

### Backend
- ✅ CRUD de productos desde BD
- ✅ Streaming SSE para seguimiento
- ✅ Endpoint de Mercado Pago
- ✅ Autenticación JWT

## 🔧 Variables de Entorno Importantes

```env
# Base de Datos
DB_NAME=panaderia_merino1
DB_USER=postgres
DB_PASSWORD=1234t
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=MerinoBackend2026_Seguro_2026
JWT_EXPIRE=24h

# Mercado Pago (dejar vacío para demo)
MERCADO_PAGO_ACCESS_TOKEN=

# Puerto del servidor
PORT=3000
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL está corriendo
- Revisa las credenciales en `.env`
- Asegúrate de que la BD `panaderia_merino1` existe

### Error: "Productos no se cargan"
- Ejecuta: `npm run seed` en el backend-api
- Verifica que el backend está corriendo en puerto 3000

### Error: "Mercado Pago no funciona"
- Si no has configurado el token, es normal, usa el modo demo
- El botón abrirá una página de demostración

## 📝 Próximos Pasos (Opcional)

1. **Imágenes reales**: Reemplaza URLs de imágenes en `assets/imagenes/`
2. **Seguridad**: Implementar HTTPS en producción
3. **Notificaciones**: Agregar push notifications para seguimiento
4. **Reportes**: Dashboard admin para vendedores
5. **Móvil**: Compilar a iOS/Android con Capacitor

## ✨ Lista de Verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos creada: `panaderia_merino1`
- [ ] Seed ejecutado: `npm run seed`
- [ ] Backend inicia sin errores: `npm run dev`
- [ ] Frontend carga: `ionic serve`
- [ ] Productos visibles en /productos
- [ ] Carrito funciona (agregar/quitar items)
- [ ] Login funciona
- [ ] Pago abre Mercado Pago (demo o real)
- [ ] Seguimiento muestra mapa

---

¡Listo! Tu panadería digital está configurada. 🍞🎉
