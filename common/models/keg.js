var _ = require('lodash');

module.exports = function(Keg) {
	Keg.myEndpoint = function(callback) {
    var test = Keg.find({
      include: [
        'beer',
      ],
    }, function(err, kegs) {
      var temp = [];
      
      _.each(kegs, function(keg) {
        temp.push(JSON.stringify(keg.beer.find));
      });
      
      callback(null, temp);
    });
  };
	
	Keg.remoteMethod('myEndpoint', {
		http: {
      path: '/myEndpoint',
      verb: 'get'
    },
    returns: {
      arg: 'foo',
      type: 'string',
    },
	});

	Keg.find = function(filter, cb) {
		var key = '';
		
		if (filter) {
			key = JSON.stringify(filter);
		}
		
		var cachedResults = cache[key];
		
		if (cachedResults) {
		  process.nextTick(function() {
				cb(null, cachedResults);
			});
		} else {
			find.call(Keg, function(err, results) {
				results = results.filter(function(item) {
					return item.tap === 1;
				});
				
				if (!err) {
					cache[key] = results;
				}
				
				cb(err, results);
			});
		}
	};
};
