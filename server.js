const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 添加重定向中间件
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    // 确保所有请求都使用 HTTPS
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

const proxyOptions = {
  target: 'http://182.44.1.58:4000',
  secure: false,
  changeOrigin: true,
  ws: true,
  onProxyReq: (proxyReq, req, res) => {
    // 确保所有转发的请求都带有正确的协议头
    proxyReq.setHeader('X-Forwarded-Proto', 'https');
    proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
    // 设置原始请求协议
    proxyReq.setHeader('X-Original-Proto', 'https');
  },
  // 添加协议相关的重写
  router: {
    'https://': 'http://' // 确保内部转发使用 http
  },
  // 修改响应头
  onProxyRes: (proxyRes, req, res) => {
    // 修改所有重定向响应的协议为 HTTPS
    if (proxyRes.headers.location) {
      proxyRes.headers.location = proxyRes.headers.location.replace(
        'http://',
        'https://'
      );
    }
  }
};

app.use('/', createProxyMiddleware(proxyOptions));

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
