"use strict"

var fib = function (n) {
  var smaller = 0,
    larger = 1,
    swap,
    iter;
  if (n < 0) {
    return NaN;
  }
  if (n === 0) {
    return smaller;
  }
  if (n === 1) {
    return larger;
  }

  for (iter = 2; iter <= n; iter++) {
    swap = larger;
    larger += smaller;
    smaller = swap;
  }
	
  // Iter points at the larger value and since it stops at n, then larger is the nth number
  return larger;
}

console.log("Task 1");
var checks = [0, 1, 2, 3, 4, 5, 6, 7, 10, 20];
for (var i = 0; i < checks.length; i++) {
  console.log(checks[i].toString() + " " + fib(checks[i]));
}

var phiEstimation = function (n) {
  return fib(n) / fib(n - 1);
}

console.log("Task 2");
console.log(phiEstimation(100));


var reverseWordsOrderInString = function (sentence) {
  // Assuming only intervals as delimeters, might need a regex for more delimeters
  return sentence.split(' ').reverse().join(' ');
}

console.log("Task 3");
console.log(reverseWordsOrderInString('Foo bar a, but  baz'));

var reverseWordsInString = function (sentence) {
  // Assuming only intervals as delimeters, might need a regex for more delimeters
  return sentence
    .split(' ')
    .map(function (word) {
      // Reverse string from MDN documentation for split
      return word.split('').reverse().join('');
    })
    .join(' ');
}

console.log("Task 4");
console.log(reverseWordsInString('Foo bar baz'));

var findNthNumber = function (n, arr) {
  // Helper funcs
  function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  // partition assumes pivot at end of array
  function partition(arr, left, right) {
    var x = arr[right];
    var i = left;
    var j;
    for (j = left; j < right; j++) {
      if (arr[j] <= x) {
        swap(arr, i, j);
        i++;
      }
    }
    swap(arr, i, right);
    return i;
  }

  function kthSmallest(arr, left, right, k) {
    var positionPivot;
    if (k < 0 || k > right - left + 1) {
      // invalid array..probably with duplicates
      return undefined;
    }

    positionPivot = partition(arr, left, right);
    if (positionPivot - left === k - 1) {
      // Pivot is the kth element
      return arr[positionPivot];
    } else if (positionPivot - left > k - 1) {
      // More elements in left subarray, so the kth one is there
      return kthSmallest(arr, left, positionPivot - 1, k);
    } else {
      // More elements in right subarray, so the kth one is there
      // However, need to adjust for k since the left subarray is "ignored"
      return kthSmallest(arr, positionPivot + 1, right, k - (positionPivot - left + 1));
    }
  }
  
  // Function implementation
  if (n > arr.length) {
    return undefined; // undefined is what the task says in this case...
  }
  return kthSmallest(arr, 0, arr.length - 1, n);
}

console.log("Task 5");
var arr = [7, 10, 4, 3, 20, 15];
console.log(findNthNumber(3, arr));
console.log(findNthNumber(4, arr));
console.log(findNthNumber(6, arr));

var median = function (arr) {
  var result;
  if (arr.length % 2 === 0) {
    result = // Result is based on two middle elements
    (findNthNumber(Math.floor(arr.length / 2), arr)
      + findNthNumber(Math.floor(arr.length / 2) + 1, arr)) / 2;
  } else {
    result = findNthNumber(Math.ceil(arr.length / 2), arr);
  }
  return result;
}

console.log("Task 6");
var arr = [7, 10, 4, 3, 20, 15];
var arr1 = [7, 10, 4, 3, 20, 15, 55];
console.log(median(arr));
console.log(median(arr1));

var setBits = function (m, n, i, j) {
  var arrM, arrN;
  arrM = m.toString(2).split('');
  arrN = n.toString(2).split('');
  Array.prototype.splice.apply(arrM, [i, j - i + 1].concat(arrN.slice(0, j - i + 1)));
  return parseInt(arrM.join(''), 2);
}
console.log("Task 7");
var m = 130,
  n = 26,
  i = 2,
  j = 5;
console.log(setBits(m, n, i, j));