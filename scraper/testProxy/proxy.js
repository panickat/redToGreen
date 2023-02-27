const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = createProxyMiddleware('/api', {
  target: 'https://www.example.com',
  changeOrigin: true,
});

module.exports = function(app) {
  app.use(apiProxy);
};
