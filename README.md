![cf](https://i.imgur.com/7v5ASc8.png) Lab 06: TCP Chat Server
======

This program is a simple chat server through telnet.

To open the chat server, run the index.js file using nodemon. Clients can connect to the chatroom by using telnet with your IP address and port `telnet <IP address> <PORT>`.

## Commands
* The client should send `@all <message>` to send a message to all users of the chat server.
* The client should send `@quit` to disconnect
* The client should send `@list` to list all connected users
* The client should send `@nickname <new-name>` to change their nickname
* The client should send `@dm <to-username> <message>` to send a message directly to another user by their nickname