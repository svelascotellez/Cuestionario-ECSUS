# Plan de Implementación para el Sistema ECSUS (MVP)

Este documento detalla la arquitectura, el diseño y la estrategia de implementación para el MVP del Sistema de actualización de estado operativo ECSUS.

## User Review Required

> [!IMPORTANT]
> **Aprobación del Stack Tecnológico**: Se propone utilizar **Next.js** como framework Full-Stack por su capacidad de manejar el frontend y backend en un solo proyecto de forma escalable. Para los estilos se utilizará **Vanilla CSS** (según las mejores prácticas de diseño estético solicitadas) y para la base de datos **SQLite**, gestionada a través del ORM **Prisma** para un esquema robusto y tipado.
> 
> **Aprobación de la zona horaria**: Se configurará el sistema para registrar las fechas y horas usando explícitamente la zona horaria de la Ciudad de México (`America/Mexico_City`).

## Open Questions

> [!WARNING]
> 1. **Ubicación**: Para el "lugar de llenado", ¿deseas que el sistema capture las coordenadas GPS automáticamente usando la API del navegador o prefieres que sea un campo de texto donde el usuario escriba la unidad/sucursal?
> 2. **Autenticación**: Para el inicio de sesión, ¿prefieres usar nombre de usuario o correo electrónico?
> 3. **Roles iniciales**: ¿Deseas que creemos un usuario "Admin" por defecto durante la inicialización para poder ingresar al dashboard la primera vez?

## Arquitectura del Sistema

El sistema seguirá una arquitectura cliente-servidor monolítica (Next.js), ideal para un MVP escalable.

1.  **Frontend (UI)**: React Server Components y Client Components de Next.js (App Router). Diseñado con Vanilla CSS enfocado en estética moderna, animaciones sutiles y diseño responsivo.
2.  **Backend (API / Server Actions)**: Next.js Server Actions para manejar la lógica de negocio (login, creación de usuarios, guardado de cuestionarios, exportación a Excel).
3.  **Base de Datos**: Base de datos relacional SQLite interactuando mediante Prisma ORM.

### Arquitectura UI

-   `/` o `/login`: Pantalla de inicio de sesión con diseño moderno (glassmorphism).
-   `/cuestionario`: Formulario dinámico e interactivo del cuestionario ECSUS.
-   `/admin/dashboard`: Panel estadístico con gráficos de resultados.
-   `/admin/usuarios`: Gestión (Alta/Baja) de usuarios.
-   `/admin/resultados`: Tabla con todas las respuestas y botón de exportación a Excel.

### Estructura de Archivos

```
Cuestionario-ECSUS/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── usuarios/page.tsx
│   │   │   └── resultados/page.tsx
│   │   ├── cuestionario/page.tsx
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css (Sistema de diseño en Vanilla CSS)
│   ├── components/
│   │   ├── ui/ (Botones, Inputs, Cards, etc.)
│   │   ├── charts/ (Gráficos para el dashboard)
│   │   └── admin/ (Componentes de navegación admin)
│   ├── lib/
│   │   ├── db.ts (Conexión a SQLite)
│   │   ├── auth.ts (Lógica de sesiones)
│   │   └── utils.ts (Formateo de fechas CDMX, etc.)
├── prisma/
│   └── schema.prisma (Esquema de base de datos)
├── package.json
└── next.config.mjs
```

## Esquema de Base de Datos (Prisma/SQLite)

```prisma
model User {
  id             String          @id @default(uuid())
  username       String          @unique
  passwordHash   String
  role           String          @default("USER") // ADMIN o USER
  questionnaires Questionnaire[]
  auditLogs      AuditLog[]
  createdAt      DateTime        @default(now())
}

model Questionnaire {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  createdAt         DateTime @default(now()) // Se convertirá a CDMX al consultar/exportar
  location          String
  // Respuestas
  q1_techIssue      String   // JSON o separada por comas (múltiples)
  q2_accessIssue    String   // "Sí" / "No"
  q3_powerIssue     String   // "No", "1 a 4 horas", etc.
  q4_trainingNeeded String   // "Sí" / "No"
  q5_comments       String?  
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String   // Ej. "LOGIN", "SUBMIT_QUESTIONNAIRE", "CREATE_USER"
  details   String?
  timestamp DateTime @default(now())
}
```

## Proposed Changes

### Next.js Project Initialization
Crearemos el proyecto Next.js limpio.

#### [NEW] package.json
Configuración de Next.js, dependencias como `prisma`, `xlsx` (para Excel), `chart.js` (para estadísticas).

#### [NEW] schema.prisma
Definición de las tablas para SQLite.

#### [NEW] globals.css
Sistema de diseño premium con paletas de colores modernas (modo oscuro/claro) y micro-animaciones en Vanilla CSS.

## Verification Plan

### Manual Verification
1.  **Ejecutar entorno de desarrollo local**: Iniciar la app con `npm run dev`.
2.  **Autenticación**: Verificar que un usuario no pueda acceder a `/cuestionario` ni `/admin` sin iniciar sesión.
3.  **Registro de datos y zona horaria**: Enviar un cuestionario y verificar en la base de datos SQLite y en la interfaz que la hora mostrada corresponde a CDMX.
4.  **Auditoría**: Comprobar que en la tabla `AuditLog` se haya registrado la operación de envío.
5.  **Exportación y Dashboard**: En el área administrativa, verificar la correcta renderización de gráficos y que el archivo de Excel se descargue adecuadamente con todos los datos.
