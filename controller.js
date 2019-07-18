const fs = require('fs').promises;
const db = require('./db');

exports.notFound = async (req, res) => {
  const file = await fs.readFile('./404.html');
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.end(file);
};

exports.getHome = (req, res) => {
  // sets status code and writes header
  res.writeHead(200, {
    'My-cutom-header': 'Im so awesome',
  });
  // send the response to client with data
  res.end('Welcome to my server');
};

exports.getStatus = (req, res) => {
  const status = {
    up: true,
    owner: 'Ivy',
    timestamp: Date.now(),
  };
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(status));
};

exports.setDB = (req, res, { file, key, value }) => {
  // check if fiel, key and value are defined
  if (!file || !key || !value) {
    res.writeHead(400);
    return res.end();
  }

  // fires off the db set method
  db
    .set(file, key, value)
    .then(() => {
      res.writeHead(200);
      res.end('Value Set');
    })
    .catch(err => {
      // TODO: more robust errors handling
      res.writeHead(400, {
        'Content-Type': 'text/html'
      });
      res.end(err.message);
      // res.end(JSON.stringify(err));
    });
};

exports.postWrite = (req, res, pathname) => {
  try { 
    // event emitted when req recieves data
    const data = [];
    req.on('data', chunk => data.push(chunk));
    // event emitted when resq recieved all the data
    req.on('end', async () => {
      const body = JSON.parse(data);
      await db.createFile(pathname.split('/')[2], body);
      res.writeHead(201, {
        'Content-Type': 'text/html'
      });
      res.end('File Written');
    });
    // return the file if already exists
  } catch (err) {
    res.writeHead(400, {
      'Content-Type': 'text/html'
    });
    res.end(err.message);
  }
};