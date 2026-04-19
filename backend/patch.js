const fs = require('fs');
const path = 'index.js';
let content = fs.readFileSync(path, 'utf8');

const permMap = {
  'afc': 'personnel:manage',
  'afps': 'personnel:manage',
  'bancos': 'personnel:manage',
  'previsiones': 'personnel:manage',
  'condiciones_especiales': 'personnel:manage',
  'personal': 'personnel:manage',
  'liquidaciones': 'personnel:manage',
  'certificados': 'personnel:manage',
  'espacios': 'infrastructure:manage',
  'estacionamientos': 'infrastructure:manage',
  'tipos_unidad': 'unit_types:manage',
  'unidades': 'infrastructure:manage',
  'torres': 'infrastructure:manage',
  'infraestructura': 'infrastructure:manage',
  'residentes': 'residents:manage',
  'propietarios': 'residents:manage',
  'registro_gastos': 'expenses:manage',
  'reglas_gastos_comunes': 'common_expenses:view',
  'maestro_fondos': 'common_expenses:view',
  'gastos_comunes': 'common_expenses:view',
  'common-expenses/calculate': 'common_expenses:view',
  'common-expenses/rules': 'common_expenses:view',
  'activo_fijo': 'fixed_assets:view',
  'camaras': 'camera_requests:view',
  'cctv_logs': 'camera_requests:view',
  'cameras': 'camera_requests:view',
  'entregas_articulos': 'correspondence:view',
  'correspondencia': 'correspondence:view',
  'carga_masiva': 'admin:stats',
  'bulk-export': 'admin:stats',
  'bulk-import': 'admin:stats',
  'bulk-masters': 'admin:stats',
  'directiva': 'roles:manage',
  'perfiles': 'roles:manage',
  'mensajes': 'announcements:manage',
  'mensajes_dirigidos': 'announcements:manage',
  'maestro_mensajes': 'announcements:manage',
  'reporte_diario': 'reports:view',
  'bitacora_turnos': 'shift_logs:view',
  'visitas': 'visits:view',
  'registro_contratistas': 'contractors:view',
  'contratistas': 'contractors:view',
  'reservaciones': 'reservations:view',
  'reservations': 'reservations:view',
  'tickets': 'tickets:view',
  'reclamos': 'tickets:view',
  'service_directory': 'services:view',
  'servicios_residentes': 'services:view',
  'maestro_correos': 'admin:stats',
  'dashboard_kpi': 'admin:stats',
  'parametros': 'admin:stats',
  'system_settings': 'admin:stats',
  'maestro_ipc': 'admin:stats',
  'maestros_operativos': 'admin:stats',
  'maestro_emergencias': 'emergencies:view',
  'emergencias': 'emergencies:view'
};

const regex = /app\.(get|post|put|delete)\('\/api\/([^/',]*)'?,?(?!\s*authorize)/g;

content = content.replace(regex, (match, method, endpointRaw) => {
    let base = endpointRaw.split('/:')[0].split('/upload')[0].split('/calculate')[0].split('/restore')[0].replace(/'$/, '');
    if(base === 'login' || base === 'health' || base === '') return match;

    if (base.startsWith('bulk')) base = 'bulk-export';
    if (base.startsWith('common-expenses')) base = 'common-expenses/rules';

    let perm = permMap[base] || 'admin:stats';

    if (base.includes('pagos_gastos_comunes') || base.includes('common_expense_payments')) {
        if (method === 'post' || method === 'put') perm = 'payments:create';
        else perm = 'payments:view';
    }

    return `app.${method}('/api/${endpointRaw}', authorize('${perm}'),`;
});

fs.writeFileSync(path, content, 'utf8');
console.log('RBAC Patch Applied!');
