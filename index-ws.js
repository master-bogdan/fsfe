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

process.on('SIGINT', () => {
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
});

/** Websocket start **/
const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({
  server: server,
});

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log('clients connected: ', numClients);

  wss.broadcast(`Current visitors: ${numClients}`);

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))`);

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

/** Websocket end **/

/** Database start **/
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE visitors (
    count INTEGER,
    time TEXT
    )`);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log('shutting down DB');
  db.close();
}

