var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

let port = 8080

let serverTime = 185

let clients = {}

server.listen(port, () => {
  console.log('Server is listening on port: ' + port)
});

setInterval(function () {
  setDifferences()
  let medium = mediumTime()
  setCorrections(medium)
  sendCorrections()
  serverTime += medium
  io.emit('getTime')
  console.log(medium)
}, 10000);

function sendCorrections() {
  Object.keys(clients).map((key) => {
    const client = clients[key]
    if (client !== -1) {
      console.log('Sending correction to client')
      io.to(client.id).emit('setNewTime', client.correction)
    }
  })
}

function setCorrections(medium) {
  Object.keys(clients).map((key) => {
    const client = clients[key]
    if (client !== -1) {
      clients[key].correction = medium - clients[key].dif
    }
  })
}

function setDifferences() {
  Object.keys(clients).map((key) => {
    const client = clients[key]
    if (client !== -1) {
      clients[key].dif = client.time - serverTime
    }
  })
}

function mediumTime() {
  const sum = Object.keys(clients).reduce((prev, key) => {
    return clients[key] === -1 ? prev : prev + clients[key].dif
  }, 0)
  let count = Object.keys(clients).filter((key) => {
    return clients[key] !== -1
  }).length
  count += 1
  return sum / count
}

app.get('/', function (req, res) {
  let times = ''
  for (let i in clients)
    if (clients[i] !== -1)
      times += clients[i].id + ': ' + clients[i].time + ' <br>'
  times += 'Server time: ' + serverTime
  res.send(times)
})

io.on('connection', function (socket) {
  console.log('Client' + socket.id + ' connected')
  socket.emit('getTime')

  socket.on('clientTime', function (data) {
    if (!clients[socket.id]) {
      clients[socket.id] = {
        id: socket.id,
        time: data,
        dif: 0,
        correction: 0,
      }
      console.log('Client does not exist in colection yet got: ', data)
    } else {
      clients[socket.id].time = data
    }
  })
  socket.on('disconnect', function () {
    clients[socket.id] = -1
    console.log('Client' + socket.id + ' disconnected')
  })
})