const net = require('net');

const MYSQL_HOST = '119.12.166.116';
const MYSQL_PORT = 3306;
const LOCAL_PORT = process.env.PORT || 3306;

const server = net.createServer((clientSocket) => {
  // 设置 keepalive
  clientSocket.setKeepAlive(true, 60000);
  
  const serverSocket = net.connect({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    keepAlive: true
  });

  clientSocket.pipe(serverSocket);
  serverSocket.pipe(clientSocket);

  // 优化错误处理
  clientSocket.on('error', (err) => {
    if(err.code !== 'ECONNRESET') {
      console.log('Client socket error:', err);
    }
    // 清理连接
    serverSocket.end();
  });
  
  serverSocket.on('error', (err) => {
    console.log('Server socket error:', err);
    // 清理连接
    clientSocket.end();
  });

  // 处理连接关闭
  clientSocket.on('end', () => {
    serverSocket.end();
  });

  serverSocket.on('end', () => {
    clientSocket.end();
  });
});

// 服务器错误处理
server.on('error', (err) => {
  console.log('Server error:', err);
});

server.listen(LOCAL_PORT, () => {
  console.log(`TCP proxy listening on port ${LOCAL_PORT}`);
});
