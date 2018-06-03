'use strict';

const port = process.env.PORT || 3001;


const EventEmitter = require('events');
const net = require('net');
const uuid = require('uuid/v4');

const server = net.createServer();
const eventEmitter = new EventEmitter();
const clientPool = {};

let User = function (socket) {
  let id = uuid();
  this.id = id;
  this.nickname = `user-${id}`;
  this.socket = socket;
};

server.on('connection', (socket) => {
  let user = new User(socket);
  clientPool[user.id] = user;
  socket.on('data', (buffer) => dispatcher(user.id, buffer));
});

server.on('error', (err) => {
  console.error(err);
});

let parseInput = (buffer) => {

  let text = buffer.toString().trim();
  if ( !text.startsWith('@') ) { return null; }
  let [command, payload] = text.split(/\s+(.*)/);
  let [target, message] = payload ? payload.split(/\s+(.*)/) : [];
  return {command, payload, target, message};
  
};

let dispatcher = (userId, buffer) => {
  let entry = parseInput(buffer);
  entry && eventEmitter.emit(entry.command, entry, userId);
};


eventEmitter.on('@all', (data, userId) => {
  for( let connection in clientPool ) {
    let user = clientPool[connection];
    user.socket.write(`<${clientPool[userId].nickname}>: ${data.payload}\n`);
  }
});

eventEmitter.on('@quit', (data, userId) => {
  for( let connection in clientPool ) {
    let user = clientPool[connection];
    user.socket.write(`<${clientPool[userId].nickname}>: has left chat.\n`);
  }
  clientPool[userId].socket.destroy();
  delete clientPool[userId];
});

eventEmitter.on('@list', (data, userId) => {
  let list = '';
  for (let connection in clientPool) {
    list += `${clientPool[connection].nickname}, `;
  }
  clientPool[userId].socket.write(list);
});

eventEmitter.on('@nickname', (data, userId) => {
  clientPool[userId].nickname = data.target;
});
  
eventEmitter.on('@dm', (data, userId) => {
  let message = `<${clientPool[userId].nickname}>: ${data.message}\n`;
  for (let connection in clientPool) {
    if (clientPool[connection].nickname == data.target) {
      clientPool[connection].socket.write(message);
    }
  }  
});



server.listen(port, () => {
  console.log(`Chatroom Server on ${port}`);
});