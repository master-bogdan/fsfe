const express = require('express');
const server = require('http').createServer(express);
const app = express();

app.get('/', (req, res) => {
  res.sendFile('/index.html', {
    root: __dirname,
  });
});

server.on('request', app);
server.listen(3000, () => {
  console.log('Express server started at port 3000');
});

/** Websocket **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({
  server,
});

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log('clients connected: ', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) { 
    ws.send('Welcome to my server!');
  }

  ws.on('close', () => {
    wss.broadcast(`Current visitors: ${numClients}`);
    console.log('A client has disconnected');
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

