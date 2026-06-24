# 📈 Recomendaciones de Mejora para el Sistema ECSUS

Este documento contiene un conjunto de propuestas estratégicas y técnicas para escalar el Producto Mínimo Viable (MVP) actual hacia un sistema de nivel empresarial y producción, alineado a las necesidades institucionales del IMSS.

---

## 1. 🗄️ Base de Datos y Escalabilidad en la Nube

*   **Migración a PostgreSQL (Recomendado para Railway):**
    *   *Situación actual:* El MVP utiliza **SQLite** (`dev.db`), que se almacena en el sistema de archivos local. En servicios como Railway, el disco de los contenedores es efímero, lo que significa que la base de datos se borra con cada reinicio o nuevo despliegue a menos que se use un volumen persistente.
    *   *Propuesta:* Migrar el datasource en `schema.prisma` a **PostgreSQL**. Railway proporciona bases de datos PostgreSQL autoadministradas con copias de seguridad automáticas y alta disponibilidad de manera nativa.
*   **Manejo de Migraciones Profesionales:**
    *   *Propuesta:* Reemplazar `npx prisma db push` por `npx prisma migrate dev` (desarrollo) y `npx prisma migrate deploy` (producción) para mantener un historial auditable y seguro de los cambios en el esquema de base de datos.

---

## 2. 📶 Conectividad y Resiliencia (PWA / Modo Offline)

Dado que las unidades médicas completan este cuestionario para reportar problemas de **Internet** y **Suministro Eléctrico**, es altamente probable que en ocasiones no tengan acceso a la red al momento de llenar la información.

*   **Soporte Offline (PWA):**
    *   *Propuesta:* Implementar tecnologías de **PWA (Progressive Web App)** utilizando *Service Workers* y **IndexedDB** en el cliente.
    *   *Flujo de trabajo:*
        1.  El usuario abre el formulario en su dispositivo (incluso sin conexión).
        2.  El formulario se llena normalmente y se guarda de forma segura en el almacenamiento local del navegador (IndexedDB).
        3.  Un *Service Worker* detecta el retorno de la conexión a Internet en segundo plano y sincroniza automáticamente las respuestas pendientes con el servidor.

---

## 3. 🛡️ Seguridad y Autenticación Corporativa

*   **Integración con Directorio Activo (SSO/LDAP):**
    *   *Propuesta:* Conectar el flujo de autenticación con el sistema de cuentas institucional del IMSS a través de protocolos estandarizados (OAuth2, SAML o LDAP). Esto elimina la necesidad de crear contraseñas locales y centraliza las políticas de acceso.
*   **Control de Acceso Basado en Roles (RBAC):**
    *   *Propuesta:* Definir roles jerárquicos más específicos (ej. `Super_Admin`, `Supervisor_Delegacional`, `Capturista_Unidad`) para limitar qué información de auditoría o de resultados puede ver o modificar cada tipo de funcionario según su circunscripción.
*   **Rate Limiting (Protección contra abusos):**
    *   *Propuesta:* Implementar políticas de control de tasa de peticiones en las Server Actions (como `/login` y el envío de cuestionarios) para mitigar intentos de fuerza bruta o ataques de denegación de servicio (DoS) locales.

---

## 4. 📍 Captura de Ubicación e Integridad de Datos

*   **Geocodificación Inversa (Reverse Geocoding):**
    *   *Propuesta:* Integrar un servicio de mapas (como OpenStreetMap/Nominatim o Google Maps API) para traducir automáticamente las coordenadas GPS en direcciones o nombres de colonias y municipios legibles dentro de los reportes.
*   **Catálogo Estandarizado de Unidades Médicas:**
    *   *Propuesta:* Reemplazar el campo de texto libre `"Número de la Unidad"` por una lista desplegable conectada a un catálogo oficial de unidades médicas del IMSS. Esto evitará discrepancias de escritura (ej. `"UMF 24"`, `"umf24"`, `"U.M.F. N. 24"`) y mejorará drásticamente la calidad de los filtros y estadísticas del dashboard.

---

## 📊 5. Análisis Avanzado y Alertas en Tiempo Real

*   **Filtros de Datos Avanzados:**
    *   *Propuesta:* Agregar controles de filtrado multidimensional en la página `/admin/resultados` para segmentar los cuestionarios por fecha, delegación, estado de la red (Internet Sí/No), o problemas específicos reportados.
*   **Sistema de Alertas Tempranas:**
    *   *Propuesta:* Configurar un sistema de notificaciones automáticas (por ejemplo, correos electrónicos automáticos o webhooks a canales de Microsoft Teams/Slack) que avisen al departamento de soporte técnico de forma inmediata cuando una unidad reporte un estado crítico (como *"Sin suministro de energía eléctrica por más de 8 horas"*).
