'use strict';

const net = require('net');

const port = process.env.PORT || 3001;
const server = net.createServer();

server.listen(port, () => {
  console.log(`Chatroom Server on ${port}`);
});