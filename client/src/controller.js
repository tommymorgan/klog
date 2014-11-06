(function(){
  var controllers = angular.module("keezerControllers", ["lbServices", "n3-line-chart"]);
  function formatData(flows) {
    return 
  }
  
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
  
  controllers.controller("BeerDetailsCtrl", ["$scope"], function ($scope) {
    //TODO;
    $scope.hello = "here";
  });
  
  
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
          id: +$routeParams.kegId,
        }
      }
    }).$promise.then(function (responce) {
      $scope.keg = responce;
    });
  }]);
  
  controllers.controller("KegHistoryCtrl", ["$scope", "$routeParams", "Keg", function ($scope, $routeParams, Keg) {
    Keg.history($routeParams).$promise.then(function (response) {
      $scope.keg = response.data;
      window.response = response;
      var remainingMl = response.data.start_ml;
      $scope.beerName = response.data.beer.name;
//       var data = [{
//         ml: remainingMl,
//         poured: 0,
//         date: new Date(response.data.tapped),
//       }];
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
            return y + "ml of "+$scope.beerName+" remaining";
          },
        },
        drawLegend: false,
        stacks: [],
        lineMode: "linear",
        tension: 0.7,
        drawLegend: true,
        drawDots: true,
        columnsHGap: 5
      };
    });
  }]);
})();
