"use strict";

const express = require("express");
const path = require("path");
const { createServer } = require("http");

const WebSocket = require("ws");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    console.log(`Received message: ${message}`);
    // Parse incoming message as JSON
    const post = JSON.parse(message);

    // Broadcast new post to all connected clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(post));
      }
    });
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});



server.listen(8080, function () {
  console.log("Listening on http://0.0.0.0:8080");
});
