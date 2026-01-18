const http = require('http');
const { spawn } = require('child_process');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: body ? JSON.parse(body) : null }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('Starting Notes API verification...');
    let serverProcess;

    try {
        // Start server
        console.log('Spawning server...');
        serverProcess = spawn('node', ['src/server.js'], {
            cwd: __dirname,
            stdio: 'pipe',
            shell: true
        });

        serverProcess.stdout.on('data', (data) => console.log(`[Server]: ${data}`));
        serverProcess.stderr.on('data', (data) => console.error(`[Server Error]: ${data}`));

        // Wait for server to start
        await new Promise((resolve, reject) => {
            const onData = (data) => {
                if (data.toString().includes('Server running')) {
                    serverProcess.stdout.removeListener('data', onData);
                    resolve();
                }
            };
            serverProcess.stdout.on('data', onData);
            serverProcess.on('error', reject);
            setTimeout(() => reject(new Error('Server start timeout')), 5000);
        });

        console.log('Server started. Running tests...');
        const PORT = 3001; // Assuming port 3001 from .env

        // 1. GET /notes (initial)
        console.log('Test 1: GET /notes (initial)');
        let res = await request({ hostname: 'localhost', port: PORT, path: '/notes', method: 'GET' });
        console.log('Status:', res.statusCode);
        console.log('Body:', res.body);
        if (res.statusCode !== 200 || res.body.length !== 1) throw new Error('Test 1 Failed'); // Should have 1 default note

        // 2. POST /notes
        console.log('\nTest 2: POST /notes');
        const note = { title: 'New Note', content: 'Testing content' };
        res = await request({
            hostname: 'localhost',
            port: PORT,
            path: '/notes',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, note);
        console.log('Status:', res.statusCode);
        if (res.statusCode !== 201 || res.body.title !== 'New Note') throw new Error('Test 2 Failed');
        const noteId = res.body.id;

        // 3. PUT /notes/:id
        console.log('\nTest 3: PUT /notes/:id');
        const update = { title: 'Updated Note' };
        res = await request({
            hostname: 'localhost',
            port: PORT,
            path: `/notes/${noteId}`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }, update);
        console.log('Status:', res.statusCode);
        if (res.statusCode !== 200 || res.body.title !== 'Updated Note') throw new Error('Test 3 Failed');

        // 4. DELETE /notes/:id
        console.log('\nTest 4: DELETE /notes/:id');
        res = await request({ hostname: 'localhost', port: PORT, path: `/notes/${noteId}`, method: 'DELETE' });
        console.log('Status:', res.statusCode);
        if (res.statusCode !== 204) throw new Error('Test 4 Failed');

        console.log('\nALL NOTES TESTS PASSED!');
    } catch (err) {
        console.error('\nTEST FAILED:', err.message);
        process.exit(1);
    } finally {
        if (serverProcess) {
            console.log('Stopping server...');
            const { exec } = require('child_process');
            if (process.platform === 'win32') {
                exec(`taskkill /pid ${serverProcess.pid} /T /F`);
            } else {
                serverProcess.kill();
            }
        }
    }
}

runTests();
