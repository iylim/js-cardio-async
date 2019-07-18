const http = require('http');
const db = require('./db');
const handleRoutes = require('./routes');

const { PORT } = db;

const server = http.createServer();

server.on('request', handleRoutes);

// opens up server on port
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
