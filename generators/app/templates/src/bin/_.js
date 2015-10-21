#!/usr/bin/env node
var daemon = new <%= AppName %>Daemon(options);

// daemonize();

process.on('SIGINT', function() {
  console.log('Received SIGINT');
  daemon.stop();
  process.exit();
});

daemon.start();
