// require all dependencies
var express = require('express');
var app = express();
var PythonShell = require('python-shell');
var fs = require('fs');
var url = require('url');

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

    // render the 'index' template, and pass in a few variables
    //res.render('index', { title: 'Hey', message: 'Hello' });
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
      //console.log(txt);
      /*
      fs.writeFile('file.txt', txt, function(err, data){
        if(err) console.log(err);
        console.log(txt);
      })*/

      const scriptPath = 'gitInfo.py'
      const process = spawn('python', [scriptPath, txt])
      process.stdout.on('data', (myData) => {
          // Do whatever you want with the returned data.
          // ...
          res.send("Done!")
      })
      process.stderr.on('data', (myErr) => {
          // If anything gets written to stderr, it'll be in the myErr variable
      })
    }


});

/*
app.get('/foo', function(req, res) {
    // Call your python script here.
    // I prefer using spawn from the child process module instead of the Python shell
    const scriptPath = 'gitInfo.py'
    const process = spawn('python', [scriptPath])
    process.stdout.on('data', (myData) => {
        // Do whatever you want with the returned data.
        // ...
        res.send("Done!")
    })
    process.stderr.on('data', (myErr) => {
        // If anything gets written to stderr, it'll be in the myErr variable
    })
})
*/
// start up the server
app.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});
