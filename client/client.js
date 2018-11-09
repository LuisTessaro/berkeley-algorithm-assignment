var socket = require('socket.io-client')('http://127.0.0.1:8080')
const fs = require('fs');


let time = parseInt(process.argv[2], 10)
socket.on('getTime', function () {
  console.log('Sending time: ' + time)
  socket.emit('clientTime', time)
})

socket.on('setNewTime', function (data) {
  fixTime(data.correction, data.id)
})

function fixTime(correction, id) {
  console.log('Fixing time with: ' + correction)
  time += correction
  var stream = fs.createWriteStream("logs/clientlog.txt");
  stream.once('open', function (fd) {
    stream.write('Client '+ id + ' time: ' + time + '\n');
    stream.end();
  })
}