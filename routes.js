const url = require('url');
const { getHome, getFile, getStatus, setDB, notFound, postWrite, getValue, deleteValue, deleteFile, mergeFile } = require('./controller');

const handleRoutes = (req, res) => {
  // parse url to an object
  const parsedURL = url.parse(req.url, true);
  const { pathname, query } = parsedURL;
  // check if req was get on / route 
  if (pathname === '/' && req.method === 'GET') {
    return getHome(req, res);
  }

  if (pathname === '/status' && req.method === 'GET') {
    return getStatus(req, res);
  }
  
  if (pathname === '/set' && req.method === 'PATCH') {
    return setDB(req, res, query);
  }

  if (pathname.startsWith('/write') && req.method === 'POST') {
    return postWrite(req, res, pathname);
  }

  if (pathname === '/get' && req.method === 'GET') {
    return getValue(req, res, query);
  }

  if (pathname.startsWith('/get/') && req.method === 'GET') {
    return getFile(req, res, pathname);
  }

  if (pathname === '/delete' && req.method === 'DELETE') {
    return deleteValue(req, res, query);
  }

  if (pathname.startsWith('/delete/') && req.method === 'DELETE') {
    return deleteFile(req, res, pathname);
  }

  if (pathname === '/merge' && req.method === 'POST') {
    return mergeFile(req, res);
  }

  notFound(req, res);
};

module.exports = handleRoutes;