'use strict'

var fs = require("fs"),
	http = require("http"),
	log = console.log.bind(console),
	readFile = promiseMe(fs.readFile),
	writeFile = promiseMe(fs.writeFile),
	urlGenerator = "http://www.classnamer.com/index.txt?generator=generic";

// From lecture
function httpGet(url) {
    return new Promise((resolve, reject) => {
		http.get(url, function (res) {
			var data = [];
			res.on("data", (chunk) => { data.push(chunk); });
			res.on("end", () => {
				resolve(data.join(""));
			});
		}).on('error', function (e) {
			reject(e);
		});
	});
}

// Helper to wrap FS in promises (not generic at all)
function promiseMe(func) {
	return function () {
		var args = Array.prototype.slice.call(arguments),
			that = this;
		return new Promise((resolve, reject) => {
			// func should expect a callback as last parameter
			args.push((err, data) => {
				if (err) reject(err);
				resolve(data);
			});
			func.apply(that, args);
		});
	}
}

function writeToFiles() {
	setTimeout(() => {
		fs.writeFile('file1_1.txt', "Stuff and stuff", (err) => {
			if (err) throw err;

			console.log("It's saved x1!");
			setTimeout(() => {
				fs.writeFile('file1_2.txt', " more stuff", (err) => {
					if (err) throw err;

					console.log("It's saved x2!");
					setTimeout(() => {
						var str = "";
						fs.readFile("file1_1.txt", (err, data) => {
							if (err) throw err;
							str += data;
							setTimeout(() => {
								fs.readFile("file1_2.txt", (err, data) => {
									if (err) throw err;
									str += data;
									setTimeout(() => {
										fs.writeFile("file1_3.txt", str, err => {
											if (err) throw err;
											console.log("It's saved x3!");
										})
									}, 1000);
								});
							}, 1000);
						});
					}, 1000);
				});
			}, 1000);
		});
	}, 1000);
}

function promiseToWriteToReallyWriteToFileTrustMe() {
	var wait,
		textFirst,
		textSecond;

	wait = (time) => {
		return new Promise((resolve, reject) => setTimeout(resolve, time));
	};

	return wait(1000)
		.then(() => writeFile("file2_1.txt", "Second stuff"))
		.then(() => wait(1000))
		.then(() => writeFile("file2_2.txt", " and even more stuff"))
		.then(() => wait(1000))
		.then(() => readFile("file2_1.txt"))
		.then((txt) => textFirst = txt)
		.then(() => wait(1000))
		.then(() => readFile("file2_2.txt"))
		.then((txt) => textSecond = txt)
		.then(() => wait(1000))
		.then(() => writeFile("file2_3.txt", textFirst + textSecond))
		.catch((reason) => log(reason));
}

function* generateAwesomeName() {
	while (true) {
		yield httpGet(urlGenerator);
	}
}

function sync(generator) {
	var gen,
		asyncExec;
	asyncExec = function (asyncFn) {
		asyncFn(gen);
	}
	gen = generator(asyncExec);
	gen.next();
}

function* docsGenerator(asyncExecutor) {
	var maxCount = 5,
		currentVal = "",
		it = generateAwesomeName(),
		currentIter = 1;

	while (currentIter <= maxCount) { // Iterator is endless in this case, no need to check for "done"
		asyncExecutor((self) => {
			setTimeout(() => {
				// Self resumes the execution of this iterator
				it.next().value.then((name) => {
					log("Got a name");
					currentVal += (currentIter == 1 ? name : " extends " + name);
					self.next();
				});
			});
		});
		yield;
		currentIter++;
	}
	return;
}

function* simulateDocs() {
	var maxCount = 5,
		currentVal = "",
		it = generateAwesomeName(),
		currentIter = 1,
		previous;
		
	// First iter
	previous = it.next().value.then((name) => {
		currentVal += name;
		return Promise.resolve(currentVal);
	});

	for (currentIter = 2; currentIter <= maxCount; currentIter++) {
		yield previous;
		previous = previous
			.then(() => {
				return it.next().value;
			})
			.then((name) => {
				currentVal += " extends " + name;
				return Promise.resolve(currentVal);
			});
	}
	// Yield the final iteration since we always yield the "previous" in the loop
	yield previous;
	return;
}

log("Task 1");
writeToFiles();
setTimeout(() => {
	log("Executed task 1, contents of files are:");
	readFile("file1_3.txt")
		.then((data) => log(data.toString()))
		.then(() => {
			log("Task 2");
			return promiseToWriteToReallyWriteToFileTrustMe()
				.then(() => {
					log("Task 2 executed");
					log("Contents of file are:")
					return readFile("file2_3.txt");
				})
				.then((txt) => {
					log(txt.toString());
				});
		})
		.then(() => {
			log("Task 3");
			var iterator = generateAwesomeName(),
				name1 = iterator.next().value,
				name2 = iterator.next().value,
				name3 = iterator.next().value,
				name4 = iterator.next().value,
				args = [name1, name2, name3, name4];

			return Promise.all(args);
		})
		.then((results) => {
			log("Generated names are:");
			results.forEach((val) => log(val));
		})
		.then(() => {
			log("Task 4");
			var it = simulateDocs(),
				promises = [];
			for (let val of it) {
				promises.push(val.then((generatedDoc) => log(generatedDoc)));
			}

			return Promise.all(promises);
		})
		.then(() => log("Finished"))
		.catch((reason) => log(reason));
}, 6000); // Nasty hack to simulate sync execution of all tasks after the non-promise version


