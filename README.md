# Restaurang.js

Restaurang.js makes it easy to consume RESTful APIs in Javascript.

This was created because I wanted something similar to the excellent [Restangular](https://github.com/mgonto/restangular) outside AngularJS.

Only supports JSON objects for now.

## Disclaimer

This is still very much work in progress. Come back in a few days for something more usable.

## Install

`<script src="restaurang.js"></script>`

...and you're good to go.

Restaurang.js has no external dependencies but uses ECMAScript 6 promises and some ECMAScript 5 features. This means IE users will need the [es6-promise](https://github.com/jakearchibald/es6-promise) polyfill and <IE9 users will need [es5-shim](https://github.com/es-shims/es5-shim).

## Usage

````javascript

// Let's start by setting the base url
Restaurang.setUrl("/api/v1");

// Fetch one post
Restaurang.one("posts", "1").get().then(function(post) { // GET /api/v1/posts/1
  post.name = "Lorem ipsum...";

  post.save(); // PUT /api/v1/articles/1

  // Let's fetch the comments for this post
  post.all("comments").getList().then(function(comments) { // GET /api/v1/posts/1/comments, expects an array

    console.log(comments[0].id); // 1

    comments[0].body = "Great story!";

    comments[0].save(); // PUT /api/v1/posts/1/comments/1
  });
});

// Fetch a comment without first fetching the post
Restaurang.one("posts", "1").one("comments", "1").get(); // GET /api/v1/posts/1/comments/1

// Create a new post
Restaurang.all("posts").post({ // POST /api/v1/posts
  name: "Foo",
  body: "Bar"
}).then(function(post) {
  console.log(post.body); // Bar
});
````

## Methods

Each Restaurang object have the following object methods (including `Restaurang` itself). Restaurang elements and collections also have some specific methods.

### Object methods

* one(route, id)
* all(route)
* setUrl(url)

### Element methods

* get([queryParams, headers])
* getList(element, [queryParams, headers])
* put([queryParams, headers])
* post(element, data, [queryParams, headers])
* remove([queryParams, headers])

### Collection methods

* get(id)
* getList([queryParams, headers])
* post(data, [queryParams, headers])

### Restaurang.ajax

If you need a custom AJAX function for checking/renewing tokens or just want to be fancy, you can replace `Restaurang.ajax` with a `jQuery.ajax` compatible method.

## TODO

* Remove underscore variables before requests
* Support for default options (headers etc.)
* Add support for extending elements, nested elements and collections with methods
* Add to npm and bower
* Tests
* HEAD, TRACE, jsonp
* ...
* Profit!

## License

The MIT License (MIT)

Copyright (c) 2015 Anders Rex

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.