angular.module('nibs.task', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.task', {
                url: "/task",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/task.html",
                        controller: "TaskController"
                    }
                }
            })
    })

    // Services
    .factory('Task', function ($http, $rootScope) {
        return {
            create: function(theTask) {
                return $http.post($rootScope.server.url + '/task/', theTask);
            },
            getManager: function(theManager) {
                return $http.post($rootScope.server.url + '/manager', theManager);
            }
        };
    })

    //Controllers
    .controller('TaskController', function ($scope, $window, $ionicPopup, Task, User) {
       
       $scope.manager = {};
       var managerList=
       $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       Task.getManager($scope.sfu).success(function(datalist) {
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

    
        
        $scope.task = {};

        $scope.submit = function () {
            
                Task.create($scope.task).success(function() {
                     $ionicPopup.alert({title: 'Thank You', content: 'Your Claim submitted successfully.'});
                     $scope.task = {};
                });
          
        };

    });
