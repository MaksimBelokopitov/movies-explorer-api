const allowedCors = [
  'http://moviebox.nomoredomainsmonster.ru',
  'https://moviebox.nomoredomainsmonster.ru',
  'https://api.moviebox.nomoredomainsmonster.ru',
  'http://api.moviebox.nomoredomainsmonster.ru',
  'http://localhost:3001',
  'http://localhost:3000',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
};

module.exports = cors;
