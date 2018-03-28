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
            },
            getManager: function(theManager) {
                return $http.post($rootScope.server.url + '/manager', theManager);
            }
        };
    })

    //Controllers
    .controller('ClaimController', function ($scope, $window, $ionicPopup, Claim, User) {
       
       $scope.manager = {};
       var managerList=
       $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       Claim.getManager($scope.sfu).success(function(datalist) {
           $("#manager").dxLookup({
                        items: datalist,
                        title: "Select Manager",
                        displayExpr: "name",
                        placeholder: "Select Task Manager / Assignee",
                        onValueChanged: function(data) {
                            //$("#selected-employee").text(data.value.Name);
                        }
                 });
        });
         $("#manager").dxLookup({
                        items: managerList,
                        title: "Select Manager",
                        displayExpr: "name",
                        placeholder: "Select Task Manager / Assignee",
                        onValueChanged: function(data) {
                            //$("#selected-employee").text(data.value.Name);
                        }
                 });
    
             /*var managerList = [
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
                    }];*/
    
    
             var projectType = ["Subscription","Deployment time reduction","Code Optimization","Config Cleanup","Data Purge","Platform Enhancements","UIPM","INC","Self Study"];
    
               
    
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