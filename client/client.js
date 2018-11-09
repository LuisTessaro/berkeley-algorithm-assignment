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
  let timeB4 = time
  console.log('Fixing time with: ' + correction)
  time += correction
  var fs = require('fs');
  let text =
    'Client ' + id + ' before sync time: ' + timeB4 + '\n' +
    'Client ' + id + ' after sync time: ' + time + '\n'

  fs.appendFile('logs/clientlog.txt', text, function (err) {
    if (err) throw err;
    console.log('Updated!');
  });
}