#!/usr/bin/env node
var daemonize = require('daemon');

var daemon = new Daemon(options);

// daemonize();

process.on('SIGINT', function() {
  console.log('Received SIGINT');
  daemon.stop();
  process.exit();
});

daemon.start();
