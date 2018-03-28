angular.module('nibs.claimlist', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.claimlist', {
                url: "/claimlist",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/claimlist.html",
                        controller: "ClaimListController"
                    }
                }
            })
    })

    // Services
    .factory('Claimlist', function ($http, $rootScope) {
        return {
            getClaimList: function(theClaimlst) {
                return $http.post($rootScope.server.url + '/claimlists/',theClaimlst);
            }
        };
    })

    //Controllers
    .controller('ClaimListController', function ($scope, $window, $ionicPopup, Claimlist, User) {
        //var data = $.param({'sfuser':$window.localStorage.getItem('sfuser'),'sfpassword':$window.localStorage.getItem('sfpassword')});
        $scope.claimlist = {};
        $scope.sfu = $window.localStorage.getItem('sfuser');
            Claimlist.getClaimList($scope.sfu).success(function(datalist) {
                     $scope.claimlist = datalist;
                });
      

       

  });
