const http = require('http');
const db = require('./db');
const handleRoutes = require('./routes');

const { PORT } = db;

const server = http.createServer();

// listens for the request event on our server
// event will be fired anytime someone makes a request
// takes a callback with request and response
// request is what client sent to us
// response is what we send back
server.on('request', handleRoutes);

// opens up server on port
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
