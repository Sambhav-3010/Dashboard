import http from 'http';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Dashboard Server Running!</h1><p>Your server is working.</p>');
});

const port = 3000;
server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});