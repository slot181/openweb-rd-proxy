const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 代理配置
const proxyOptions = {
  target: 'http://182.44.1.58:4000',
  secure: false,
  changeOrigin: true,
  ws: true, // WebSocket 支持
  // 添加代理事件处理
  onProxyReq: (proxyReq, req, res) => {
    // 保留原始 host
    proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
    // 设置协议
    proxyReq.setHeader('X-Forwarded-Proto', 'https');
  },
  // 添加自定义请求头
  headers: {
    'X-Real-IP': '${req.ip}',
    'X-Forwarded-For': '${req.ip}',
  },
  // 处理 WebSocket
  wsOptions: {
    reconnect: true,
  },
  // 路径重写(如果需要)
  pathRewrite: {
    '^/': '/', // 保持路径不变
  },
  // 错误处理
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
  }
};

// 应用代理中间件
app.use('/', createProxyMiddleware(proxyOptions));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Application Error:', err);
  res.status(500).send('Server Error');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
