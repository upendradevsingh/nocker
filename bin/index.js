#!/usr/bin/env node

'use strict';

const program = require('commander');
const exec = require('child_process').exec;
const path = require('path');
const appRoot = process.cwd(); // Current working directory
const dockerAppRoot = '/var/www/html/dev-app';
const format = require('../lib/format');
const chokidar = require('chokidar');

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

// Watch file changes in the host 
// And restart server in the docker container
// container_id is docker container id

program
	.command('watch <container_id>')
	.usage('')
	.action(function(container_id){
		var defaults = ['./', '!public', '!dist','!node_modules', '!.tmp'];

		console.log(format.info("Watching file changes in following paths " + defaults.join(',')));
		
		// One-liner for current directory, ignores .dotfiles 
		chokidar.watch(defaults, {
			ignored: '/node_modules',
			persistent: true,
			cwd: appRoot,
			ignoreInitial: true,
		})
		.on('all', function(event, path){
		  console.log(path + ' ' + event);
	  	  console.log('Restarting application on container %s', container_id);

	  // Child process to restart the server
	  // id is container id
	  exec('docker exec -i ' + container_id + ' /root/start_node restart' , function(err, stdout, stderr){
			if(err){
				console.log(format.error(stderr));
			}
			console.log(format.info('Server restarted!'));
			console.log(stdout);
	   		});
		});
	});

program.parse(process.argv);