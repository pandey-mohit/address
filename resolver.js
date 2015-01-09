define(
  [ 'logger/log!platform/am-address'
  , 'underscore'
  ]
  , function(log, _) {

    function isFn(inst){
      return typeof inst === "function"
    }

    return function (dep) {

      return function(req, res) {

        require([dep], function(fn) {

          fn = fn[req.method] || fn

          if(!isFn(fn)) {
            log.debug("failed to resolve resource function from module", dep, req.method)
            return
          }

          fn.call(null, req, function() {
            if(arguments.length == 1) return res.call(null, null, arguments[0])
            res.apply(null, arguments)
          })
        })
      }

    }
  }
)
  