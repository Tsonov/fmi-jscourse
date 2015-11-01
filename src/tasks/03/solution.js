'use strict'
var log = console.log.bind(console);

var myMap = function (fn) {
	var result = [],
		i;
	if (Array.isArray(this) == false) {
		return [];
	}
	for (i = 0; i < this.length; i++) {
		result.push(fn(this[i]));
	}
	return result;
}
Array.prototype.myMap = myMap;

log("Task 1 MyMap");
log([1, 2, 3, 4, 5, 6, 7, 8, 9].myMap(function (el) { return el + 10; }));

var Vehicle = function (mileageObj) {
	this.getMileage = function () { return mileageObj.val },
	this.toString = function () { return "This Vehicle Mileage is " + mileageObj.val.toString(); }
}

var Car = function (brand, consumption) {
	var mileage = { val: 0 },
		superToString;
	Vehicle.call(this, mileage);
	superToString = this.toString;

	this.drive = function (miles) {
		mileage.val += miles;
		return this;
	}
	this.getBrand = function () { return brand; }
	this.getConsumption = function () { return consumption; }
	this.toString = function () {
		return brand + " " + consumption + " " + superToString();
	}
}

log("Task 2 Car inheritance");
var c1 = new Car('honda', 5);
log(c1.getMileage());
log(c1.toString());
log(c1.drive(1000));
log(c1.getMileage());
log(c1.toString());

var Point = function (x, y) {
	this.x = x;
	this.y = y;
}
Point.prototype.toString = function () { return this.x + "," + this.y };
Point.prototype.toArray = function () {
	var self = this;
	return Object
		.keys(this)
		.map(function (coordinate) {
			return self[coordinate];
		});
}

var Point3D = function (x, y, z) {
	Point.call(this, x, y);
	this.z = z;
}
Point3D.prototype = Object.create(Point.prototype);
Point3D.prototype.toString = function () {
	return Point.prototype.toString.call(this) + "," + this.z;
}

log("Task 3 Points");
var p = new Point(-1, 1);
var p1 = new Point3D(7, 8, 9);
log(p.toString());
log(p1.toString());
log(p.toArray());
log(p1.toArray());

var FMIjs = (function () {
	var BinaryHeap, heapSort;
	BinaryHeap = function (list) {
		var self = this;
		if (Array.isArray(list)) {
			list.forEach(function (item) { self.insert(item); });
		}
		return self;
	};

	BinaryHeap.prototype = Object.create(Array.prototype);
	
	// Method definitions
	BinaryHeap.prototype.swapNodes = function (firstIx, secondIx) {
		var swapper = this[firstIx];
		this[firstIx] = this[secondIx];
		this[secondIx] = swapper;
	}

	BinaryHeap.prototype.parentIndex = function (ix) {
		return (ix === 0 ? undefined : Math.floor((ix - 1) / 2));
	};

	BinaryHeap.prototype.leftIndex = function (ix) {
		return (2 * ix) + 1;
	};

	BinaryHeap.prototype.rightIndex = function (ix) {
		return (2 * ix) + 2;
	};

	BinaryHeap.prototype.parentElement = function (ix) {
		return (ix === 0 ? undefined : this[this.parentIndex(ix)]);
	};

	BinaryHeap.prototype.leftElement = function (ix) {
		return this[this.leftIndex(ix)];
	};

	BinaryHeap.prototype.rightElement = function (ix) {
		return this[this.rightIndex(ix)];
	};

	BinaryHeap.prototype.getMinimum = function () {
		// Also does a pop according to the example in the lecture
		var result;
		this.swapNodes(0, this.length - 1);
		result = this.pop();
		this.bubbleDown(0); // Restore heap invariants
		return result;
	};

	BinaryHeap.prototype.isEmpty = function () {
		return this.length === 0;
	};

	BinaryHeap.prototype.bubbleUp = function (ix) {
		var currentIx = ix,
			parentIx;
		while (this.parentElement(currentIx) > this[currentIx]) {
			parentIx = this.parentIndex(currentIx);
			this.swapNodes(currentIx, parentIx);
			currentIx = parentIx;
		}
	};

	BinaryHeap.prototype.bubbleDown = function (ix) {
		var currentIx = ix,
			right,
			left,
			current,
			rightIx,
			leftIx;

		while (this.leftElement(currentIx)) {
			left = this.leftElement(currentIx);
			right = this.rightElement(currentIx);
			current = this[currentIx];
			if (current > left || current > right) {
				if (left > right) {
					rightIx = this.rightIndex(currentIx);
					this.swapNodes(rightIx, currentIx);
					currentIx = rightIx;
				} else {
					leftIx = this.leftIndex(currentIx);
					this.swapNodes(leftIx, currentIx);
					currentIx = leftIx;
				}
			} else {
				return;
			}
		}
	};

	BinaryHeap.prototype.insert = function (item) {
		this.push(item);
		this.bubbleUp(this.length - 1);
		return this.toString();
	};

	// Sort definition
	heapSort = function (list) {
		var binaryheap,
			result = [];
		if (Array.isArray(list) == false) {
			throw 'Only array sorting is supported';
		}
		binaryheap = new BinaryHeap(list);
		while (binaryheap.isEmpty() === false) {
			result.push(binaryheap.getMinimum());
		}

		return result;
	};

	return {
		BinaryHeap: BinaryHeap,
		heapSort: heapSort
	};
} ());

log("Task 4 Heaps");

var arr = [1, 2, 6, 9, 2, 4, 9, 87, 36, 21, 1];
var sorted = FMIjs.heapSort(arr); // -> [1,1,2,2,4,6,9,9,21,36,87]
log(sorted);

var b = new FMIjs.BinaryHeap();
log(b.insert(5));
log(b.insert(10));
log(b.insert(1));

log(b.getMinimum()); //-> 1
log(b.getMinimum()); //-> 5
log(b.getMinimum()); //-> 10