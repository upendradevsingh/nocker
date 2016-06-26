var gulp = require('gulp'),
    
gulp.task('default', function () {
	var watcher = gulp.watch('./**/*.js');
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	  exec('docker exec -it ' + id + 'forever restart app.js' , function(err, stdout, stderr){
		if(err){
			console.log(stderr);
		}
		console.log(stdout);
	   });
	});
});