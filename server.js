const express = require('express');
const socket = reqiure('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

let tasks = [];

io.on('connection', (socket) => {

  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (idTask) => {
    const index = tasks.findIndex(task => task.id === idTask);
    if (index !== -1) {
      socket.broadcast.emit('removeTask', idTask);
      tasks.splice(index, 1);
    };
  });
});