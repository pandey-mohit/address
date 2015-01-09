define(
  [ 'type/type'
  ]
, function(type) {

    return function(location) {

      return function(req, res) {

        if(type.isFunction(res.body)) {  
          var view = res.body
          res.body = function(node) {
            var uri = res.headers.location || req.uri
            if(location.isRoot(node)) location.pushState(uri)
            node.dispatchEvent && node.dispatchEvent(new CustomEvent("update", {detail : { from : node.__resource__, to : uri }}))
            node.__resource__ = uri
            view(node)
          }
        }
      }
    }
  }
)