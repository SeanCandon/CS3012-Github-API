var express = require('express');
var app = express();
var fs = require('fs');
var url = require('url');
var admin = require('firebase-admin')
var ps = require('python-shell')

var serviceAccount = require("./github-api-5f6b3-firebase-adminsdk-uoc2f-f173c3b19b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://github-api-5f6b3.firebaseio.com"
});

var database = admin.database();

var ready = false;
var prev = ""

// set up the template engine
app.set('views', './');
app.set('view engine', 'pug');

var options = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: './',
  args: ['value1']
};

//const { spawn } = require('child_process')

// GET response for '/'
app.get('/', function (req, res) {

    //if(req.url == "/"){
      fs.readFile('home.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      })
    //}
    /*
    else{

      var q = url.parse(req.url, true).query;
      var txt = q.search;
      console.log("txt = " + txt);
      //res.send("ok");

      fs.readFile('page2.html', 'utf-8', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();

      //const scriptPath = 'gitInfo.py'
      c//onst process = spawn('python', [scriptPath, txt])
      //process.stdout.on('data', (myData) => {
        //res.send('wow');
        //res.send("ok");
        //res.end();
        //ready = true;
      })
      //process.stderr.on('data', (myErr) => {
          // If anything gets written to stderr, it'll be in the myErr variable
      //})

    }*/
});

app.get('/result', function(req, res){
    var userLogin = req.query.search;
    var userLogin2 = userLogin;
    if(shouldUpdate(userLogin)){
      userLogin2 = ''
      userLogin2 = delChars(userLogin);
    }
    console.log(userLogin2);
    //var jsonFile = require('./data.json')

    const { spawn } = require('child_process')
    const scriptPath = 'gitInfo.py'
    const process = spawn('python', [scriptPath, userLogin2, shouldUpdate(userLogin)])
    process.stdout.on('data', function(data) {
      var comm = database.ref('/'+userLogin).once('value').then(function(snapshot) {
        var item = snapshot.val();
        var json = JSON.stringify(item);
        //fs.writeFile('data.json', json, 'utf8', null);

        fs.readFile('page2.html', 'utf-8', function(err, data){
          res.writeHead(200, {'Content-Type': 'text/html'});
          var result = data.toString('utf-8').replace('{{data}}', json);
          res.write(result);
          res.write(data);
          return res.end();
        });
      });
      //res.send("ok");
      //return res.end();
    })
    process.stderr.on('data', (myErr) => {
         //If anything gets written to stderr, it'll be in the myErr variable
        //console.log(myErr);
    })
    //res.end("ok");

});

function shouldUpdate(str){
  var l = str.length;
  //var upd = true;
  for(var i=l-3; i<l; i++){
    if(i==l-3){
      if(str.charAt(i) != ' ')
        return false;
    }
    if(i==l-2){
      if(str.charAt(i) != '-')
        return false;
    }
    if(i==l-1){
      if(str.charAt(i) != 'u')
        return false;
    }
  }
  return true;
}

function delChars(str){
  var l = str.length;
  var newstr = '';
  for(var i=0; i<l-3; i++){
    newstr += str.charAt(i);
  }
  return newstr;
}

// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
