angular.module('nibs.claimlist', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.claimlist', {
                url: "/tasklist",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/tasklist.html",
                        controller: "TaskListController"
                    }
                }
            })
    })

    // Services
    .factory('Tasklist', function ($http, $rootScope) {
        return {
            getTaskList: function(theTasklst) {
                return $http.post($rootScope.server.url + '/tasklist/',theTasklst);
            }
        };
    })

    //Controllers
    .controller('TaskListController', function ($scope, $window, $ionicPopup, Tasklist, User) {
        $scope.claimlist = {};
        $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
            Tasklist.getTaskList($scope.sfu).success(function(datalist) {
                     $scope.claimlist = datalist;
                });
  });
