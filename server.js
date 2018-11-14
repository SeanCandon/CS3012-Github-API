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

// set up the template engine
app.set('views', './');
app.set('view engine', 'pug');

var options = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: './gitInfo.py',
  //args: ['value1', 'value2', 'value3']
};

const { spawn } = require('child_process')

// GET response for '/'
app.get('/', function (req, res) {

    if(req.url == "/"){
      fs.readFile('home.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      })
    }
    else{
      var q = url.parse(req.url, true).query;
      var txt = q.search;

      const scriptPath = 'gitInfo.py'
      const process = spawn('python', [scriptPath, txt])
      process.stdout.on('data', (myData) => {
        res.send('wow');
      })
      process.stderr.on('data', (myErr) => {
          // If anything gets written to stderr, it'll be in the myErr variable
      })
    }
});

// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8081');
});
