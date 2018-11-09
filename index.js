const opt = process.argv[2] || '-m'

if (opt == '-m') {
  var cp = require('child_process');
  const ip = process.argv[3] || '127.0.0.1'
  const port = process.argv[4] || '8080'
  const time = parseInt(process.argv[5], 10) || '180'
  const d = process.argv[5] || 60
  const slavesfile = process.argv[6] || 'slaves.txt'
  const logFile = process.argv[7] || 'logs/clientlog.txt'
  var fs = require('fs');
  var contents = fs.readFileSync('slaves.txt', 'utf8');
  contents = contents.split('\n')
  for(let i in contents){
    let aux = contents[i].split(' ')
    cp.exec(`start cmd /k node client/client.js ${aux[0]} ${aux[1]} ${aux[2]}`);
  }
  cp.exec(`start cmd /k node server/server.js ${ip} ${port} ${time} ${d} ${slavesfile} ${logFile}`);
} else if (opt == '-s') {
  var cp = require('child_process');
  const ip = process.argv[3] || '127.0.0.1'
  const port = process.argv[4] || '8080'
  const time = parseInt(process.argv[5], 10) || '180'
  cp.exec(`start cmd /k node client/client.js ${ip} ${port} ${time}`);
}
