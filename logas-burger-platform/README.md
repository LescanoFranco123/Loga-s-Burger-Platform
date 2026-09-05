# 🍔 Loga's Burger Platform

Carta digital y panel administrativo full-stack para Loga's Burger. Los clientes ven el menú actualizado en tiempo real, y el dueño del local administra los productos desde un panel privado protegido por login.

## ✨ Funcionalidades

- **Carta digital pública** — menú organizado por categorías, siempre visible sin necesidad de loguearse.
- **Panel administrativo privado** (`/admin`) — crear, editar, eliminar productos y renombrar categorías.
- **Login con usuario único** — el acceso al panel está protegido con autenticación (JWT + contraseña encriptada). Por diseño, sólo puede existir **un** usuario administrador a la vez, y se crea desde la terminal (no desde la web), para que nadie pueda registrarse por su cuenta.
- **Base de datos autoconfigurable** — al iniciar el servidor por primera vez, se crean las tablas y se carga el menú inicial automáticamente.

## 🛠️ Stack técnico

| Capa      | Tecnología                                   |
|-----------|-----------------------------------------------|
| Frontend  | React 19 + Vite + React Router                |
| Backend   | Node.js + Express 5                           |
| Base de datos | SQLite                                    |
| Autenticación | JWT (jsonwebtoken) + bcryptjs             |

## 📁 Estructura del proyecto

```
logas-burger-platform/
├── backend/          # API REST (Express + SQLite)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── database/     # init.sql, menu.sql
│   ├── create-admin.js
│   └── server.js
└── frontend/         # Carta digital + panel admin (React + Vite)
    └── src/
        ├── components/
        ├── pages/
        └── Services/
```

## 🚀 Puesta en marcha (desarrollo local)

### 1. Backend

```bash
cd backend
npm install
npm run create-admin   # crea el usuario y contraseña del panel admin
npm start               # http://localhost:5000
```

Al ejecutar `npm start` por primera vez, el servidor crea automáticamente la base de datos, sus tablas y el menú inicial (no hace falta correr nada más).

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

### 3. Usar la aplicación

- Carta digital (pública): `http://localhost:5173/`
- Login del panel: `http://localhost:5173/login`
- Panel administrativo (requiere login): `http://localhost:5173/admin`

## 🔑 Gestión del usuario administrador

El sistema está diseñado para tener **un solo usuario administrador**. Para crearlo o cambiar sus credenciales, corré desde `backend/`:

```bash
npm run create-admin
```

o directamente con los datos como argumento:

```bash
npm run create-admin -- miUsuario miContraseñaSegura
```

Cada vez que se ejecuta, reemplaza al usuario anterior — nunca puede haber más de una cuenta con acceso.

## ⚙️ Variables de entorno

### Backend (`backend/.env`, opcional en local)

Ver `backend/.env.example`:

| Variable      | Descripción                                                        | Por defecto |
|---------------|---------------------------------------------------------------------|-------------|
| `PORT`        | Puerto del servidor                                                  | `5000`      |
| `CORS_ORIGIN` | Origen permitido para llamar a la API (URL del frontend en prod)     | `*`         |
| `JWT_SECRET`  | Clave secreta para firmar los tokens de sesión                       | valor de ejemplo (cambiar en producción) |

### Frontend (`frontend/.env`, opcional en local)

Ver `frontend/.env.example`:

| Variable       | Descripción                                | Por defecto             |
|----------------|---------------------------------------------|--------------------------|
| `VITE_API_URL` | URL pública del backend ya desplegado       | `http://localhost:5000`  |

## ☁️ Despliegue en producción

Este proyecto separa frontend y backend, por lo que se recomienda desplegarlos en dos servicios distintos:

- **Frontend** → [Vercel](https://vercel.com) (Root Directory: `frontend`)
- **Backend** → [Render](https://render.com), [Railway](https://railway.app) o [Fly.io](https://fly.io) (Root Directory: `backend`)

### Pasos resumidos

1. Desplegá `backend/` en Render (Build: `npm install`, Start: `npm start`) y definí la variable `JWT_SECRET`.
2. Desde la consola/Shell de Render, corré `npm run create-admin` para crear el usuario administrador en el servidor.
3. Desplegá `frontend/` en Vercel y definí `VITE_API_URL` apuntando a la URL de tu backend en Render.

> ⚠️ **Nota sobre persistencia:** en los planes gratuitos de Render/Railway el disco puede reiniciarse al redeployar. Para una base de datos 100% persistente en el plan gratuito, considerá migrar a un servicio como [Turso](https://turso.tech) (SQLite en la nube), o usar un plan con disco persistente.

## 📄 Licencia

MIT — ver [LICENSE](./LICENSE).
