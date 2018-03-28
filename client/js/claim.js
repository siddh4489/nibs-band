angular.module('nibs.claim', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.claim', {
                url: "/claimform",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/claim.html",
                        controller: "ClaimController"
                    }
                }
            })
    })

    // Services
    .factory('Claim', function ($http, $rootScope) {
        return {
            create: function(theClaim) {
                return $http.post($rootScope.server.url + '/claims/', theClaim);
            }
        };
    })

    //Controllers
    .controller('ClaimController', function ($scope, $window, $ionicPopup, Claim, User) {
       
             var test = [
                    {
                        "ID": 0,
                        "Name": "--None--"
                    },
                    {
                        "ID": 12334445555,
                        "Name": "John Heart"
                    }, {
                        "ID": 22222222222,
                        "Name": "SId"
                    }, {
                        "ID": 35555,
                        "Name": "Heart"
                    }];
    
               $("#event").dxLookup({
                        items: test,
                        title: "Select Manager",
                        displayExpr: "Name",
                        onValueChanged: function(data) {
                            $("#selected-employee").text(data.value.Name);
                        }
                    });

        $scope.claim = {};

        $scope.submit = function () {
            
                Claim.create($scope.claim).success(function() {
                     $ionicPopup.alert({title: 'Thank You', content: 'Your Claim submitted successfully.'});
                     $scope.claim = {};
                });
          
        };

    });
