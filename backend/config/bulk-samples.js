/**
 * Sample data for Massive Upload templates (v3.1.0)
 */
module.exports = {
  torres: {
    'nombre': 'Torre A'
  },
  tipos_unidad: {
    'nombre': 'Departamento 2D1B',
    'gasto_comun_base': 50000,
    'm2_por_defecto': 65
  },
  unidades: {
    'numero': '101',
    'piso': 1,
    'torre': 'Torre A',
    'tipo_unidad': 'Departamento 2D1B',
    'm2': 65,
    'valor': 120000000,
    'dormitorios': 2,
    'banos': 1,
    'estacionamientos': 1,
    'disponible': 'SÍ',
    'rol_sii': '123-456'
  },
  estacionamientos: {
    'numero': 'E-01',
    'ubicacion': 'Subterráneo -1',
    'discapacitado': 'NO',
    'departamento_id': '101'
  },
  espacios: {
    'nombre': 'Quincho Central',
    'ubicacion': 'Azotea Torre A',
    'valor_arriendo': 15000,
    'duracion_horas': 4,
    'condiciones': 'Limpieza obligatoria, aforo máx 15 personas.'
  },
  propietarios: {
    'nombres': 'Juan Alberto',
    'apellidos': 'Pérez Cotapos',
    'rut': '12.345.678-9',
    'correo': 'juan.perez@example.com',
    'telefono': '+56912345678',
    'notificaciones_residente': 'SÍ',
    'ver_deuda_residente': 'SÍ'
  },
  residentes: {
    'nombres': 'María José',
    'apellidos': 'López Hurtado',
    'rut': '18.765.432-1',
    'correo': 'maria.lopez@example.com',
    'telefono': '+56987654321',
    'torre_id': 'Torre A',
    'unidad_id': '101',
    'integrantes_familia': 3,
    'tiene_mascotas': 'SÍ',
    'es_arrendatario': 'SÍ',
    'monto_arriendo': 450000
  },
  personal: {
    'nombres': 'Carlos Eduardo',
    'apellidos': 'Sánchez Ruiz',
    'rut': '15.555.555-K',
    'cargo': 'Conserje',
    'telefono': '+56955555555',
    'correo': 'carlos.sanchez@sgc.cl',
    'honorario': 'NO',
    'sueldo_base': 550000,
    'dias_vacaciones': 15,
    'banco_id': 'Banco de Chile',
    'numero_cuenta': '1234567890'
  },
  afps: {
    'nombre': 'Provida',
    'tasa_descuento': 11.45
  },
  previsiones: {
    'nombre': 'Fonasa',
    'tipo': 'PÚBLICO',
    'tasa_descuento': 7
  },
  bancos: {
    'nombre': 'Banco Estado'
  },
  articulos_personal: {
    'nombre': 'Chaleco Reflectante',
    'descripcion': 'Color amarillo, talla L',
    'categoria': 'Seguridad',
    'unidad': 'UN',
    'precio': 12000,
    'stock': 50,
    'stock_minimo': 5
  },
  maestro_categorias_articulos: {
    'nombre': 'Seguridad',
    'tipo': 'article_category'
  },
  emergencias: {
    'nombre': 'Bomberos',
    'telefono': '132',
    'categoria': 'Seguridad',
    'descripcion': 'Cuerpo de Bomberos de Santiago'
  },
  mensajes_dirigidos: {
    'unidad_id': '101',
    'mensaje': 'Aviso de mantención de ascensores para mañana.',
    'tipo': 'info',
    'activo': 'SÍ'
  }
};
