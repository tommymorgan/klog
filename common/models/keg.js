var _ = require('lodash');
var app = require('../../server/server');

module.exports = function(Keg) {
	Keg.history = function(tap, callback) {
    if(!_.isNumber(+tap)) {
      callback(null, {});
    }
    
   Keg.findOne({
      where: {
        floated: null,
        tap: tap
      },
      include: [
        'beer',
        'keg_flows',
      ],
    }, callback);
  };
	
	Keg.remoteMethod('history', {
		http: {
      path: '/history',
      verb: 'get'
    },
    accepts: {
      arg: 'tap',
      type: 'number',
    },
    returns: {
      arg: 'data',
      type: 'object',
    },
	});
};
