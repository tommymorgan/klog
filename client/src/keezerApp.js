var keezerApp = angular.module('keezerApp',["ngRoute", "lbServices", "keezerControllers", "ngAnimate"]);
keezerApp.config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/beers-menu', {
        templateUrl: 'src/partials/beers-menu.html',
        controller: 'BeersListCtrl'
      }).
      when('/beers/:beerId', {
        templateUrl: 'src/partials/beer-detail.html',
        controller: 'BeerDetailCtrl'
      }).
      when("/kegs/:kegId", {
        templateUrl: "src/partials/keg-detail.html",
        controller: "KegDetailsCtrl"
      }).
      when("/kegs/history/:tap", {
        templateUrl: "src/partials/keg-history.html",
        controller: "KegHistoryCtrl",
      }).
      otherwise({
        redirectTo: '/beers-menu'
      });
  }
]);