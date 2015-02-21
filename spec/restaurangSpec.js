fetch = function() {};

Restaurang = require('../src/restaurang.js');

describe('Restaurang', function() {
    it('should be defined', function() {
        expect(Restaurang).toBeDefined();
    });

    describe('Object methods', function() {
        it('should have one method', function() {
            expect(typeof Restaurang.one).toBe('function');
        });

        it('should have all method', function() {
            expect(typeof Restaurang.all).toBe('function');
        });

        it('should have setUrl method', function() {
            expect(typeof Restaurang.setUrl).toBe('function');
        });

        it('should have setDefaultHeaders method', function() {
            expect(typeof Restaurang.setDefaultHeaders).toBe('function');
        });

        it('should create a new object with one', function() {
            var one = Restaurang.one('posts', 1);

            expect(one._url).toBe('/posts/1');
            expect(one._isCollection).toBeFalsy();
        });

        it('should create a new object with all', function() {
            var all = Restaurang.all('posts');

            expect(all._url).toBe('/posts');
            expect(all._isCollection).toBeTruthy();
        });

        it('should set url with setUrl', function() {
            var  url = 'http://google.com';

            Restaurang.setUrl(url);

            expect(Restaurang._url).toBe(url);

            Restaurang.setUrl('');
        });

        it('should set default headers with setDefaultHeaders', function() {
            var headers = {
                'key': 'value'
            };
            Restaurang.setDefaultHeaders(headers);

            expect(Restaurang._headers).toBe(headers);
        });
    });

    describe('Element methods', function() {
        beforeEach(function() {
            spyOn(Restaurang, 'fetch').and.callThrough();
        });

        it('shoud get an element', function() {
            var one = Restaurang.one('posts', 1);

            one.get();

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1', {headers: {}, method: 'GET'});
        });

        it('should get an element with queryParams and headers', function() {
            var one = Restaurang.one('posts', 1);

            var queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            one.get(queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1?testParam=foo', {headers: headers, method: 'GET'});
        })

        it('should get a list', function() {
            var one = Restaurang.one('posts', 1);

            one.getList('comments');

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1/comments', {headers: {}, method: 'GET'});
        });

        it('should get a list with queryParams and headers', function() {
            var one = Restaurang.one('posts', 1);

            var queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            one.getList('comments', queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1/comments?testParam=foo', {headers: headers, method: 'GET'});
        });

        it('should put an element', function() {
            var one = Restaurang.one('posts', 1);

            one._fromServer = true;
            one.id = 1;

            one.put();

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1', {headers: {}, method: 'PUT', body: '{"id":1}'});
        });

        it('should put an element with queryParams and headers', function() {
            var one = Restaurang.one('posts', 1),
                queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            one._fromServer = true;
            one.id = 1;

            one.put(queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1?testParam=foo', {headers: headers, method: 'PUT', body: '{"id":1}'});
        });

        it('should post an element', function() {
            var one = Restaurang.one('posts', 1);

            one.post('comments', {id: 1});

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1/comments', {headers: {}, method: 'POST', body: '{"id":1}'});
        });

        it('should post an element with queryParams and headers', function() {
            var one = Restaurang.one('posts', 1),
                queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            one.post('comments', {id: 1}, queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1/comments?testParam=foo', {headers: headers, method: 'POST', body: '{"id":1}'});
        });

        it('should remove an element', function() {
            var one = Restaurang.one('posts', 1);

            one._fromServer = true;
            one.id = 1;

            one.remove();

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1', {headers: {}, method: 'DELETE'});
        });

        it('should remove an element with queryParams and headers', function() {
            var one = Restaurang.one('posts', 1),
                queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            one._fromServer = true;
            one.id = 1;

            one.remove(queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1?testParam=foo', {headers: headers, method: 'DELETE'});
        });
    });

    describe('Collection methods', function() {
        beforeEach(function() {
            spyOn(Restaurang, 'fetch').and.callThrough();
        });

        it('should get an item from collection', function() {
            var all = Restaurang.all('posts');

            all.get(1);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1', {headers: {}, method: 'GET'});
        });

        it('should get an item from collection', function() {
            var all = Restaurang.all('posts'),
                queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            all.get(1, queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts/1?testParam=foo', {headers: headers, method: 'GET'});
        });

        it('should get a collection', function() {
            var all = Restaurang.all('posts');

            all.getList();

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts', {headers: {}, method: 'GET'});
        });

        it('should get a collection with queryParams and headers', function() {
            var all = Restaurang.all('posts'),
                queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            all.getList(queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts?testParam=foo', {headers: headers, method: 'GET'});
        });

        it('should post a new element', function() {
            var all = Restaurang.all('posts');

            all.post({id: 1});

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts', {headers: {}, method: 'POST', body: '{"id":1}'});
        });

        it('should post a new element with queryParams and headers', function() {
            var all = Restaurang.all('posts'),
                queryParams = {testParam: 'foo'},
                headers = {testHeader: 'bar'};

            all.post({id: 1}, queryParams, headers);

            expect(Restaurang.fetch).toHaveBeenCalledWith('/posts?testParam=foo', {headers: headers, method: 'POST', body: '{"id":1}'});
        });
    });
});

