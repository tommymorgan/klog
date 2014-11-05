var keezerControllers = angular.module("keezerControllers", ["lbServices"]);

keezerControllers.controller("BeerListCtrl", ["$scope", "Keg", function ($scope, Keg) {
  Keg.find({
    filter: {
      include: 'beer'
    },
    where: {
      floated: null
    }
  }).$promise.then(function (kegs){
      kegs.forEach(function(keg) {
        keg.beer.srm *= 10; 
      });
      $scope.kegs = kegs;  
  });
}]);