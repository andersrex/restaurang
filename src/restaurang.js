/**
 * Restaurang
 * @version v0.1.0 - 2015-02-21
 * @link https://github.com/andersrex/restaurang
 * @author Anders Rex <anders.rex@iki.fi>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

'use strict';

// Object methods

// Creates a Restaurang object for one REST element
function one(parent, route, id) {
    if (!route) { throw new Error('Expected argument route for function.'); }
    if (!id) { throw new Error('Expected argument id for function.'); }

    var url = parent._url + '/' + route + '/' + id;

    return createRestaurangObject(url);
}

// Creates a Restaurang object for a REST collection
function all(parent, route) {
    if (!route) { throw new Error('Expected argument route for function.'); }

    var url = parent._url + '/' + route;

    return createRestaurangObject(url, true);
}

function setUrl(current, url) {
    current._url = url;

    return current;
}

function setDefaultHeaders(current, headers) {
    current._headers = headers;

    return current;
}

// TODO: Add function several(parent, route, ...) { ... }?

// Element methods

function elementGet(queryParams, headers) {
    var url = constructUrl(this._url, queryParams),
        options = constructOptions(headers, this._headers);

    options.method = 'GET';

    return request(url, options);
}

function elementGetList(element, queryParams, headers) {
    var url = constructUrl(this._url + '/' + element, queryParams),
        options = constructOptions(headers, this._headers);

    options.method = 'GET';

    return request(url, options, true);
}

function elementPut(queryParams, headers) {
    if(!this._fromServer) { throw new Error('Element must be from server.'); }

    var url = constructUrl(this._url, queryParams),
        options = constructOptions(headers, this._headers);

    options.body = JSON.stringify(withoutUnderscoreValues(this));
    options.method = 'PUT';

    return request(url, options);
}

function elementPost(element, data, queryParams, headers) {
    var url = constructUrl(this._url + '/' + element, queryParams),
        options = constructOptions(headers, this._headers);

    options.body = JSON.stringify(withoutUnderscoreValues(data));
    options.method = 'POST';

    return request(url, options);
}

function elementRemove(queryParams, headers) {
    var url = constructUrl(this._url, queryParams),
        options = constructOptions(headers, this._headers);

    options.method = 'DELETE';

    return request(url, options);
}


// Collection methods

function collectionGet(id, queryParams, headers) {
    if(!id) { throw new Error('Expected argument id for function.'); }
    var url = constructUrl(this._url + '/' + id, queryParams),
        options = constructOptions(headers, this._headers);

    options.method = 'GET';

    return request(url, options);
}

function collectionGetList(queryParams, headers) {
    var url = constructUrl(this._url, queryParams),
        options = constructOptions(headers, this._headers);

    options.method = 'GET';

    return request(url, options, true);
}

function collectionPost(data, queryParams, headers) {
    var url = constructUrl(this._url, queryParams),
        options = constructOptions(headers, this._headers);

    options.body = JSON.stringify(withoutUnderscoreValues(data));
    options.method = 'POST';

    return request(url, options);
}


// Attaching functions

function attachElementMethods(obj) {
    obj.get = elementGet;
    obj.getList = elementGetList;
    obj.put = elementPut;
    obj.post = elementPost;
    obj.remove = elementRemove;

    return obj;
}

function attachCollectionMethods(obj) {
    obj.get = collectionGet;
    obj.getList = collectionGetList;
    obj.post = collectionPost;

    return obj;
}

function attachObjectMethods(obj, url, isCollection) {
    url = url || '';

    obj._url = url;
    obj._isCollection = isCollection;
    obj.one = function(route, id) { return one(this, route, id); };
    obj.all = function(route) { return all(this, route); };
    obj.setUrl = function(url) { return setUrl(this, url); };
    obj.setDefaultHeaders = function(headers) { return setDefaultHeaders(this, headers); };

    return obj;
}

function attachMethods(obj, url, isCollection, fromServer) {
    obj = attachObjectMethods(obj, url, isCollection);

    if (isCollection) {
        obj = attachCollectionMethods(obj);
    } else {
        obj = attachElementMethods(obj);
    }

    if (fromServer) {
        obj._fromServer = true;
    }

    return obj;
}

// Rejects fetch unless status code is 2xx.
function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// Get json object from response
function json(response) {
    return response.json();
}

// Removes underscore values form an object
function withoutUnderscoreValues(a) {
    var b = extend({}, a);

    delete b._url;
    delete b._fromServer;
    delete b._isCollection;
    delete b._headers;

    return b;
}

// Performs an AJAX request and attached Restaurang methods
function request(url, options, isCollection) {
    return new Promise(function(resolve, reject) {
//        console.log("fetch", options);
        Restaurang.fetch(url, options).then(status).then(json).then(function(data) {

            if(isCollection && !Array.isArray(data)) {
                throw new Error('Expecting a collection as response.');
            }

            var restaurangObject = attachMethods(data, url, isCollection, true);

            resolve(restaurangObject);
        }).catch(reject);
    });
}

// Extend an object with another
function extend(a, b) {
    if(b) {
        Object.keys(b).map(function(key) {
            a[key] = b[key];
        });
    }
    return a;
}

// Convert a object to a uri string
function objectToUri(obj) {
    return Object.keys(obj).map(function(key) {
        return key + '=' + obj[key];
    }).join('&');
}

// Generates url based on url and query params
function constructUrl(url, queryParams) {
    return url + (queryParams ? '?' +  objectToUri(queryParams) : '')
}

// Generates options object
function constructOptions(newHeaders, defaultHeaders) {
    var headers = {};

    extend(headers, newHeaders);
    extend(headers, defaultHeaders);

    return {
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

Restaurang.fetch = fetch;

module.exports = Restaurang;