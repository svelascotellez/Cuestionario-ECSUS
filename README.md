# Sistema Operativo ECSUS - MVP

Plataforma integral para la actualización del estado operativo de equipos e infraestructura en unidades médicas (alineada al estilo institucional del IMSS). Este sistema permite a los usuarios reportar incidencias (técnicas, de acceso, energía, etc.), capturando automáticamente su ubicación, y cuenta con un panel administrativo robusto para visualización y exportación de datos.

## 🚀 Arquitectura del Sistema

El proyecto fue construido utilizando una arquitectura moderna Full-Stack Serverless-ready:

- **Framework Principal:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** SQLite (archivo local `dev.db` para facilidad de despliegue como MVP)
- **ORM:** Prisma v5 (para tipado fuerte y manejo de esquemas)
- **Estilos:** Vanilla CSS nativo, implementando el diseño visual institucional (Verde: `#235B4E`, Dorado: `#B38E5D`).
- **Gráficos:** Chart.js y React-Chartjs-2
- **Exportación:** SheetJS (`xlsx`)

## 📂 Estructura del Proyecto

```text
Cuestionario-ECSUS/
├── prisma/
│   ├── schema.prisma       # Esquema de Base de Datos (Modelos: User, Questionnaire, AuditLog)
│   ├── seed.mjs            # Script inicial para crear el usuario "admin"
│   └── dev.db              # Base de datos SQLite
├── src/
│   ├── app/
│   │   ├── actions.ts             # "Server Actions" (Lógica de backend para Login, Guardado, Borrado)
│   │   ├── layout.tsx             # Plantilla y Header Institucional para toda la app
│   │   ├── globals.css            # Hoja de estilos principal con tokens del IMSS
│   │   ├── login/                 # Módulo de Autenticación
│   │   ├── cuestionario/          # Formulario principal con captura de GPS
│   │   └── admin/                 # Backoffice (Dashboard, Resultados, Usuarios)
│   ├── components/
│   │   ├── DashboardCharts.tsx    # Gráficos interactivos de Chart.js
│   │   ├── CreateUserForm.tsx     # Formulario para gestión de usuarios
│   │   └── ExportExcelButton.tsx  # Lógica del cliente para descargar XLSX
│   ├── lib/
│   │   ├── db.ts                  # Singleton de conexión a Prisma (evita fugas de memoria)
│   │   └── auth.ts                # Gestión de sesiones y lectura/escritura de cookies
│   └── middleware.ts              # Interceptor de seguridad (protege rutas sin sesión)
```

## 🗄️ Esquema de Base de Datos

El sistema consta de 3 tablas principales:

1. **User (Usuarios):**
   - Controla el acceso al sistema.
   - Campos: `id`, `username`, `passwordHash`, `role` (ADMIN o USER).
2. **Questionnaire (Cuestionarios):**
   - Almacena las respuestas de la evaluación operativa.
   - Campos: `id`, `location` (Coordenadas GPS), `unitNumber` (Unidad), y las respuestas de las 5 preguntas. Se relaciona con el Usuario que lo llenó.
3. **AuditLog (Auditoría):**
   - Historial inmutable de acciones realizadas en el sistema (Inicios de sesión, llenado de cuestionarios, borrado de registros, creación de usuarios).

## 🛡️ Seguridad y Autenticación

- **Contraseñas:** Encriptadas mediante el algoritmo robusto `bcryptjs`.
- **Sesión:** Manejada de forma segura a través de **Cookies HTTP-Only**, lo que previene ataques XSS (Cross-Site Scripting).
- **Middleware:** Un guardia (`src/middleware.ts`) verifica la existencia de la cookie de sesión antes de permitir el acceso a `/cuestionario` o `/admin`.

## ⚙️ Características Principales

1. **Cuestionario Dinámico:** Capaz de solicitar permisos y obtener latitud y longitud automáticamente mediante la API de Geolocalización del navegador.
2. **Dashboard Estadístico:** Gráficas en tiempo real que procesan las frecuencias de los problemas (Accesos, Energía, Capacitación).
3. **Gestión de Registros:** Visualización tabular, borrado individual de registros (con rastro de auditoría) y exportación a Excel con zona horaria estandarizada de la Ciudad de México.

## 💻 Instrucciones para Desarrolladores (Ejecución Local)

1. **Instalar dependencias:** `npm install`
2. **Sincronizar base de datos:** `npx prisma db push` y luego `npx prisma generate`
3. **Correr script inicial:** `node prisma/seed.mjs` (Crea usuario: `admin`, Password: `admin123`)
4. **Iniciar servidor:** `npm run dev`
5. **Acceder:** `http://localhost:3000`
