var gulp = require('gulp');
var exec = require('child_process').exec;
var id = process.argv[3];
var format = require('./lib/format');
  
gulp.task('default', function () {
	var watcher = gulp.watch('./**/*.js');
	
	watcher.on('change', function(event) {
	  console.log(format.data('File ' + event.path + ' was ' + event.type + ', running tasks...'));
	  console.log('Restarting application on container %s', id);

	  // Child process to restart the server
	  // id is container id
	  exec('docker exec -i ' + id + ' /root/start_node restart' , function(err, stdout, stderr){
			if(err){
				console.log(format.error(stderr));
			}
			console.log(format.info('Server restarted!'));
			console.log(stdout);
	   });

	});
});	

