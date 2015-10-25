'use strict'

var sumSquaresOfOddArgs = function () {
	return Array.prototype.reduce.call(arguments, function (previous, current, index, arr) {
		return (current % 2 == 1 ? (previous + current * current) : previous);
	}, 0);
}
console.log("Task 1");
console.log(sumSquaresOfOddArgs(1, 2, 3, 4, 5, 6));

var sum = function (a, b) {
	if (typeof b === "undefined") {
		return function (x) {
			return a + x;
		}
	} else {
		return a + b;
	}
}

var partialSum = sum(5);
console.log("Task 2");
console.log(partialSum);
console.log(partialSum(10));
console.log(sum(5)(2));

var curry = function (fn) {
	return function () {
		var curriedArgs = [].slice.call(arguments);
		if (curriedArgs.length < fn.length) {
			// Caller passed less arguments than needed, curry required
			return function () {
				var leftoverArgs = [].slice.call(arguments);
				return fn.apply(this, curriedArgs.concat(leftoverArgs));
			}
		} else {
			// Caller passed enough arguments in
			return fn.apply(this, curriedArgs);
		}
	}
}

var curried = curry(function (a, b, c, d) {
	return a + b + c;
});
console.log("Task 3");
console.log(curried(6, 6));
console.log(curried(6, 6)(6, 6));

var sequence = function () {
	var args = [].slice.call(arguments);
	return function (a) {
		var i;
		for (i = 0; i < args.length; i++) {
			a = args[i](a);
		}
		return a;
	}
}

var toNumber = sequence(parseFloat, Math.round);
console.log("Task 4");
console.log(toNumber('66.7'));

var cons = function (a, b) {
	return function (fn) {
		return fn(a, b);
	}
}

console.log("Task 5");
console.log(cons(3, 4));

var car = function (consFn) {
	return consFn(function (a, b) {
		return a;
	});
}

var pair = cons(7, 8);
console.log("Task 6");
console.log(car(pair));

var cdr = function (consFn) {
	return consFn(function (a, b) {
		return b;
	})
}

console.log("Task 7");
console.log(cdr(pair));
var list = cons(7, cons(8, 9));
var tail = cdr(list);
console.log(tail);
console.log(cdr(tail));

var forEach = function (clist, fn) {
	var tail = cdr(clist),
		head = car(clist);
	if (typeof head === 'undefined') {
		// Empty list
		return;
	}
	fn(head);
	if (typeof tail !== 'undefined') {
		if (typeof tail === 'function') {
			// Rest of the list is another list like (a, cons(...)) so recurse
			forEach(tail, fn);
		} else {
			// Just a single value so the list was a pair (a, b), no recursion needed
			fn(tail);
		}
	}
}

console.log("Task 8 ForEach");
var log = console.log.bind(console);
var list = cons(1, cons(2, cons(3, cons(4, cons(5, 6)))));
var list1 = cons(10);
var list2 = cons(100, 101);
var liste = cons();
forEach(list, log);
forEach(list1, log);
forEach(list2, log);
forEach(liste, log);

var map = function (clist, fn) {
	var tail = cdr(clist),
		head = car(clist);
	if (typeof head === 'undefined') {
		// Empty list, nothing to do
		return cons();
	}
	if (typeof tail === 'function') {
		// Rest of the list is another list, recurse
		return cons(fn(head), map(tail, fn));
	} else if (typeof tail !== 'undefined') {
		return cons(fn(head), fn(tail));
	} else {
		return cons(fn(head));
	}
}

console.log("Task 9 Map");
var square = function (el) { return el * el };
var mapped = map(list, square);
var mapped1 = map(list1, square);
var mapped2 = map(list2, square);
var mappede = map(liste, square);
forEach(mapped, log);
forEach(mapped1, log);
forEach(mapped2, log);
forEach(mappede, log);

var filter = function (clist, fn) {
	var tail, head, includeHead, args;
	if (typeof clist === 'undefined') {
		return undefined;
	}
	tail = cdr(clist);
	head = car(clist);
	if (typeof head === 'undefined') {
		return cons();
	}
	includeHead = fn(head);
	if (typeof tail === 'undefined') {
		return (includeHead ? cons(head) : cons());
	} else if (typeof tail === 'function') {
		return (includeHead ? cons(head, filter(tail, fn)) : filter(tail, fn));
	} else {
		args = [head, tail].filter(fn);
		return cons.apply(null, args);
	}
}

console.log("Task 10 Filter");
var predicate = function (el) { return el % 2 === 0; };
var filtered = filter(list, predicate);
var filtered1 = filter(list1, predicate);
var filtered2 = filter(list2, predicate);
var filterede = filter(liste, predicate);
forEach(filtered, log);
forEach(filtered1, log);
forEach(filtered2, log);
forEach(filterede, log);

var reduce = function (clist, fn, init) {
	var tail, head;
	if (typeof clist === 'undefined') {
		return init;
	}
	tail = cdr(clist);
	head = car(clist);
	if (typeof head === 'undefined') {
		return init;
	}
	if (typeof tail === 'undefined') {
		return fn(init, head);
	} else if (typeof tail === 'function') {
		return reduce(tail, fn, fn(init, head));
	} else {
		return fn(fn(init, head), tail);
	}
}

console.log("Task 11 Reduce");
var accumulator = function (acc, cur) { return acc + cur };
var reduced = reduce(list, accumulator, 0);
var reduced1 = reduce(list1, accumulator, 0);
var reduced2 = reduce(list2, accumulator, 0);
var reducede = reduce(liste, accumulator, 1);
log(reduced)
log(reduced1);
log(reduced2);
log(reducede);

var productAcc = function (acc, cur) { return acc * cur };
reduced = reduce(list, productAcc, 1);
reduced1 = reduce(list1, productAcc, 1);
reduced2 = reduce(list2, productAcc, 1);
reducede = reduce(liste, productAcc, 1);
log(reduced)
log(reduced1);
log(reduced2);
log(reducede);