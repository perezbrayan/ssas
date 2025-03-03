# Backend JS

Este es el backend de la tienda, implementado en JavaScript puro.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
- Copia el archivo `.env.example` a `.env`
- Ajusta las variables según tu configuración

3. Ejecutar migraciones:
```bash
npm run migrate
```

## Ejecución

Para desarrollo:
```bash
npm run dev
```

Para producción:
```bash
npm start
```

## Estructura del Proyecto

- `/config` - Configuraciones (base de datos, etc.)
- `/controllers` - Controladores de la aplicación
- `/middleware` - Middlewares (auth, database, etc.)
- `/migrations` - Migraciones de la base de datos
- `/routes` - Rutas de la API
- `server.js` - Punto de entrada de la aplicación
