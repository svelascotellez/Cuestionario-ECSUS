# Sistema Operativo ECSUS - MVP

Plataforma integral para la actualización del estado operativo de equipos e infraestructura en unidades médicas (alineada al estilo institucional del IMSS). Este sistema permite a los usuarios reportar incidencias (técnicas, de acceso, energía, etc.), capturando automáticamente su ubicación, y cuenta con un panel administrativo robusto para visualización y exportación de datos.

---

## 🚀 Arquitectura del Sistema

El proyecto fue construido utilizando una arquitectura moderna Full-Stack Serverless-ready:

- **Framework Principal:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Base de Datos:** SQLite (archivo local `dev.db` para facilidad de despliegue como MVP)
- **ORM:** Prisma v5 (para tipado fuerte y manejo de esquemas)
- **Estilos:** Vanilla CSS nativo, implementando el diseño visual institucional (Verde IMSS: `#235B4E`, Dorado: `#B38E5D`, con efectos de Glassmorphism).
- **Gráficos:** Chart.js y React-Chartjs-2
- **Exportación:** SheetJS (`xlsx`)

---

## 📂 Estructura del Proyecto

```text
Cuestionario-ECSUS/
├── prisma/
│   ├── schema.prisma       # Esquema de Base de Datos (Modelos: User, Questionnaire, AuditLog)
│   ├── seed.mjs            # Script inicial para crear el usuario "admin"
│   └── dev.db              # Base de datos SQLite (local)
├── src/
│   ├── app/
│   │   ├── actions.ts             # "Server Actions" (Backend: Login, CRUD de usuarios, Cuestionarios)
│   │   ├── layout.tsx             # Plantilla y Header Institucional para toda la app
│   │   ├── globals.css            # Hoja de estilos principal con tokens del IMSS
│   │   ├── login/                 # Módulo de Autenticación
│   │   ├── cuestionario/          # Formulario principal con captura de GPS y Logout
│   │   └── admin/                 # Backoffice administrativo
│   │       ├── page.tsx           # Dashboard Estadístico (Gráficos)
│   │       ├── resultados/        # Listado tabular de cuestionarios y descarga a Excel
│   │       └── usuarios/          # Control de usuarios (CRUD)
│   ├── components/
│   │   ├── DashboardCharts.tsx    # Gráficos interactivos de Chart.js
│   │   ├── CreateUserForm.tsx     # Formulario para registro de nuevos usuarios
│   │   ├── UserRowActions.tsx     # Componente cliente para Edición/Baja de usuarios inline
│   │   ├── ExportExcelButton.tsx  # Lógica del cliente para descargar XLSX
│   │   └── LogoutButton.tsx       # Botón de cierre de sesión para usuarios
│   ├── lib/
│   │   ├── db.ts                  # Singleton de conexión a Prisma
│   │   ├── auth.ts                # Gestión de sesiones y cookies
│   │   └── utils.ts               # Utilidades de parseo y formateo (CDMX, Pregunta 1)
│   └── middleware.ts              # Interceptor de seguridad (protege rutas)
```

---

## 🗄️ Esquema de Base de Datos

El sistema consta de 3 tablas principales en SQLite:

1. **User (Usuarios):**
   - Controla el acceso al sistema.
   - Campos: `id`, `username` (único), `passwordHash`, `role` (ADMIN o USER), `createdAt`.
   - Relaciones: Posee borrado en cascada (`onDelete: Cascade`) en sus dependencias para mantener la integridad referencial al dar de baja un usuario.

2. **Questionnaire (Cuestionarios):**
   - Almacena las respuestas de la evaluación operativa.
   - Campos: `id`, `userId` (FK), `createdAt` (UTC, mostrado en CDMX), `location` (GPS), `unitNumber` (Unidad), y las respuestas de las 5 preguntas (`q1_techIssue` a `q5_comments`).

3. **AuditLog (Auditoría):**
   - Historial inmutable de acciones realizadas en el sistema (Login, envío de cuestionario, creación/edición/baja de usuarios, borrado de cuestionarios).

---

## 🛡️ Seguridad y Autenticación

- **Contraseñas:** Encriptadas mediante el algoritmo robusto `bcryptjs`.
- **Sesión:** Manejada de forma segura a través de **Cookies HTTP-Only**, lo que previene accesos indebidos y ataques XSS (Cross-Site Scripting).
- **Middleware:** Un guardia (`src/middleware.ts`) intercepta las peticiones a `/cuestionario` y `/admin` para validar activamente el rol y existencia de sesión.

---

## ⚙️ Características Principales

1. **Cuestionario Operativo con Ubicación GPS:**
   - Detecta y solicita coordenadas GPS del dispositivo automáticamente.
   - Incluye botón de **Cierre de Sesión (Logout)** visible e intuitivo.
   
2. **Pregunta 1 Desglosada (Sí/No):**
   - La pregunta técnica ahora exige una respuesta explícita (Sí/No) para cada opción (Equipo de cómputo, Internet e Impresora), optimizando la precisión de los reportes.
   - Cuenta con "No" seleccionado por defecto para agilizar la captura de datos.

3. **Panel Administrativo (Dashboard):**
   - Gráficas estadísticas automáticas de frecuencia de problemas de acceso, suministro de energía y capacitación mediante Chart.js.

4. **Tabla Completa de Resultados:**
   - Desglosa las respuestas de la Pregunta 1 en columnas individuales: `S.T. Equipo`, `S.T. Internet` y `S.T. Impresora`.
   - Incorpora un parseador inteligente en `src/lib/utils.ts` que permite interpretar dinámicamente tanto los nuevos registros formateados como los registros históricos anteriores, asegurando la continuidad operativa sin pérdidas.

5. **Exportación Estandarizada a Excel:**
   - Exporta el reporte completo con las columnas de situación técnica separadas y fechas estandarizadas en la zona horaria de la Ciudad de México.

6. **Gestión Completa de Usuarios (CRUD):**
   - Panel interactivo para dar de alta, editar roles (ADMIN/USER), actualizar contraseñas encriptadas y dar de baja (borrado en cascada seguro con confirmación interactiva). El sistema prohíbe auto-eliminarse o dar de baja al administrador principal (`admin`).

---

## 💻 Instrucciones para Desarrolladores (Ejecución Local)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Sincronizar base de datos:**
   ```bash
   npx prisma db push
   ```
3. **Generar cliente de Prisma:**
   ```bash
   npx prisma generate
   ```
4. **Correr script inicial de semilla:**
   ```bash
   node prisma/seed.mjs
   ```
   *(Crea el usuario administrador por defecto: `admin` / contraseña: `admin123`)*
5. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
6. **Acceder:** [http://localhost:3000](http://localhost:3000)

---

## ☁️ Notas de Despliegue (Ejemplo: Railway)

Debido a los requerimientos de Next.js para generación de páginas estáticas durante la construcción:
- Se forzó el modo dinámico en las páginas administrativas que llaman a Prisma a nivel de build agregando:
  ```typescript
  export const dynamic = 'force-dynamic'
  ```
- El script de construcción en `package.json` incluye la pre-generación del cliente Prisma antes de compilar Next.js:
  ```json
  "build": "npx prisma generate && next build"
  ```
