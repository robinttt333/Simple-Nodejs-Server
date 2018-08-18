var http=require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');


mimeTypes={
	"html":"text/html"
}


http.createServer(function(req,res)
{
	var uri=url.parse(req.url).pathname;
	var file_name=path.join(process.cwd(),unescape(uri));
	console.log('Loading '+uri );
	var stats;

	try{

		stats=fs.lstatSync(file_name);
	}
	catch(e){
		res.writeHead(404,{'Content-Type':'text/plain'});	
		res.write('404 not found');
		res.end();
		return;
	}


	if(stats.isFile())
	{
		var mimeType=mimeTypes[path.extname(file_name).split(".").reverse()[0]];
		res.writeHead(200,{'Content-type':mimeType});
		var file_stream=fs.createReadStream(file_name);
		file_stream.pipe(res);
		return;
	}
	else if(stats.isDirectory())
	{
		res.writeHead(302,{'Location':'index.html'});
		res.end();
	}	
	else{
		res.writeHead(500,{'Content-Type':'text/plain'});
		res.write('500 internal error');
		res.end();
	}
}).listen(8000);
