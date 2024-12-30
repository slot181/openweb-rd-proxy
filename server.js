const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'http://182.44.1.58:4000', // 目标 IP 和端口
  secure: false, // 禁用 SSL 证书验证,用于自签证书
  changeOrigin: true,
  ws: true, // 支持 WebSocket
  onProxyRes: (proxyRes, req, res) => {
    // 添加 Access-Control-Allow-Origin 头
    proxyRes.headers['Access-Control-Allow-Origin'] = '*'; // 或者你的域名
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
}));

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy server is running');
});
