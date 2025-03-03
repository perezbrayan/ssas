# API Documentation

## Configuración del Entorno

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

### Configuración Inicial

1. **Clonar el Repositorio**
```bash
git clone <repositorio>
cd js-src
```

2. **Instalar Dependencias**
```bash
npm install
```

3. **Configurar Variables de Entorno**
Crear un archivo `.env` en la raíz del proyecto con la siguiente estructura:
```env
PORT=3002

# Database Configuration
DB_HOST=82.197.82.139
DB_USER=u933411614_angel
DB_PASSWORD=Mimosa34.
DB_NAME=u933411614_gamestore
DB_PORT=3306

# JWT Configuration
JWT_SECRET=tu_secreto_super_seguro

# SSL Configuration
SSL_ENABLED=false
```

4. **Verificar la Conexión**
```bash
node check-tables.js
```

## Endpoints de la API

### Autenticación

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

#### Inicio de Sesión
```http
POST /auth/login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

### Usuarios

#### Obtener Perfil de Usuario
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Actualizar Perfil
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
    "username": "string",
    "email": "string"
}
```

### Administración

#### Listar Usuarios (Solo Admin)
```http
GET /admin/users
Authorization: Bearer <token>
```

#### Gestionar Roles (Solo Admin)
```http
PUT /admin/users/:userId/role
Authorization: Bearer <token>
Content-Type: application/json

{
    "role": "admin|user"
}
```

### Configuraciones

#### Obtener Configuraciones
```http
GET /settings
Authorization: Bearer <token>
```

#### Actualizar Configuraciones (Solo Admin)
```http
PUT /settings
Authorization: Bearer <token>
Content-Type: application/json

{
    "settingKey": "value"
}
```

### Productos Roblox

#### Listar Productos
```http
GET /roblox/products
```

#### Crear Producto (Solo Admin)
```http
POST /roblox/products
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string",
    "price": "number",
    "description": "string"
}
```

## Guía de Conexión para el Equipo

### 1. Conexión a la Base de Datos

La conexión a la base de datos se maneja a través de Knex.js. El archivo de configuración principal está en `config/database.js`:

```javascript
const knex = require('knex');
const knexfile = require('../knexfile');
const db = knex(knexfile.development);
```

### 2. Manejo de Errores

Siempre manejar los errores en las consultas:

```javascript
try {
    const result = await db('users').where({ id });
    // Manejar resultado
} catch (error) {
    console.error('Error en la consulta:', error);
    throw error;
}
```

### 3. Mejores Prácticas

- **Validación**: Usar Joi o express-validator para validar datos de entrada
- **Autenticación**: Verificar token JWT en rutas protegidas
- **Transacciones**: Usar transacciones para operaciones múltiples
- **Logging**: Implementar logging para debugging
- **Rate Limiting**: Implementar rate limiting en endpoints sensibles

### 4. Seguridad

- Nunca exponer credenciales en el código
- Usar variables de entorno para configuración sensible
- Implementar CORS correctamente
- Validar y sanitizar todas las entradas de usuario
- Usar HTTPS en producción

### 5. Testing

Para probar la conexión:
```javascript
const { db } = require('./config/database');

async function testConnection() {
    try {
        await db.raw('SELECT 1');
        console.log('Conexión exitosa');
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}
```

## Notas Importantes

- Siempre usar las últimas versiones de las dependencias
- Mantener actualizadas las variables de entorno
- Hacer backup regular de la base de datos
- Documentar cualquier cambio en la API
- Seguir las convenciones de código establecidas

Para cualquier duda o problema, contactar al equipo de desarrollo.
