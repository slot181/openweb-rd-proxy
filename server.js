const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'http://182.44.1.58:4180', // 目标 IP 和端口
  secure: false, // 禁用 SSL 证书验证,用于自签证书
  changeOrigin: true,
  ws: true, // 支持 WebSocket
}));

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy server is running');
});
