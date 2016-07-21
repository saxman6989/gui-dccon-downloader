const {dialog} = require('electron').remote;
let fs = require('fs');
let archiver = require('archiver');
let Horseman = require('node-horseman');
let cheerio = require('cheerio');
let request = require('request');

var get_imgs = function(input){
	
	var req_uri = "http://dccon.dcinside.com/#" + String(input);
	var horseman = new Horseman();

	var notify = function(body, title) {
	  	var options = {
		    body: body,
		    //icon: icon
		}

		return new Notification(title, options);
	}

	document.getElementById('status').innerHTML = "Downloading may take a while...";

	mkdir(input, 0666);

	horseman
		.userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
		.open(req_uri)
		.html('ul.Img_box')
		.then(function (body) {
			try{
				$ = cheerio.load(body);

				var count = 0;
				var length = $('li').length;

				$('li').each(function(i, e){
					var src = $(this).find('img').attr('src');
					var title = $(this).find('img').attr('alt');

					download('http:' + src, input + '/' + title + '.png', req_uri);
					count++;
				});

				if(count === length){
					document.getElementById('status').innerHTML = "Downloaded #" + input + ".";
					notify("Downloaded #" + input + ".", "Done");
					alert("Downloaded #" + input + ".");
				}

			} catch(err) {
				throw err;
				notify(error, 'Error!');
				alert(err);
			}
		})
		.close();


}

var download = function(url, dest, req_uri) {
	var options = {
		url: url,
		headers: {
			"Referer": req_uri
		}
	};

	var file = fs.createWriteStream(dest);

	file.on('open', function(){
		request.get(options, function(err, res, body) {
			console.log(url);
		}).pipe(file);
	});

	file.on('finish', function() {
		file.close();
	});

	file.on('error', function(err) {
		fs.unlink(dest);
		throw err;
	});
};


//Not supported


var mkdir = function(dir, permission){
	fs.exists(dir, function(exists){
		if(exists) return 0;
		else{
			fs.mkdir(dir, permission, function(err){
				if(err) throw err;
			});
		}
	});
}

var rmdir = function(dir){
	fs.exists(dir, function(exists){
		if(exists){
			var rmdir = require('rimraf');
			rmdir(dir, function(err){
				if(err) throw err;
			});
		}
	})
	
}

var compress = function(){
	var o = fs.createWriteStream('compressed.zip');
	var archive = archiver('zip');

	o.on('close', function(){
		alert('Compression is done.');
	});

	archive.on('error', function(){
		alert('Error!');
		throw err;
	});

	archive.pipe(o);
	archive.bulk([{ expand: true, cwd: 'tmp', src: ['**'] }]);
	archive.finalize();
}