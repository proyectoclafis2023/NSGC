# Módulo de Visor de Mensajes (Carrusel Público)

El objetivo de este módulo es proveer un canal de comunicación visual, dinámico y de alta visibilidad para los residentes y el personal, diseñado específicamente para ser proyectado en pantallas ubicadas en áreas comunes (como la recepción, conserjería o ascensores).

## 1. Gestor de Avisos (Panel de Administración)

El sistema actúa como el panel de control central para gestionar lo que se proyecta en las pantallas de la comunidad.

### Funcionalidades:
- **Gestión Integral (CRUD):** Creación, edición, archivado y eliminación de avisos.
- **Tipología y Urgencia:** Clasificación visual de avisos según su impacto:
    - *Información (Azul):* Comunicados generales (ej. "Reunión de Comité").
    - *Éxito (Verde):* Tareas completadas (ej. "Mantenimiento de Piscina Finalizado").
    - *Advertencia (Naranja):* Precauciones (ej. "Portón en mantención").
    - *Peligro/Urgente (Rojo):* Avisos críticos (ej. "Corte de Luz Programado").
- **Soporte Multimedia Excluyente:** Integración de contenido visual de apoyo:
    - *Imágenes:* Subida de imágenes locales (soporte base64/archivos pesados).
    - *Videos:* Enlaces a YouTube (incluyendo formato estándar y YouTube Shorts).
    - *Modo Pantalla Completa:* Opción de expandir la imagen o reproducir el video ocupando la totalidad del visor para mayor impacto visual.
- **Control de Tiempo y Vigencia:**
    - *Duración Dinámica:* Control en segundos de cuánto tiempo permanece el aviso en pantalla durante su ciclo en el carrusel.
    - *Caducidad Automática:* Fecha de expiración (`expires_at`) para que el aviso deje de mostrarse sin intervención manual una vez superada la fecha.
- **Etiquetado (Tags):** Sistema de tags personalizados para organización interna (ej. "mantención", "directiva").

## 2. Maestro de Mensajes Rápidos (Plantillas Operativas)

La interfaz permite la carga instantánea de situaciones recurrentes del día a día del condominio para actuar con rapidez ante emergencias o avisos rutinarios.

### Categorías de Plantillas Rápidas:
- **Falla de Servicios:** "Problemas con sistema Hidropack - Técnicos en camino." (Alerta Roja).
- **Control de Acceso:** "Portón principal en mantención - Acceso restringido." (Alerta Naranja).
- **Cortes Programados:** "Corte de luz programado para este [FECHA] de [HORA] a [HORA]." (Alerta Roja).
- **Habilitación de Áreas:** "Mantenimiento de piscinas finalizado. Habilitada para uso." (Alerta Verde).

## 3. Visor Carrusel (Interfaz Pública)

Una interfaz independiente, reactiva y autónoma (`/visor-mensajes`) optimizada para monitores sin interacción humana.

### Flujo de Visualización:
- **Rotación Automática:** Ciclo infinito de avisos activos respetando los tiempos de duración individuales asignados.
- **Identidad Gráfica Institucional:** Integración del nombre y logo del sistema o comunidad, con un diseño moderno (fondos dinámicos, glassmorphism, animaciones suaves).
- **Integración Transversal (Módulo de Espacios Comunes):** Lectura automática e inserción en el carrusel de las reservas aprobadas para los próximos 7 días, mostrando qué espacio está reservado y en qué horario.
- **Widgets de Utilidad:** Visualización permanente de la hora y fecha en tiempo real.
- **Tolerancia a Fallos:** Capacidad de actualizar su estado y datos frescos automáticamente desde el servidor al iniciar la vista, garantizando la persistencia de la sesión mediante el token de autenticación global.

## 4. Auditoría y Métricas (AM)

Cada operación sobre los mensajes está sujeta a auditoría básica y control de visibilidad.

- **Evento:** Creación, edición o archivado de un aviso.
- **Data Cuantificable:** Número de avisos activos simultáneos, avisos expirados automáticamente.
- **Trazabilidad:** Control de visibilidad mediante flags (`is_active`, `is_archived`) para mantener el registro histórico sin ensuciar la pantalla pública.
