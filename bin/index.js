#!/usr/bin/env node
'use strict';
const program = require('commander');
const exec = require('child_process').exec;

program
	.version('0.0.1')
	.option('-v, --volume <volume>', 'application root directory to be mounted on docker i.e. /opt/apps/hello-world')
	.option('-p, --port <port>', "port to be opened i.e. 80:80 1337:1337")
	.option('-n, --name <name>', "container name")
	.option('-i, --image <image>', 'docker image')
	.action(function(){
		var port = program.port +':'+program.port;
		var vol = program.volume.indexOf(':') !== -1 ? program.volume : program.volume + ':/var/www/html/dev-app';
		var cmd = 'docker run -d -p 80:80 -p 6379:6379 -p ' + port + ' -v ' + vol + ' --name ' + program.name + ' -i ' +  program.image + ' /bin/bash -c "redis-server --daemonize yes; /root/start_node start; /usr/bin/supervisord"';
		console.log("Running %s", cmd);
		exec(cmd, function(error, stdout, stderr){
			if(error){
				console.log(stderr);
			}
			console.log(stdout);
		});
	});

program.parse(process.argv);



