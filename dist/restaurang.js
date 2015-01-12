!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Restaurang=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Restaurang
 * @version v0.0.1 - 2015-01-12
 * @link https://github.com/andersrex/restaurang
 * @author Anders Rex <anders.rex@iki.fi>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

'use strict';


// Object methods

// Creates a Restaurang object for one REST element
function one(parent, route, id) {
    if (!id) { throw new Error('Expected argument id for function.'); }

    var url = parent._url + '/' + route + '/' + id;

    return createRestaurangObject(url);
}

// Creates a Restaurang object for a REST collection
function all(parent, route) {
    var url = parent._url + '/' + route;

    return createRestaurangObject(url, true);
}

function setUrl(current, url) {
    current._url = url;
    return current;
}

// TODO: Add function several(parent, route, ...) { ... }?


// Element methods

function elementGet(queryParams, headers) {
    var options = createOptions(this._url, queryParams, headers);

    return requestWithMethod('GET')(options);
}

function elementGetList(element, queryParams, headers) {
    var url = this._url + '/' + element;
    var options = createOptions(url, queryParams, headers);
    options.isCollection = true;

    return requestWithMethod('GET')(options);
}

function elementPut(queryParams, headers) {
    var options = createOptions(this._url, queryParams, headers);
    options.data = this;

    return requestWithMethod('PUT')(options);
}

function elementPost(element, data, queryParams, headers) {
    var url = this._url + '/' + element;
    var options = createOptions(url, queryParams, headers);
    options.data = data;

    return requestWithMethod('POST')(options);
}


function elementRemove(queryParams, headers) {
    var options = createOptions(this._url, queryParams, headers);

    return requestWithMethod('DELETE')(options);
}


// Collection methods

function collectionGet(id) {
    if(!id) {
        throw new Error('Expected argument id for function.');
    }
    return requestWithMethod('GET')({url: this._url + '/' + id});
}

function collectionGetList(queryParams, headers) {
    var options = createOptions(this._url, queryParams, headers);
    options.isCollection = true;

    return requestWithMethod('GET')(options);
}

function collectionPost(data, queryParams, headers) {
    var options = createOptions(this._url, queryParams, headers);
    options.data = data;

    return requestWithMethod('POST')(options);
}


// Attaching functions

function attachElementMethods(RestaurangObject) {
    RestaurangObject.get = elementGet;
    RestaurangObject.getList = elementGetList;
    RestaurangObject.put = elementPut;
    RestaurangObject.post = elementPost;
    RestaurangObject.remove = elementRemove;

    return RestaurangObject;
}

function attachCollectionMethods(RestaurangObject) {
    RestaurangObject.get = collectionGet;
    RestaurangObject.getList = collectionGetList;
    RestaurangObject.post = collectionPost;

    return RestaurangObject;
}

function attachObjectMethods(RestaurangObject, url, isCollection) {
    url = url || '';

    RestaurangObject._url = url;
    RestaurangObject._isCollection = isCollection;
    RestaurangObject.one = function(route, id) { return one(this, route, id); };
    RestaurangObject.all = function(route) { return all(this, route); };
    RestaurangObject.setUrl = function(url) { return setUrl(this, url); };

    return RestaurangObject;
}

function attachMethods(RestaurangObject, url, isCollection) {
    RestaurangObject = attachObjectMethods(RestaurangObject, url, isCollection);

    if (isCollection) {
        RestaurangObject = attachCollectionMethods(RestaurangObject);
    } else {
        RestaurangObject = attachElementMethods(RestaurangObject);
    }

    return RestaurangObject;
}

// Performs an AJAX request
function ajax(options) {
    var request = new XMLHttpRequest();

    options = options || {};
    options.url = options.url || '/';
    options.method = options.method || 'GET';
    options.headers = options.headers || {};

    request.open(options.method, options.url, true);

    // Set request headers
    for (var key in options.headers ) {
        request.setRequestHeader(key, options.headers[key]);
    }

    // TODO: ?
    request.setRequestHeader('Content-Type', 'application/json');

    // console.log(options.method + ': ' + options.url)

    request.send(JSON.stringify(options.data));

    // Return promise
    return new Promise(function(resolve, reject) {
        request.onreadystatechange = function () {

            if (request.readyState !== 4) { return; }

            if (request.status === 200) {
                // TODO: Add error handling
                var data = JSON.parse(request.responseText);

                resolve(data, request.statusText, request);
            } else {
                reject(request, request.status, request.statusText);
            }
        };
    });
}

// Performs an AJAX request and attached Restaurang methods
function request(options) {
    return new Promise(function(resolve, reject) {
        Restaurang.ajax(options).then(function(data) {

            if(options.isCollection && !Array.isArray(data)) {
                throw new Error('Expecting a collection as response.');
            }

            var restaurangObject = attachMethods(data, options.url, options.isCollection);

            resolve(restaurangObject);
        }, reject);
    });
}

// Closure for creating the ajax methods
function requestWithMethod(method) {
    return function(options) {
        options = options || {};
        options.method = method;
        return request(options);
    };
}

// Convert a object to a uri string
function objectToUri(obj) {
    return Object.keys(obj).map(function(key) {
        return key + '=' + obj[key];
    }).join('&');
}

// Generates options object with url and header
function createOptions(url, queryParams, headers) {
    return {
        url: url + (queryParams ? '?' +  objectToUri(queryParams) : ''),
        headers: headers
    };
}

// TODO: Add head, trace, options, jsonp...

// Creates a Restaurang object
function createRestaurangObject(url, isCollection) {
    var RestaurangObject = {};

    RestaurangObject = attachMethods(RestaurangObject, url, isCollection);

    return RestaurangObject;
}

var Restaurang = createRestaurangObject('');

Restaurang.ajax = ajax;

module.exports = Restaurang;
},{}]},{},[1])(1)
});