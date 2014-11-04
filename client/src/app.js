(function() {
  var bodyView;
  var twitterView;
  var pintGlassView;
  var data = dummyData;
  var bodyLoad = $.get('views/body.hbs', function(response) {
    bodyView = Handlebars.compile(response);
  });
  var twitterLoad = $.get('views/twitter.hbs', function(response) {
    Handlebars.registerPartial('twitter', Handlebars.compile(response));
  });
  var pintGlassLoad = $.get('views/pint-glass.hbs', function(response) {
    Handlebars.registerPartial('pintGlass', Handlebars.compile(response));
  });
  var dataLoad = $.get('/api/beers', function(response) {
    data.beer = response;
  });
  
  $.when(bodyLoad, twitterLoad, pintGlassLoad, dataLoad).then(function() {
    data.beer.forEach(function(beer) {
			beer.ibu = (beer.ibu || 0);

			// this is used to write out an srm class name and our srm classes
			// are * 10 to keep decimals out of the variable names
			beer.srmTimesTen = beer.srm * 10;
		});
    
    $('#content').html(bodyView(dummyData));
  })
})();