# Despliegue fácil

## 1) Sube el proyecto a GitHub
1. Crea un repositorio en GitHub.
2. Sube toda la carpeta del proyecto.
3. Asegúrate de incluir estos archivos:
   - [vercel.json](vercel.json)
   - [backend-api/render.yaml](backend-api/render.yaml)
   - [src/environments/environment.prod.ts](src/environments/environment.prod.ts)

## 2) Despliega el backend en Render
1. Entra a Render y crea un nuevo Web Service.
2. Conecta el repositorio de GitHub.
3. Selecciona la carpeta [backend-api](backend-api).
4. Usa este comando de inicio:
   - `npm start`
5. Añade estas variables de entorno:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `JWT_SECRET=MerinoBackend2026_Seguro_2026`
   - `JWT_EXPIRE=24h`
6. Si quieres que funcione con base de datos real, añade también:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
7. Render te dará una URL como:
   - `https://tu-backend.onrender.com`

## 3) Despliega el frontend en Vercel
1. Entra a Vercel y crea un nuevo proyecto.
2. Conecta el mismo repositorio.
3. Vercel detectará que es Angular y usará la carpeta [www](www) como salida.
4. En Variables de entorno, añade:
   - `API_URL=https://tu-backend.onrender.com/api`
5. Haz deploy.

## 4) Ajusta la URL del backend
Abre [src/environments/environment.prod.ts](src/environments/environment.prod.ts) y reemplaza la URL de ejemplo por la URL real que te dio Render.

## 5) Prueba la app
- Frontend: `https://tu-app.vercel.app`
- Backend: `https://tu-backend.onrender.com/api-docs`
