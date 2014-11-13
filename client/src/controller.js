(function(){
  "use strict"
  var controllers = angular.module("keezerControllers", ["lbServices", "n3-line-chart"]);
  
  var addFakeKegs = function (kegs) {
    var existedKeg, kegsList=[];

    for (var kegNumber = 1;  kegNumber <= 6; kegNumber++) {
      existedKeg = kegs.filter(function (keg){ return +keg.tap === kegNumber; })[0];
      if(!existedKeg) {
        existedKeg = {
          tap: kegNumber,
          volume: 0,
          fakeKeg: true
        }
      }
      kegsList.push(existedKeg);
    }

    return kegsList;
  };

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
        },
        order: 'tap ASC'
      }
    }).$promise.then(function (kegs){
      kegs.forEach(function(keg) {
        keg.beer.srm *= 10;
        keg.volume = Math.ceil(keg.current_ml * 100  / 18927);
      });
      $scope.kegs = addFakeKegs(kegs.filter(function (keg) {return !keg.floated;}));
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

  controllers.controller("KegHistoryCtrl", ["$scope", "$routeParams", "Keg", function ($scope, $routeParams, Keg) {
    Keg.history($routeParams).$promise.then(function (response) {
      $scope.keg = response.data;
      $scope.beerName = response.data.beer.name;
      var remainingMl = response.data.start_ml;
      var data = [];
      response.data.keg_flows.forEach(function(flow) {
        remainingMl -= flow.ml;

        data.push({
          ml: remainingMl,
          poured: flow.ml,
          date: new Date(flow.timestamp),
        });
      });
      $scope.data = data;
      $scope.currentVolume = remainingMl;
      $scope.options = {
        axes: {
          x: {
            type: "date",
            key: "date"
          },
          y: {
            type: "area",
            min: 0,
          },
        },
        series: [
          {
            y: "ml",
            label: $scope.beerName,
            color: "black",
            axis: "y",
            type: "line",
            thickness: "2px",
            id: "series_0"
          },
        ],
        tooltip: {
          mode: 'scrubber',
          interpolate: true,
          formatter: function(x, y, series) {
            return y + "ml of "+$scope.beerName;
          },
        },
        stacks: [],
        lineMode: "linear",
        tension: 0.7,
        drawLegend: false,
        drawDots: true,
        columnsHGap: 5
      };
    });
  }]);
})();
