'use strict'

var Writable = require('stream').Writable,
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	fs = require('fs'),
	http = require('http'),
	os = require('os'),
	log = console.log.bind(console);

var FileReader = function () {
	Writable.call(this);
	this.lastLine = null;
	this.buffer = [];
	this.done = false;
	this.chunkDoneCallback = null;

	this.on("finish", () => {
		this.done = true;
		// Flush remaining content (possibly wrong)
		this.buffer.push(this.lastLine);
	});
}
util.inherits(FileReader, Writable);

FileReader.prototype._write = function (chunk, encoding, done) {
	var chunkStr = chunk.toString(),
		lines;
	if (this.lastLine !== null) {
		// Append the leftovers from last message
		chunkStr = this.lastLine + chunkStr;
		this.lastLine = null;
	}

	lines = chunkStr.split("\n");
	
	// Check if the line ends with \n; if not -> save the "sliced" line
	if (chunkStr.slice(-1) !== "\n") {
		this.lastLine = lines.pop();
	}

	Array.prototype.push.apply(this.buffer, lines);
	this.chunkDoneCallback = done;
}

FileReader.prototype.fetchLine = function () {
	setTimeout(() => {	
		// Use setTimeout since nextTick executes before all I/O operations which is what streams are usually used for
		var nextLine;
		if (this.buffer.length === 0) {
			if (this.done) {
                this.emit('next-line', null);
			} else {
                if (this.chunkDoneCallback) this.chunkDoneCallback();
				this.fetchLine();
			}
		}
		else {
			nextLine = this.buffer.shift();
			this.emit('next-line', nextLine);
		}
	}, 0);
}

// var file = fs.createReadStream(__dirname + "\\in.txt");
// var reader = new FileReader();
// file.pipe(reader);
// 
// var ended = false;
// reader.on("next-line", (line) => {
// 	if (line !== null) {
// 		log(line);
// 	} else {
// 		ended = true;
// 	}
// });
// 
// (function recurse() {
// 	reader.fetchLine();
// 	if (!ended)
// 		setTimeout(recurse, 0);
// } ());

var RoundRobin = function (fileReaders) {
	EventEmitter.call(this);
	this.streams = fileReaders;
	this.counter = 0;
	Array.prototype.forEach.call(this.streams, (currentReader, index) => {
		currentReader.on("next-line", (line) => {
			if (line === undefined) throw "Unexpected undefined line";
			this.currentLine[index] = (line === null ? "null" : line.replace('\r', '')); // Dirty Windows fix
			if (!this.generator) throw "RoundRobin was not started but is reading...";
			this.generator.next();
		});
	});
	this.currentLine = new Array(this.streams.length);
	this.generator = null;
}
util.inherits(RoundRobin, EventEmitter);

RoundRobin.prototype.start = function () {
	var genFunc = function* () {
		do {
			for (let i = 0; i < this.streams.length; i++) {
				yield this.streams[i].fetchLine();
			}
			this.emit("new-line", this.currentLine.join(" "));
		}
		while (Array.prototype.some.call(this.currentLine, (fileLine) => fileLine !== "null"))
		this.emit("finish");
	}
	this.generator = genFunc.call(this, this.generator);
	this.generator.next();
}

var streams =
	new Array(0, 0, 0)
		.map((_, ix) => { return __dirname + "\\file" + (ix + 1).toString() + ".txt" })
		.map((filename) => fs.createReadStream(filename))
		.map((stream) => {
			var res = new FileReader();
			stream.pipe(res);
			return res;
		});

var rr = new RoundRobin(streams);
rr.on("new-line", (line) => log(line));
rr.start();

http.createServer((req, res) => {
	if (req.url === '/favicon.ico') {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end("File not found");
		return;
	}
	var files = req.url.slice(1).split("/");
	var streams =
		files
			.map((file) => { return __dirname + "\\" + file + ".txt" })
			.map((filename) => fs.createReadStream(filename))
			.map((stream) => {
				var res = new FileReader();
				stream.pipe(res);
				return res;
			});
	var rr = new RoundRobin(streams);
	var lines = [];
	rr.on("new-line", (line) => lines.push(line));
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	rr.start();
	rr.on("finish", () => {
		res.end(lines.join(os.EOL));
	});
}).listen(10000);