const http = require('http');
const url = require('url');
const db = require('./db');

const { PORT } = db;

const server = http.createServer();

// listens for the request event on our server
// event will be fired anytime someone makes a request
// takes a callback with request and response
// request is what client sent to us
// response is what we send back
server.on('request', (req, res) => {
  // check if req was get on / route 
  if (req.url === '/' && req.method === 'GET') {
    // sets status code and writes header
    res.writeHead(200, {
      'My-cutom-header': 'Im so awesome',
    });
    // send the response to client with data
    res.end('Welcome to my server');
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    const status = {
      up: true,
      owner: 'Ivy',
      timestamp: Date.now(),
    };
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(status));
  }

  const parsedURL = url.parse(req.url, true);
  if (parsedURL.pathname === '/set' && req.method === 'PATCH') {
    // fires off the db set method
    return db
      .set(parsedURL.query.file, parsedURL.query.key, parsedURL.query.value)
      .then(() => res.end('Value Set'))
      .catch(err => {
      // TODO: handle errors
      });
  }
});

// opens up server on port #
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
