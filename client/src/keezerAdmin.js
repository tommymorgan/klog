var keezerAdmin = angular.module('keezerAdmin',["ngRoute", "lbServices", "adminControllers"]);
keezerAdmin.config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when("/admin/:entity/create", {
          templateUrl: function (params) { return "src/partials/admin/" + params.entity + ".html"; },
          controller: "AdminEntityCreateCtrl"
      }).
      when("/admin/:entity", {
         templateUrl: "src/partials/admin/entities.html",
         controller: "AdminEntitiesListCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });
  }])