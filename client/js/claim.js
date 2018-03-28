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
       
             var managerList = [
                    {
                        "ID": 0,
                        "Name": "--None--"
                    },
                    {
                        "ID": 12334445555,
                        "Name": "Sunil Sharma"
                    }, {
                        "ID": 22222222222,
                        "Name": "Arya Rana"
                    }, {
                        "ID": 35555,
                        "Name": "Siddhraj Atodaria"
                    }];
    
    
             var projectType = ["Subscription","Deployment time reduction","Code Optimization","Config Cleanup","Data Purge","Platform Enhancements","UIPM","INC"];
    
               $("#manager").dxLookup({
                        items: managerList,
                        title: "Select Manager",
                        displayExpr: "Name",
                        placeholder: "Select Task Manager / Assignee",
                        onValueChanged: function(data) {
                            //$("#selected-employee").text(data.value.Name);
                        }
                 });
    
               $("#project").dxLookup({
                        items: projectType,
                        title: "Select Project Type",
                        placeholder: "Select Project Type",
                        onValueChanged: function(data) {
                            //$("#selected-employee").text(data.value.Name);
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
