const net = require('net');

const MYSQL_HOST = '119.12.166.116';
const MYSQL_PORT = 3306;
const LOCAL_PORT = process.env.PORT || 3306;

const server = net.createServer((clientSocket) => {
  // 连接到目标 MySQL 服务器
  const serverSocket = net.connect({
    host: MYSQL_HOST,
    port: MYSQL_PORT
  });

  // 双向转发数据
  clientSocket.pipe(serverSocket);
  serverSocket.pipe(clientSocket);

  // 错误处理
  clientSocket.on('error', (err) => {
    console.log('Client socket error:', err);
  });
  
  serverSocket.on('error', (err) => {
    console.log('Server socket error:', err);
  });
});

server.listen(LOCAL_PORT, () => {
  console.log(`TCP proxy listening on port ${LOCAL_PORT}`);
});
