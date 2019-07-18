const url = require('url');
const { getHome, getStatus, setDB, notFound, postWrite } = require('./controller');

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

  // if (pathname === '/get' && req.method === 'GET') {

  // }

  notFound(req, res);
};

module.exports = handleRoutes;