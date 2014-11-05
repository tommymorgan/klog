var keezerControllers = angular.module("keezerControllers", ["lbServices"]);

keezerControllers.controller("BeerListCtrl", ["$scope", "Beer", "Keg", function ($scope, Beer, Keg) {
	$scope.beers = Beer.find({
		filter: {
      include: 'breweries',
      where: {
        floated: null
      }
    }
	});

  $scope.kegs = Keg.find({
    filter: {
      include: 'beer'
    }
  });
}]);