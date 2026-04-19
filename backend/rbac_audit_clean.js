
const http = require('http');

const users = [
    { name: 'resident', email: 'residente@sgc.cl', pass: 'sgc123' },
    { name: 'concierge', email: 'conserje@sgc.cl', pass: 'sgc123' }
];

const auditEndpoints = [
    '/api/personal',
    '/api/perfiles',
    '/api/activo_fijo',
    '/api/configuracion',
    '/api/residentes'
];

async function request(path, method, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                let parsed = body;
                try { parsed = JSON.parse(body); } catch(e) {}
                resolve({ status: res.statusCode, data: parsed });
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runAudit() {
    process.stdout.write('Endpoint | Rol | Status | Resultado\n');
    process.stdout.write('---------|-----|--------|----------\n');

    for (const user of users) {
        const login = await request('/api/login', 'POST', { username: user.email, password: user.pass });
        if (login.status !== 200) {
            process.stdout.write(`LOGIN FAIL | ${user.name} | ${login.status} | ERROR\n`);
            continue;
        }
        const token = login.data.token;

        for (const endpoint of auditEndpoints) {
            const res = await request(endpoint, 'GET', null, token);
            let result = 'ERROR (fuga)';
            if (res.status === 401 || res.status === 403) {
                result = 'OK';
            } else if (res.status === 200) {
                // Potential leak, unless it's a filtered response
                if (endpoint === '/api/residentes' && user.name === 'resident') {
                    if (Array.isArray(res.data) && res.data.length > 1) {
                         result = 'ERROR (fuga global)';
                    } else {
                         result = 'OK (filtrado/propio)';
                    }
                }
            }
            process.stdout.write(`${endpoint} | ${user.name} | ${res.status} | ${result}\n`);
        }
    }
}

runAudit().catch(console.error);
