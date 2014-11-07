(function(){
  var controllers = angular.module("keezerControllers", ["lbServices"]);
  controllers.controller("BeersListCtrl", ["$scope", "Keg", "Brewery", function ($scope, Keg, Brewery) {
    Keg.find({
      filter: {
        include: {
          relation: "beer",
          scope: {
            include: {
              relation: "brewery"  
            }
          }
        }
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
  
  controllers.controller("BeerDetailsCtrl", ["$scope", function ($scope) {
    //TODO;
    $scope.hello = "here";
  }]);
  
  
  controllers.controller("KegDetailsCtrl", ["$scope", "$routeParams", "Keg", function ($scope, $routeParams, Keg) {
    Keg.findOne({
      filter: {
        include: {
          relation: "beer",
          scope: {
            include: {
              relation: "brewery"  
            }
          }
        },
        where: {
          id: $routeParams.kegId,
        }
      }
    }).$promise.then(function (response) {
      $scope.keg = response;
    });
  }]);
})();
