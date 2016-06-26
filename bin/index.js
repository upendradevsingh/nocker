#!/usr/bin/env node

'use strict';

const program = require('commander');
const exec = require('child_process').exec;
const path = require('path');
const appRoot = process.cwd(); // Current working directory
const dockerAppRoot = '/var/www/html/dev-app';
const format = require('../lib/format');
const gulpPath = path.resolve(__dirname, '../node_modules/gulp/bin/gulp.js');

program
	.version('0.0.2')
	.option('-v, --volume <volume>', 'application root directory to be mounted on docker i.e. /opt/apps/hello-world')
	.option('-p, --port <port>', "port to be opened i.e. 80:80 1337:1337")
	.option('-n, --name <name>', "container name")
	.option('-i, --image <image>', 'docker image')
	.action(function(){
		var port = program.port +':'+program.port;
		var vol = program.volume === undefined ? appRoot + ':' +dockerAppRoot : program.volume.indexOf(':') !== -1 ? program.volume : program.volume + ':' + dockerAppRoot;
		var cmd = 'docker run -d -p 80:80 -p 6379:6379 -p ' + port + ' -v ' + vol + ' --name ' + program.name + ' -i ' +  program.image + ' /bin/bash -c "redis-server --daemonize yes; /root/start_node start; /usr/bin/supervisord"';
		console.log("Running %s", cmd);
		exec(cmd, function(error, stdout, stderr){

			if(error){
				console.log(format.error(stderr));
			}
			console.log(format.info(stdout));
		});
	});

program
	.command('watch <container_id>')
	.usage('')
	.action(function(container_id){
		var cmd = gulpPath + ' --container ' + container_id;
		exec(cmd, function(error, stdout, stderr){
			if(error){
				console.log(format.error(stderr));
			}
			console.log('Watching files ...');
			console.log(stdout);
		});

	});

program.parse(process.argv);