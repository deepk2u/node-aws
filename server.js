var cluster = require('cluster');
// Code to run if we're in the master process
// Listen for dying workers
cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

});
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

// Code to run if we're in a worker process
} else {
	var express = require('express');
	var fs = require('fs');
	var morgan = require('morgan');
	var AWS = require('aws-sdk');
	var compress = require('compression');
	AWS.config.loadFromPath('./config.json');
	var s3 = new AWS.S3()

	var app = express();
	app.use(compress()); 
	var bucketName = "vgroup-tournament";

	// create a write stream (in append mode)
	var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

	// setup the logger
	app.use(morgan('combined', {stream: accessLogStream}))

	app.get('/file/:id', function (req, res) {
	  // console.log(req);
		var key = req.params.id;
		var imgData = "";
		s3.getObject(
				{
	       			Bucket: bucketName, 
				Key:  key
				}, function(err, fileRes) {
			if(err){
				console.log(err);
				res.status(404).send('Not found');
				return;
			} else {
				//console.log(fileRes);
			}
		
			res.set('Content-Type', 'image/png');
			res.set('Content-Length', fileRes.ContentLength);
			res.send(new Buffer(fileRes.Body, 'binary'));
		});
	});

	var server = app.listen(7777, function () {
	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Example app listening at http://%s:%s', host, port);
	  console.log('Worker %d running!', cluster.worker.id);
	});
}
