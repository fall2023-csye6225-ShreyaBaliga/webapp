// middleware.js

function handleInvalidURLs(req, res, next) {
    if (!req.url.startsWith('/healthz')) {
      res.status(400).send();
    } else {
      next();
    }
  }
  
  function handleUnsupportedMethods(req, res, next) {
    if (req.method !== 'GET') {
      res.status(405).send();
    } else {
      next();
    }
  }
  
  module.exports = {
    handleInvalidURLs,
    handleUnsupportedMethods,
  };
  