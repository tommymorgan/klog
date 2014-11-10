(function () {
  var appControllers = angular.module("adminControllers", ["lbServices"]);
  appControllers.controller("AdminEntitiesListCtrl", 
     ["$scope", "$routeParams", "Beer", "Brewery", "Keg", 
     function ($scope, $routeParams, Beer, Brewery, Keg) {
        var entitiesMap = {
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
        }
        var entity = $routeParams.entity;
        $scope.entity = entity;
        entitiesMap[entity].model.find().$promise.then(function (response){
          $scope.entities = response;
        });
  }]);
})();