angular.module("keezerControllers", ["lbServices"])
  .controller("BeerListCtrl", ["$scope", "Keg", function ($scope, Keg) {
    Keg.find({
      filter: {
        include: ['beer']
      },
      where: {
        floated: null
      }
    }).$promise.then(function (kegs){
        kegs.forEach(function(keg) {
          keg.beer.srm *= 10;
          keg.volume = Math.ceil(keg.current_ml * 100  / 58673);
        });
        $scope.kegs = kegs;  
    });
}]);