const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});


app.get((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

let tasks = [];

const io = socket(server);

io.on('connection', (socket) => {

  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (idTask, idSocket) => {
    const index = tasks.findIndex(task => task.id === idTask);
    const removeTask = {idTask: idTask, idSocket: socket.id};
    
    if (index !== -1) {
      tasks.splice(index, 1);
      socket.broadcast.emit('removeTask', removeTask);
    };
  });
});

