var express = require('express');
var app = express();
var fs = require('fs');
var url = require('url');
var admin = require('firebase-admin')

var serviceAccount = require("./github-api-5f6b3-firebase-adminsdk-uoc2f-f173c3b19b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://github-api-5f6b3.firebaseio.com"
});

var database = admin.database();

var ready = false;
var prev = ""

app.set('views', './');
app.set('view engine', 'pug');

var options = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: './',
  args: ['value1']
};

app.get('/', function (req, res) {

    fs.readFile('home.html', function(err, data){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    })
});

app.get('/result', function(req, res){
    var userLogin = req.query.search;

    console.log(userLogin);

    const { spawn } = require('child_process')
    const scriptPath = 'gitInfo.py'
    const process = spawn('python', [scriptPath, userLogin])
    process.stdout.on('data', function(data) {
      var comm = database.ref('/'+userLogin).once('value').then(function(snapshot) {
        var item = snapshot.val();
        var json = JSON.stringify(item);
        fs.writeFile('data.json', json, 'utf8', null);

        fs.readFile('page2.html', 'utf-8', function(err, data){
          res.writeHead(200, {'Content-Type': 'text/html'});
          var result = data.toString('utf-8').replace('{{data}}', json);
          res.write(result);
          res.write(data);
          return res.end();
        });
      });

    })
    process.stderr.on('data', (myErr) => {

    })

});


// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
