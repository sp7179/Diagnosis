const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const {
  setCurrentTime,
  checkMealTriggers,
  chain,
  getBySessionId,
  previousTime: initPreviousTime,
  persistTime,
  checkSpikeTriggers
} = require('./chatBot');
const { getCurrentTime, timeToMinutes } = require('./timeUtils');
const { filterDataByTime, formatSimulatedData } = require('./dataUtils');
const simulated_data = require('./simulatedData');

const app = express();

// serve client
app.use(express.static(path.join(__dirname, 'public')));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3011", // Your frontend URL/port
    methods: ["GET", "POST"]
  }
});

let previousTime = initPreviousTime;
const timeFile = path.join(__dirname, 'time.js');
console.log('⏰ Watching', timeFile);

// Watch time.js for live updates & push auto‑triggers to clients
fs.watch(timeFile, { persistent: true }, async (eventType, filename) => {
  // debug – make sure we actually got an event
  console.log(`⏰ fs.watch event: ${eventType} on ${filename}`);
  if (eventType !== 'change') return;

  // clear cache & reload
  delete require.cache[require.resolve('./time.js')];
  setCurrentTime();
  console.log('🕒 time.js changed — emitting meal triggers to all clients');

  const sockets = await io.fetchSockets();
  for (const sock of sockets) {
    const m = await checkMealTriggers(sock.id);
    if (m) {
      sock.emit('botMessage', m);
      getBySessionId(sock.id).addMessages([{ role:'assistant', content:m }]);
    }
    // now do spike analysis too
    const s = await checkSpikeTriggers(sock.id);
    if (s) {
      console.log(`→ emitting spike analysis to ${sock.id}: "${s}"`);
      sock.emit('botMessage', s);
      getBySessionId(sock.id).addMessages([{ role:'assistant', content:s }]);
    }
  }
});


io.on('connection', (socket) => {
  const sessionId = socket.id;
  console.log('Client connected:', sessionId);

  // On connect, fire any immediate meal trigger
  setCurrentTime();
  // checkMealTriggers(sessionId).then(prompt => {
  //   if (prompt) socket.emit('botMessage', prompt);
  // });

  // Handle incoming user messages
  socket.on('userMessage', async (msg) => {
    setCurrentTime();
    const mealPrompt = await checkMealTriggers(sessionId);
    const userInput = mealPrompt || msg;

    // slice simulated data window
    const now = getCurrentTime();
    console.log('⏰ current time:', now);
    console.log('⏰ previous time:', previousTime);
    const windowData = filterDataByTime(simulated_data, previousTime, now);

    // call your chain
    const res = await chain.call({
      user_report:    simulated_data. userReportTexttTextText,
      simulated_data: formatSimulatedData(windowData),
      input:          userInput,
      history:        getBySessionId(sessionId).messages
    });

    // update time state & history
    previousTime = now;
    persistTime(previousTime);
    getBySessionId(sessionId).addMessages([
      { role: 'user',      content: userInput },
      { role: 'assistant', content: res.text }
    ]);
    previousTime= now;

    // emit back to client
    socket.emit('botMessage', res.text);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', sessionId);
  });
});

httpServer.listen(3000, () =>
  console.log('🚀 Socket.IO server running on http://localhost:3000')
);