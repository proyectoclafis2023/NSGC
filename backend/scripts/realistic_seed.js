const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function cleanup() {
    console.log('🧹 --- CLEANING DATABASE ---');
    // Order matters due to FK constraints
    await prisma.shiftLog.deleteMany();
    await prisma.dailyReport.deleteMany();
    await prisma.visita.deleteMany();
    await prisma.correspondence.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.reserva.deleteMany();
    await prisma.estacionamiento.deleteMany();
    await prisma.department.deleteMany();
    await prisma.personnel.deleteMany();
    await prisma.propietario.deleteMany();
    await prisma.residente.deleteMany();
    await prisma.tower.deleteMany();
    await prisma.tipoUnidad.deleteMany();
    await prisma.banco.deleteMany();
    await prisma.pensionFund.deleteMany();
    await prisma.healthProvider.deleteMany();
    await prisma.articulo.deleteMany();
    await prisma.fixedAsset.deleteMany();
    await prisma.plantillaComunicacion.deleteMany();
    await prisma.numeroEmergencia.deleteMany();
    await prisma.parametroSistema.deleteMany();
    console.log('✨ Database cleaned.');
}

async function main() {
    console.log('🚀 --- REALISTIC SGC SEED START ---');
    
    await cleanup();

    const defaultHashed = await bcrypt.hash('sgc123', 10);

    // 1. Bancos Reales
    const bancos = ['Banco de Chile', 'Banco Estado', 'BCI', 'Santander', 'Itau', 'Scotiabank', 'Banco BICE', 'Banco Security'];
    const bancoIds = [];
    for (const b of bancos) {
        const created = await prisma.banco.upsert({
            where: { nombre: b },
            update: {},
            create: { nombre: b }
        });
        bancoIds.push(created.id);
    }

    // 2. AFPs Reales
    const afps = [
        { name: 'Provida', discountRate: 11.45 },
        { name: 'Habitat', discountRate: 11.27 },
        { name: 'Capital', discountRate: 11.44 },
        { name: 'Cuprum', discountRate: 11.44 },
        { name: 'Modelo', discountRate: 10.58 },
        { name: 'PlanVital', discountRate: 11.16 },
        { name: 'Uno', discountRate: 10.69 }
    ];
    const afpIds = [];
    for (const a of afps) {
        const created = await prisma.pensionFund.upsert({
            where: { name: a.name },
            update: { discountRate: a.discountRate },
            create: { name: a.name, discountRate: a.discountRate }
        });
        afpIds.push(created.id);
    }

    // 3. Previsiones (Isapres/Fonasa)
    const previsiones = [
        { name: 'Fonasa', type: 'Publico', discountRate: 7 },
        { name: 'Consalud', type: 'Isapre', discountRate: 7 },
        { name: 'Colmena', type: 'Isapre', discountRate: 7 },
        { name: 'Cruz Blanca', type: 'Isapre', discountRate: 7 },
        { name: 'Banmédica', type: 'Isapre', discountRate: 7 },
        { name: 'Vida Tres', type: 'Isapre', discountRate: 7 },
        { name: 'Nueva Masvida', type: 'Isapre', discountRate: 7 }
    ];
    const previsionIds = [];
    for (const p of previsiones) {
        const created = await prisma.healthProvider.upsert({
            where: { name: p.name },
            update: { type: p.type, discountRate: p.discountRate },
            create: { name: p.name, type: p.type, discountRate: p.discountRate }
        });
        previsionIds.push(created.id);
    }

    // 4. Infraestructura Base
    const unitTypes = [
        { nombre: 'Depto Tipo A (57m2)', baseCommonExpense: 55000, defaultM2: 57 },
        { nombre: 'Depto Tipo B (65m2)', baseCommonExpense: 62000, defaultM2: 65 },
        { nombre: 'Local Comercial Pequeño (30m2)', baseCommonExpense: 45000, defaultM2: 30 },
        { nombre: 'Local Comercial Grande (60m2)', baseCommonExpense: 80000, defaultM2: 60 }
    ];
    const utMap = {};
    for (const ut of unitTypes) {
        const created = await prisma.tipoUnidad.upsert({
            where: { nombre: ut.nombre },
            update: ut,
            create: ut
        });
        utMap[ut.nombre] = created.id;
    }

    const tower1 = await prisma.tower.upsert({ where: { name: 'Torre 1' }, update: {}, create: { name: 'Torre 1' } });
    const tower2 = await prisma.tower.upsert({ where: { name: 'Torre 2' }, update: {}, create: { name: 'Torre 2' } });

    // 5. Unidades (Deptos y Locales)
    console.log('🏢 Generando unidades...');
    const units = [];
    const towers = [tower1, tower2];
    
    for (const t of towers) {
        for (let floor = 1; floor <= 4; floor++) {
            for (let d = 1; d <= 4; d++) {
                const number = `${t.name === 'Torre 1' ? '1' : '2'}${floor}0${d}`;
                const type = d % 2 === 0 ? 'Depto Tipo B (65m2)' : 'Depto Tipo A (57m2)';
                const u = await prisma.department.upsert({
                    where: { number_towerId: { number, towerId: t.id } },
                    update: { floor, m2: utMap[type] === utMap['Depto Tipo B (65m2)'] ? 65 : 57, unitTypeId: utMap[type] },
                    create: {
                        number,
                        floor,
                        towerId: t.id,
                        unitTypeId: utMap[type],
                        m2: utMap[type] === utMap['Depto Tipo B (65m2)'] ? 65 : 57
                    }
                });
                units.push(u);
            }
        }
    }

    // Locales Comerciales en Torre 1, Piso 1
    const locales = [
        { number: 'L-01', type: 'Local Comercial Pequeño (30m2)', m2: 30 },
        { number: 'L-02', type: 'Local Comercial Pequeño (30m2)', m2: 30 },
        { number: 'L-03', type: 'Local Comercial Grande (60m2)', m2: 60 }
    ];
    for (const l of locales) {
        const u = await prisma.department.upsert({
            where: { number_towerId: { number: l.number, towerId: tower1.id } },
            update: { floor: 1, m2: l.m2, unitTypeId: utMap[l.type] },
            create: {
                number: l.number,
                floor: 1,
                towerId: tower1.id,
                unitTypeId: utMap[l.type],
                m2: l.m2
            }
        });
        units.push(u);
    }

    // 6. Propietarios y Residentes
    console.log('👥 Generando personas con nombres humanos...');
    const owners = [];

    const humanNames = [
        'Sebastián', 'Javiera', 'Nicolás', 'María Paz', 'José Ignacio', 'Camila', 'Diego', 'Valentina', 
        'Felipe', 'Francisca', 'Cristóbal', 'Catalina', 'Gabriel', 'Antonia', 'Martín', 'Constanza',
        'Gonzalo', 'Fernanda', 'Joaquín', 'Daniela', 'Ricardo', 'Bárbara', 'Matías', 'Pía',
        'Andrés', 'Loreto', 'Patricio', 'Claudia', 'Rodrigo', 'Mónica', 'Francisco', 'Elena'
    ];
    const humanLastNames = [
        'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 
        'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres',
        'Araya', 'Flores', 'Espinoza', 'Valenzuela', 'Castillo', 'Tapia', 'Reyes', 'Gutiérrez',
        'Castro', 'Pizarro', 'Álvarez', 'Vásquez', 'Sánchez', 'Tapia', 'Carrasco', 'Gómez'
    ];

    for (let i = 1; i <= units.length; i++) {
        const propDni = `${10000000 + i}-${i % 10 === 0 ? 'K' : i % 10}`;
        const nameIdx = (i - 1) % humanNames.length;
        const lastIdx = (i - 1) % humanLastNames.length;
        const lastIdx2 = (i + 5) % humanLastNames.length;

        const owner = await prisma.propietario.upsert({
            where: { dni: propDni },
            update: {
                names: humanNames[nameIdx],
                lastNames: `${humanLastNames[lastIdx]} ${humanLastNames[lastIdx2]}`,
                email: `p.${humanNames[nameIdx].toLowerCase().replace(' ', '')}${i}@gmail.com`
            },
            create: {
                dni: propDni,
                names: humanNames[nameIdx],
                lastNames: `${humanLastNames[lastIdx]} ${humanLastNames[lastIdx2]}`,
                email: `p.${humanNames[nameIdx].toLowerCase().replace(' ', '')}${i}@gmail.com`,
                phone: `+569${80000000 + i}`
            }
        });
        owners.push(owner);

        const isResidentOwner = i <= (units.length * 0.3);
        let residentId = null;

        if (isResidentOwner) {
            const res = await prisma.residente.upsert({
                where: { dni: propDni },
                update: {
                    names: owner.names,
                    lastNames: owner.lastNames,
                    email: owner.email
                },
                create: {
                    dni: propDni,
                    names: owner.names,
                    lastNames: owner.lastNames,
                    email: owner.email,
                    phone: owner.phone
                }
            });
            residentId = res.id;
        } else {
            const resDni = `${20000000 + i}-${(i + 5) % 10 === 0 ? 'K' : (i + 5) % 10}`;
            const resNameIdx = (i + 15) % humanNames.length;
            const resLastIdx = (i + 15) % humanLastNames.length;
            const resLastIdx2 = (i + 20) % humanLastNames.length;

            const res = await prisma.residente.upsert({
                where: { dni: resDni },
                update: {
                    names: humanNames[resNameIdx],
                    lastNames: `${humanLastNames[resLastIdx]} ${humanLastNames[resLastIdx2]}`,
                    email: `r.${humanNames[resNameIdx].toLowerCase().replace(' ', '')}${i}@gmail.com`
                },
                create: {
                    dni: resDni,
                    names: humanNames[resNameIdx],
                    lastNames: `${humanLastNames[resLastIdx]} ${humanLastNames[resLastIdx2]}`,
                    email: `r.${humanNames[resNameIdx].toLowerCase().replace(' ', '')}${i}@gmail.com`,
                    phone: `+569${70000000 + i}`,
                    isTenant: true
                }
            });
            residentId = res.id;
        }

        await prisma.department.update({
            where: { id: units[i - 1].id },
            data: { ownerId: owner.id, residentId: residentId }
        });
    }

    // 7. Estacionamientos (73)
    console.log('🚗 Generando estacionamientos...');
    for (let i = 1; i <= 73; i++) {
        const randomUnit = units[Math.floor(Math.random() * units.length)];
        await prisma.estacionamiento.upsert({
            where: { number: `E-${i.toString().padStart(3, '0')}` },
            update: { departmentId: randomUnit.id },
            create: {
                number: `E-${i.toString().padStart(3, '0')}`,
                location: i <= 40 ? 'Subterráneo -1' : 'Subterráneo -2',
                departmentId: randomUnit.id
            }
        });
    }

    // 8. Personal
    console.log('👔 Generando personal...');
    const adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });
    const conciergeRole = await prisma.role.findFirst({ where: { name: 'concierge' } });

    // Administrador
    await prisma.personnel.upsert({
        where: { dni: '15.234.567-8' },
        update: { 
            roleId: adminRole.id,
            bankId: bancoIds[1], // Banco Estado
            pensionFundId: afpIds[1], // Habitat
            healthProviderId: previsionIds[1], // Consalud
        },
        create: {
            dni: '15.234.567-8',
            names: 'Rodolfo',
            lastNames: 'Santander',
            email: 'rodolfo.santander@dh4rm4.tech',
            password: defaultHashed,
            roleId: adminRole.id,
            position: 'Administrador General',
            status: 'active',
            baseSalary: 1200000,
            address: 'Av. Providencia 1234, Depto 501, Santiago',
            bankId: bancoIds[1],
            pensionFundId: afpIds[1],
            healthProviderId: previsionIds[1]
        }
    });

    const personnelData = [
        { dni: '10.111.222-3', names: 'Juan', lastNames: 'Pérez Soto', roleId: conciergeRole.id, position: 'Conserje Turno Mañana', baseSalary: 550000, address: 'Calle Falsa 123, San Miguel', bankId: bancoIds[0], pensionFundId: afpIds[0], healthProviderId: previsionIds[0], createdAt: new Date('2022-01-15') },
        { dni: '12.444.555-6', names: 'María', lastNames: 'López Jara', roleId: conciergeRole.id, position: 'Conserje Turno Tarde', baseSalary: 550000, address: 'Pasaje El Olmo 44, La Florida', bankId: bancoIds[2], pensionFundId: afpIds[1], healthProviderId: previsionIds[1], createdAt: new Date('2023-05-20') },
        { dni: '14.777.888-9', names: 'Carlos', lastNames: 'Ruiz Díaz', roleId: conciergeRole.id, position: 'Conserje Turno Noche', baseSalary: 550000, address: 'Av. Las Condes 9999, Las Condes', bankId: bancoIds[3], pensionFundId: afpIds[2], healthProviderId: previsionIds[2], createdAt: new Date('2024-02-10') },
        { dni: '18.333.444-K', names: 'Ana', lastNames: 'Gómez Vidal', roleId: adminRole.id, position: 'Asesora Contable (Honorarios)', baseSalary: 400000, isHonorary: true, address: 'Freelance - Trabajo Remoto' }
    ];

    for (const p of personnelData) {
        await prisma.personnel.upsert({
            where: { dni: p.dni },
            update: p,
            create: { ...p, password: defaultHashed, status: 'active', email: `${p.names.toLowerCase()}.${p.lastNames.split(' ')[0].toLowerCase()}@sgc.cl` }
        });
    }

    // 9. Maestro de Insumos
    console.log('🧹 Generando insumos...');
    const insumos = [
        { nombre: 'Cloro Industrial 5L', category: 'ASEO', unit: 'Bidón', stock: 10, price: 4500 },
        { nombre: 'Limpia Pisos Lavanda 5L', category: 'ASEO', unit: 'Bidón', stock: 8, price: 3800 },
        { nombre: 'Bolsas de Basura XL', category: 'ASEO', unit: 'Paquete 10u', stock: 20, price: 2500 },
        { nombre: 'Papel Higiénico Industrial', category: 'ASEO', unit: 'Rollo', stock: 24, price: 1200 },
        { nombre: 'Resma Papel A4', category: 'OFICINA', unit: 'Resma', stock: 15, price: 4200 },
        { nombre: 'Toner Impresora HP', category: 'OFICINA', unit: 'Unidad', stock: 2, price: 45000 },
        { nombre: 'Carpetas Archivadoras', category: 'OFICINA', unit: 'Unidad', stock: 30, price: 800 },
        { nombre: 'Café Grano 1kg', category: 'CAFETERIA', unit: 'Bolsa', stock: 5, price: 12500 },
        { nombre: 'Azúcar 1kg', category: 'CAFETERIA', unit: 'Kilo', stock: 10, price: 1100 },
        { nombre: 'Té 100 bolsitas', category: 'CAFETERIA', unit: 'Caja', stock: 12, price: 3500 }
    ];
    for (const ins of insumos) {
        await prisma.articulo.upsert({
            where: { nombre: ins.nombre },
            update: ins,
            create: ins
        });
    }

    // 10. Activo Fijo
    console.log('📸 Generando activos fijos...');
    const activos = [
        { description: 'Cámara Domo IP 4MP Hikvision', quantity: 12, purchasePrice: 45000, model: 'DS-2CD2143G0-I', details: 'Pasillos y accesos' },
        { description: 'Cámara Bullet PTZ Exterior', quantity: 8, purchasePrice: 120000, model: 'PTZ-8822', details: 'Perímetro y estacionamientos' },
        { description: 'Computador Administración HP Pavilion', quantity: 2, purchasePrice: 650000, model: 'Pavilion Desktop', details: 'Oficina administración' },
        { description: 'Televisor Monitoreo CCTV 55"', quantity: 1, purchasePrice: 350000, model: 'Samsung Series 7', details: 'Sala de conserjería' },
        { description: 'Manguera Riego Reforzada 25m', quantity: 4, purchasePrice: 15000, model: 'Tramontina', details: 'Jardines comunes' },
        { description: 'Cortadora de Arbustos Eléctrica', quantity: 1, purchasePrice: 85000, model: 'Black+Decker BEHT201', details: 'Bodega jardinería' }
    ];
    for (const act of activos) {
        await prisma.fixedAsset.upsert({
            where: { description: act.description },
            update: act,
            create: { ...act, isActive: true, purchaseDate: '2024-01-10' }
        });
    }

    // 11. Maestro de Mensajes (Plantillas)
    console.log('💬 Generando plantillas de comunicación...');
    const plantillas = [
        { nombre: 'Aviso de Mantención de Ascensores', subject: 'Mantención Programada: Ascensores', message: 'Estimados residentes, informamos que mañana se realizará la mantención de los ascensores de la Torre {{tower}}.', type: 'información' },
        { nombre: 'Recordatorio Pago Gastos Comunes', subject: 'Vencimiento Gasto Común', message: 'Estimado/a {{name}}, le recordamos que el plazo para el pago del gasto común vence el día 5 de este mes.', type: 'cobranza' },
        { nombre: 'Suspensión de Agua Potable', subject: 'CORTE DE AGUA EMERGENCIA', message: 'Atención: Debido a una rotura de matriz externa, el servicio de agua potable será suspendido por 4 horas.', type: 'urgente' },
        { nombre: 'Citación a Asamblea Ordinaria', subject: 'Primera Asamblea General 2024', message: 'Se cita a todos los copropietarios a la asamblea que se realizará en el salón de eventos el próximo sábado.', type: 'comunidad' }
    ];
    for (const pl of plantillas) {
        await prisma.plantillaComunicacion.create({
            data: pl
        });
    }

    // 12. Números de Emergencia Realistas
    console.log('🚨 Generando números de emergencia...');
    const emergencias = [
        { nombre: 'Carabineros (Plan Cuadrante)', phone: '133', category: 'Seguridad', description: 'Emergencias policiales y seguridad pública' },
        { nombre: 'Bomberos de Santiago', phone: '132', category: 'Incendios', description: 'Siniestros y rescates' },
        { nombre: 'Ambulancia (SAMU)', phone: '131', category: 'Salud', description: 'Urgencias médicas' },
        { nombre: 'Gas (Metrogas Emergencias)', phone: '600 337 8000', category: 'Servicios', description: 'Fugas de gas y roturas' },
        { nombre: 'Electricidad (Enel)', phone: '800 800 647', category: 'Servicios', description: 'Cortes de luz y peligros eléctricos' }
    ];
    for (const em of emergencias) {
        await prisma.numeroEmergencia.upsert({
            where: { nombre: em.nombre },
            update: em,
            create: em
        });
    }

    // 13. Parámetros de Sistema (Categorías Insumos)
    console.log('⚙️ Generando parámetros de sistema...');
    const cats = ['ASEO', 'OFICINA', 'CAFETERIA', 'SEGURIDAD', 'JARDINERIA'];
    for (const c of cats) {
        await prisma.parametroSistema.upsert({
            where: { type_nombre: { type: 'article_category', nombre: c } },
            update: { isActive: true },
            create: { type: 'article_category', nombre: c, isActive: true }
        });
    }

    // 14. Datos Transaccionales (Visitas y Correspondencia)
    console.log('🚶 Generando transacciones...');
    const visitorNames = ['Claudio Rivas', 'Patricia Lagos', 'Jorge Valdivia', 'Mónica Godoy', 'Luis Jara'];
    for (let i = 0; i < 10; i++) {
        const randomUnit = units[Math.floor(Math.random() * units.length)];
        const vName = visitorNames[i % visitorNames.length];
        await prisma.visita.create({
            data: {
                folio: `VIS-${1000 + i}`,
                names: `${vName} ${humanLastNames[i % humanLastNames.length]}`,
                dni: `${15000000 + i}-${i % 9}`,
                departmentId: randomUnit.id,
                visitDate: '2024-04-22',
                visitTime: '10:30',
                status: i < 5 ? 'completed' : 'scheduled',
                entryTime: i < 5 ? '10:35' : null,
                exitTime: i < 3 ? '12:00' : null,
                notes: 'Visita familiar / entrega'
            }
        });
    }

    for (let i = 0; i < 8; i++) {
        const randomUnit = units[Math.floor(Math.random() * units.length)];
        const unitWithRes = await prisma.department.findUnique({ where: { id: randomUnit.id }, include: { resident: true } });
        await prisma.correspondence.create({
            data: {
                folio: `COR-${5000 + i}`,
                departmentId: randomUnit.id,
                type: 'Paquete',
                addressee: unitWithRes.resident ? `${unitWithRes.resident.names} ${unitWithRes.resident.lastNames}` : 'Residente Habitacional',
                status: i < 4 ? 'delivered' : 'pending',
                receivedAt: new Date(),
                deliveredAt: i < 4 ? new Date() : null
            }
        });
    }

    const pMañana = await prisma.personnel.findFirst({ where: { position: { contains: 'Mañana' } } });
    if (pMañana) {
        await prisma.dailyReport.create({
            data: {
                folio: 'REP-001',
                conciergeId: pMañana.id,
                conciergeName: `${pMañana.names} ${pMañana.lastNames}`,
                shiftDate: '2024-04-22',
                shiftType: 'Mañana',
                novedades: 'Sin novedades críticas. Se recibe turno con todo en orden. Se realiza ronda por estacionamientos nivel -1.',
                status: 'closed'
            }
        });
    }

    // 15. Configuración Inicial (Forzar Modo Noche)
    console.log('🌙 Configurando estética premium (Modo Noche)...');
    await prisma.systemSettings.create({
        data: {
            systemName: 'SGC - Gestión de Condominios',
            systemIcon: 'S',
            darkMode: true,
            theme: 'dark',
            cameraBackupDays: 7,
            vacationAccrualRate: 1.25,
            paymentDeadlineDay: 5,
            maxArrearsMonths: 3,
            arrearsFineAmount: 0,
            arrearsFinePercentage: 0,
            censusFrequencyYears: 5
        }
    });

    console.log('✅ --- REALISTIC SGC SEED FINISHED ---');
}

main()
    .catch(e => {
        console.error('❌ SEED ERROR:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
