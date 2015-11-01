/* global require, module */

var Observable = require('./Observable');

function PostsCollection() {
  'use strict';
  Observable.call(this);
  this.posts = [];
}
PostsCollection.prototype = Object.create(Observable.prototype);

PostsCollection.prototype.addPost = function (title, content) {
  'use strict';
  this.posts.push({ title: title, content: content });
  this.update(title, content);
};

module.exports = PostsCollection;

