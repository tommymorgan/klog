module.exports = function(Beer) {
	var _ = require('lodash');
	var bjcp = require('../data/bjcp.json');
	var loopback = require('loopback');
	
	function getCategory(id) {
		return _.find(bjcp.beers, function(category) {
			return category.number === id;
		});
	}
	
	function getSubcategory(categoryId, letter) {
		var category = getCategory(categoryId);
		
		return _.find(category.subcategories, function(subcategory) {
			return subcategory.letter === letter;
		});
	}
	
	Beer.bjcp = bjcp;
	
	Beer.styleName = function(category, subcategory, callback) {
		category = getCategory(category);
		subcategory = subcategory && getSubcategory(category.number, subcategory);
		
		var name = subcategory && subcategory.name || category.name;
		
		callback(null, name);
	};
	
	Beer.remoteMethod(
		"styleName",
		{
			accepts: [{
				arg: "category",
				type: "number"
			}, {
				arg: "subcategory",
				type: "string"
			}],
			http: {
				path: "/styleName",
				verb: "get"
			},
			returns: {
				arg: "styleName",
				type: "string"
			},
		}
	);
};
