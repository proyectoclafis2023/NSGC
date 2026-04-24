# Módulo de Remuneraciones y Adelantos (Liquidaciones)

El objetivo de este módulo es automatizar el cálculo de haberes, descuentos y pagos del personal, integrando la asistencia reportada con las condiciones contractuales para generar documentos legales y registros contables precisos.

## 1. Generación de Liquidaciones (Liquidar)

El sistema procesa la información de la ficha del trabajador y su actividad mensual para determinar el sueldo líquido a pagar.

### Funcionalidades:
- **Cálculo Proporcional de Haberes:** 
    - Lectura automática de los días trabajados desde el **Módulo de Bitácora de Turnos**.
    - Capacidad de ajuste manual de días para correcciones administrativas.
    - Cálculo del sueldo bruto basado en la proporción de días asistidos sobre el mes comercial (30 días).
- **Automatización de Descuentos Legales:**
    - Deducción automática de Salud (Fonasa/Isapre) y Previsión (AFP) según tasas vigentes.
    - Aplicación de descuentos voluntarios: **APV** y **Seguros Complementarios**.
- **Descuento de Adelantos:** Identificación y deducción automática de cualquier adelanto de efectivo pendiente de cobro antes de cerrar el sueldo neto.

## 2. Gestión de Adelantos de Sueldo

Permite el flujo de caja para el personal mediante entregas parciales antes de la fecha de cierre.

### Funcionalidades:
- **Registro de Anticipos:** Ingreso de montos en efectivo con glosa explicativa para trazabilidad.
- **Comprobante de Entrega:** Generación instantánea de un recibo de adelanto para firma del trabajador.
- **Control de Estado:** Seguimiento del ciclo de vida del adelanto (`Pendiente` -> `Descontado` en liquidación).

## 3. Integración Contable y Documental

El módulo garantiza que cada pago de remuneración tenga un impacto directo en la contabilidad de la comunidad.

### Flujo de Integración:
- **Registro de Gastos Comunes (Egresos):** 
    - Al confirmar una liquidación o un adelanto, el sistema registra automáticamente un **Egreso de Comunidad** en el Módulo de Gastos Comunes.
    - Clasificación automática bajo la categoría de "Sueldos" para reportes de transparencia.
- **Historial de Folios:** Generación de números de folio únicos para cada liquidación, permitiendo una búsqueda rápida y auditoría documental.
- **Vista de Impresión Oficial:** Generación de documentos listos para imprimir con el formato institucional del condominio (Liquidaciones y Recibos de Adelanto).

## 4. Auditoría y Métricas (AM)

Control exhaustivo de los egresos de dinero por concepto de capital humano:
- **Eventos:** `RE_GENERATE_PAYSLIP`, `RE_ADD_ADVANCE`, `RE_DELETE_PAYSLIP`, `RE_EXPENSE_SYNC`.
- **Data Cuantificable:** Gasto mensual total en remuneraciones, volumen de adelantos por trabajador, días trabajados promedio.
- **Métricas:** Desviación presupuestaria en sueldos, tiempo de ciclo de pago, tasa de retenciones previsionales.
