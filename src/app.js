'use strict';

const EventEmitter = require('events');
const net = require('net');
const uuid = require('uuid/v4');

const port = process.env.PORT || 3001;
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