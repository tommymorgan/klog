(function () {
  var appControllers = angular.module("adminControllers", ["lbServices"]);

  appControllers.factory("entitiesMap",["Beer", "Brewery", "Keg", function (Beer, Brewery, Keg) {
    return {
        beer: {
          model: Beer,
          relation: "brewery"
        }, 
        brewery: {
          model: Brewery,
          relation: null
        },
        keg: {
          model: Keg,
          relation: "beer",
        }
    };
  }]);

  appControllers.controller("AdminEntitiesListCtrl", 
     ["$scope", "$routeParams", "entitiesMap", function ($scope, $routeParams, entitiesMap) {
        var entity = $routeParams.entity;
        $scope.entity = entity;
        entitiesMap[entity].model.find().$promise.then(function (response){
          $scope.entities = response;
        });
  }]);

  appControllers.controller("AdminEntityCreateCtrl", 
     ["$scope", "$routeParams", "entitiesMap", function ($scope, $routeParams, entitiesMap) {
        var entity = $routeParams.entity;
        $scope.model = {};
       
        entitiesMap.brewery.model.find().$promise.then(function (response) {
          $scope.breweries = response;
        });
      
        $scope.saveModel = function () {
          debugger;
          entitiesMap[entity].model.create($scope.model);
        };

        $scope.back = function () {
          window.history.back();
        }  


    }]);
})();