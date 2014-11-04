module.exports = function(Keg) {
  Keg.test = function(name, num, callback){
    callback(null, name+' and '+num);
  };
  Keg.remoteMethod('test', {
    accepts: [{
      arg: 'name',
      type: 'string'
    }, {
      arg: 'num',
      type: 'number'
    }],
    returns: {
      arg: 'echo',
      type: 'string'
    },
    http: {path: '/test', verb: 'post'},
  });
};
