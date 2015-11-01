/* global require, __dirname, console */

var MailObserver = require('./lib/observers/MailObserver'),
  LogObserver = require('./lib/observers/LogObserver'),
  logConfig = { path: __dirname + '/logs' },
  mailerConfig = { from: 'Foo Bar <foo@bar.baz>', to: 'dead007@abv.bg' },
  PostsCollection = require('./lib/observables/PostsCollection'),
  posts = new PostsCollection(),
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(),
  mailer = new MailObserver(mailerConfig),
  logger = new LogObserver(logConfig);

// Create and attach observers
posts.addObserver(mailer);
posts.addObserver(logger);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/post', function (req, res) {
  'use strict';
  posts.addPost(req.body.title, req.body.content);
  res.status(200);
  res.end();
  console.log("Processed post request");
});

app.listen(3000);

console.log('Listening on port 3000...');

