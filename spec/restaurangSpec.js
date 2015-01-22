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
            var url = 'http://google.com';
            Restaurang.setUrl(url);

            expect(Restaurang._url).toBe(url);
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
        it('should be tested', function() {
            expect(1).toBe(2)
        });
    });

    describe('Collection methods', function() {
        it('should be tested', function() {
            expect(1).toBe(2)
        });
    });

});

