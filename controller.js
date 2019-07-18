const fs = require('fs').promises;
const db = require('./db');

/**
 * 404 Error page
 * @param {Object} [req]
 * @param {Object} res
 */
exports.notFound = async (req, res) => {
  const file = await fs.readFile('./404.html');
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.end(file);
};

/**
 * Handles Homepage
 * @param {Object} [req]
 * @param {Object} res
 */
exports.getHome = (req, res) => {
  // sets status code and writes header
  res.writeHead(200, {
    'My-cutom-header': 'Im so awesome',
  });
  // send the response to client with data
  res.end('Welcome to my server');
};

/**
 * Gets status of server
 * @param {Object} [req]
 * @param {Object} res
 */
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

/**
 * gets a file
 * @param {Object} [req]
 * @param {Object} res
 * @param {String} pathname
 */
exports.getFile = (req, res, pathname) => {
  const file = pathname.split('/')[2];
  if (!file) {
    res.writeHead(400);
    return res.end('400: Bad Request');
  }

  db.getFile(file)
    .then(data => {
      res.writeHead(200);
      return res.end(JSON.stringify(data));
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(err));
    });
};

/**
 * Gets a value from file with key
 * @param {Object} [req]
 * @param {Object} res
 * @returns {String} data
 */
exports.getValue = (req, res, { file, key }) => {
  // gets value based on query params
  try { 
    if (!file || !key) {
      res.writeHead(400);
      return res.end('400 Bad request');
    }
    db.get(file, key).then(data => {
      res.writeHead(200);
      return res.end(data);
    })
      .catch(err => {
        res.writeHead(400, {
          'Content-Type': 'application/json',
        });
        return res.end(JSON.stringify(err));
      });
  } catch (err) {
    res.writeHead(400, {
      'Content-Type': 'text/html'
    });
    res.end(err.message);
  }
};

/**
 * Updates file with different value
 * @param {Object} [req]
 * @param {Object} res
 */
exports.setDB = (req, res, { file, key, value }) => {
  // check if file, key and value are defined
  if (!file || !key || !value) {
    res.writeHead(400);
    return res.end();
  }

  // fires off the db set method
  db
    .set(file, key, value)
    .then(() => {
      res.writeHead(200);
      return res.end('Value Set');
    })
    .catch(err => {
      // TODO: more robust errors handling
      res.writeHead(400, {
        'Content-Type': 'text/html'
      });
      return res.end(err.message);
      // res.end(JSON.stringify(err));
    });
};

/**
 * Writes file
 * @param {Object} [req]
 * @param {Object} res
 * @param {String} pathname
 */
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
      return res.end('File Written');
    });
  } catch (err) {
    res.writeHead(400, {
      'Content-Type': 'text/html'
    });
    return res.end(err.message);
  }
};

/**
 * Deletes value in file with key
 * @param {Object} [req]
 * @param {Object} res
 * @param {Object} query
 */
exports.deleteValue = (req, res, { file, key }) => {
  if (!file || !key) {
    res.writeHead(400);
    return res.end();
  }
  db.remove(file, key).then(() => {
    res.writeHead(200);
    return res.end(`${key} deleted from ${file}`);
  })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(err));
    });
};

/**
 * Deletes file
 * @param {Object} [req]
 * @param {Object} res
 * @param {String} pathname
 */
exports.deleteFile = (req, res, pathname) => {
  const file = pathname.split('/')[2];
  if (!file) {
    res.writeHead(400);
    return res.end('400: Bad Request');
  }

  db.deleteFile(file)
    .then(() => {
      res.writeHead(200);
      return res.end(`Deleted ${file}`);
    })
    .catch(err => {
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      return res.end(JSON.stringify(err));
    });
};