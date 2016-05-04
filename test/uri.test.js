define(
  [ 'Squire' ]
  , function(Squire) {
    describe('Serialize', function() {

      var uri
        , serialize = function (value) {
            return Object.keys(value).length
              ? '?' + JSON.stringify(value)
              : ''
          }

      beforeEach(function(done) {

        var injector = new Squire()

        injector
          .mock('serialize', function() { return serialize })
          .require(
              [ 'uri' ]
            , function(r) {
              uri = r
              done()
            }
          )
      })

      it('should parse a single pathname', function() {
        var path = '/'
          , url = uri(path)
        url.path().should.equal(path)
        url.query().should.deep.equal({})
        url.search().should.equal('')
        url.pathname().should.equal('/')
        url.hash().should.equal('')
      })

      it('should parse a path with query string', function() {
        var path = '/?a=b&a=c&d=hello+world&e=foo%20bar'
          , query = {a: ['b', 'c'], d: 'hello world', e: 'foo bar'}
          , url = uri(path)
        url.path().should.equal('/' + serialize(query))
        url.query().should.deep.equal(query)
        url.search().should.equal(serialize(query))
        url.pathname().should.equal('/')
        url.hash().should.equal('')
      })

      it('should parse a path with hash', function() {
        var path = '/#foo%20bar'
          , url = uri(path)
        url.path().should.equal(path)
        url.query().should.deep.equal({})
        url.search().should.equal('')
        url.pathname().should.equal('/')
        url.hash().should.equal('foo%20bar')
      })

      it('should parse a path with hash and query string', function() {
        var path = '/?a=b#foo%20bar'
          , hash = 'foo%20bar'
          , query = {a: 'b'}
          , url = uri(path)
        url.path().should.equal('/' + serialize(query) + '#' + hash)
        url.query().should.deep.equal(query)
        url.search().should.equal(serialize(query))
        url.pathname().should.equal('/')
        url.hash().should.equal(hash)
      })

      it('should update the path components', function() {
        var path = '/foo?a=b&a=c&d=hello+world&e=foo%20bar#baz'
          , pathname = '/foo'
          , pathname2 = '/bar'
          , query = {a: ['b', 'c'], d: 'hello world', e: 'foo bar'}
          , query2 = {a: 'b', d: undefined, e: 'foo bar'}
          , hash = 'baz'
          , hash2 = 'foo'
          , url = uri(path)

        url.path().should.equal(pathname + serialize(query) + '#' + hash)
        url.query().should.deep.equal(query)
        url.search().should.equal(serialize(query))
        url.pathname().should.equal(pathname)
        url.hash().should.equal(hash)

        url.query({a: 'b', d: undefined}).query().should.deep.equal(query2)
        url.pathname(pathname2).pathname().should.equal(pathname2)
        url.hash(hash2).hash().should.deep.equal(hash2)

        url.path().should.equal(pathname2 + serialize(query2) + '#' + hash2)
        url.search().should.equal(serialize(query2))
      })

      it('should update the query when search is updated', function() {
        var path = '/foo?a=b&a=c&d=hello+world&e=foo%20bar#baz'
          , pathname = '/foo'
          , query = {a: ['b', 'c'], d: 'hello world', e: 'foo bar'}
          , query2 = {a: 'b', e: 'hello world'}
          , hash = 'baz'
          , url = uri(path)

        url.path().should.equal(pathname + serialize(query) + '#' + hash)
        url.pathname().should.equal(pathname)
        url.query().should.deep.equal(query)
        url.search().should.equal(serialize(query))
        url.hash().should.equal(hash)

        url.search('?a=b&e=hello%20world')

        url.path().should.equal(pathname + serialize(query2) + '#' + hash)
        url.pathname().should.equal(pathname)
        url.search().should.equal(serialize(query2))
        url.query().should.deep.equal(query2)
        url.hash().should.equal(hash)

        url.search('a=b&e=hello%20world')

        url.path().should.equal(pathname + serialize(query2) + '#' + hash)
        url.pathname().should.equal(pathname)
        url.search().should.equal(serialize(query2))
        url.query().should.deep.equal(query2)
        url.hash().should.equal(hash)
      })

      it('should parse the path again when set', function() {
        var path = '/foo?a=b&a=c&d=hello+world&e=foo%20bar#baz'
          , pathname = '/foo'
          , pathname2 = '/bar'
          , query = {a: ['b', 'c'], d: 'hello world', e: 'foo bar'}
          , query2 = {a: 'b', e: 'foo bar'}
          , hash = 'baz'
          , hash2 = 'foo'
          , url = uri(path)

        url.path().should.equal(pathname + serialize(query) + '#' + hash)
        url.query().should.deep.equal(query)
        url.search().should.equal(serialize(query))
        url.pathname().should.equal(pathname)
        url.hash().should.equal(hash)

        url.path('/bar?a=b&e=foo+bar#foo')

        url.path().should.equal(pathname2 + serialize(query2) + '#' + hash2)
        url.pathname().should.equal(pathname2)
        url.search().should.equal(serialize(query2))
        url.query().should.deep.equal(query2)
        url.hash().should.deep.equal(hash2)
      })
    })
  }
)