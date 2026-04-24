# Módulo de Registro de Personal (Maestro de Personal)

El objetivo de este módulo es centralizar la información administrativa, contractual, previsional y operativa de cada trabajador de la comunidad, garantizando que la administración tenga un control total sobre las fichas, su seguridad y sus beneficios.

## 1. Ficha Integral del Trabajador (Panel de Registro)

El sistema actúa como el repositorio maestro de identidad y condiciones laborales para cada empleado o colaborador.

### Funcionalidades:
- **Gestión de Identidad:** Captura de datos personales críticos (Nombres, Apellidos, RUT/DNI con formato validado, Email, Teléfono y Dirección).
- **Tipología Contractual:** Clasificación según el vínculo laboral:
    - *Indefinido:* Contratos de larga duración con beneficios previsionales completos.
    - *Plazo Fijo:* Contratos con fecha de término definida.
    - *Honorarios:* Servicios profesionales independientes (simplifica campos previsionales).
- **Configuración Previsional y Salud:** 
    - Selección de AFP y sistema de salud (Fonasa/Isapre) con tasas de descuento automáticas.
    - Soporte para **Seguro Complementario** y **APV** (Ahorro Previsional Voluntario), permitiendo montos fijos o porcentuales.
- **Gestión Bancaria:** Registro de datos de transferencia con un "Maestro de Bancos" integrado para carga rápida de nuevas entidades.
- **Seguridad y Salud del Trabajador:** 
    - Ficha médica con antecedentes, medicamentos y condiciones importantes.
    - Protocolo de emergencia mediante el registro de contactos directos.
- **Identidad Visual:** Carga de fotografía de perfil con compresión automática para optimizar el almacenamiento.

## 2. Gestión Logística y Operativa Integrada

El registro no es estático; interactúa directamente con los inventarios y horarios del sistema.

### Funcionalidades:
- **Asignación de Jornadas y Turnos:** Integración con el Módulo de Jornadas para definir horarios semanales, descansos y cálculo automático de horas semanales según el grupo asignado.
- **Control de Insumos y EPP (Artículos):** 
    - Al registrar personal, se pueden asignar artículos de protección (uniformes, zapatos, herramientas).
    - **Sincronización de Stock:** El sistema descuenta automáticamente las unidades del inventario global al confirmar la ficha.
- **Carga Masiva (Bulk Upload):** Capacidad de importar grandes volúmenes de personal mediante archivos CSV para migraciones de datos o nuevos proyectos.

## 3. Trazabilidad e Historial Documental

Cada ficha de personal mantiene un registro histórico de su ciclo de vida en la comunidad.

### Flujo de Seguimiento:
- **Historial de Entregas EPP:** Registro detallado de cada artículo entregado, con soporte para subir "Cargos Firmados" (imágenes o PDFs) como respaldo legal.
- **Movimientos de Vacaciones:** Registro de logs automáticos cada vez que se modifican los días de vacaciones.
- **Sincronización con Usuarios:** Al eliminar un trabajador, el sistema ofrece la anulación coordinada de su cuenta de acceso al sistema para mantener la seguridad perimetral.

## 4. Auditoría y Métricas (AM)

Todas las acciones sobre el maestro de personal son auditables para prevenir fraudes o negligencias administrativas:
- **Eventos:** `PE_CREATE_STAFF`, `PE_UPDATE_STAFF`, `PE_DELETE_STAFF`, `PE_EPP_DELIVERY`.
- **Data Cuantificable:** Número de personal activo vs. pasivo, distribución por tipo de contrato, consumo de insumos por trabajador.
- **Métricas:** Rotación de personal, cumplimiento de entrega de EPP, horas promedio de jornada laboral.
