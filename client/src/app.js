(function() {
	var bodyView;
	var twitterView;
	var pintGlassView;
	var bodyLoad = $.get('views/body.hbs', function(response) {
		bodyView = Handlebars.compile(response);
	});
	
	var twitterLoad = $.get('views/twitter.hbs', function(response) {
		Handlebars.registerPartial('twitter', Handlebars.compile(response));
	});
	
	var pintGlassLoad = $.get('views/pint-glass.hbs', function(response) {
		Handlebars.registerPartial('pintGlass', Handlebars.compile(response));
	});
	
	var breweries = $.get('/api/breweries');
	
	var beers = $.get('/api/beers', function(data) {
		data.forEach(function(beer) {
			beer.ibu = (beer.ibu || 0);

			// this is used to write out an srm class name and our srm classes
			// are * 10 to keep decimals out of the variable names
			beer.srmTimesTen = beer.srm * 10;
		});
		
		return data;
	});
	
	var kegs = $.get('/api/kegs', function(data) {
		return data.filter(function(item) {
			return !item.floated;
		});
	});
	
	$.when(bodyLoad, twitterLoad, pintGlassLoad, breweries, beers, kegs).then(function(body, twitter, pint, breweries, beers, kegs) {
		beers = beers[0];
		breweries = breweries[0];
		kegs = kegs[0];
		
		kegs.forEach(function(keg) {
			var beer = beers.filter(function(item) {
				return item.id == keg.beer_id;
			})[0];

			var brewery = breweries.filter(function(item) {
				return item.id == beer.brewery_id;
			})[0];
			
			keg.abv = beer.abv;
			keg.brewery = brewery.name;
			keg.ibu = beer.ibu;
			keg.name = beer.name;
			keg.srmTimesTen = beer.srmTimesTen;
		});

		$('#content').html(bodyView({
			"keg": kegs,
			"title": 'On Tap'
		}));
	});
})();