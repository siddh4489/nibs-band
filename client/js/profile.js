angular.module('nibs.profile', ['nibs.s3uploader', 'nibs.config', 'nibs.status'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.profile', {
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })

            .state('app.edit-profile', {
                url: "/edit-profile",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/edit-profile.html",
                        controller: "EditProfileCtrl"
                    }
                }
            })

    })

    // Services
    .factory('User', function ($http, $rootScope) {
        return {
            get: function () {
                return $http.get($rootScope.server.url + '/users/me', null)
            },

            update: function (user) {
                return $http.put($rootScope.server.url + '/users/me', user)
            },
            getResourveView: function(theTasklst) {
                return $http.post($rootScope.server.url + '/resourceview/',theTasklst);
            }
            
            
        };

    })

    .factory('Taskview', function ($http, $rootScope) {
        return {
      
            getResourveView: function(theTasklst) {
                return $http.post($rootScope.server.url + '/resourceview/',theTasklst);
            }
        };

    })

    .factory('Preference', function() {

        var preferences = [
            { text: 'Shred', value: 'Shred' },
            { text: 'Open/Scan', value: 'Open/Scan' },
            { text: 'Fwd', value: 'Fwd' }
        ];

        return {
            all: function() {
                return preferences;
            }
        }
    })

    .factory('Size', function() {

        var sizes = [
            { text: 'USPS', value: 'USPS' },
            { text: 'FedEx', value: 'FedEx' },
            { text: 'UPS', value: 'UPS' },
            { text: 'Courier', value: 'Courier' }
        ];

        return {
            all: function() {
                return sizes;
            }
        }
    })

    //Controllers
    .controller('ProfileCtrl', function ($rootScope, $scope,$window, $state, Taskview, STATUS_LABELS, STATUS_DESCRIPTIONS) {
       
      $scope.taskview = {};
        $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
            Taskview.getResourveView($scope.sfu).success(function(datalist) {
                     alert('----> resource View '+datalist);
                     alert('----> resource View '+JSON.stringify(datalist));
                      
                     var peopleElement = document.getElementById("people");
                        var orgChart = new getOrgChart(peopleElement, {
                            primaryFields: ["task_name__c", "task_description__c"],
                            photoFields: ["image"],
                            dataSource: datalist;
                        });
                     //$scope.taskview = datalist;
            });
    
    
    
       
    
    })

    .controller('EditProfileCtrl', function ($scope, $window, $ionicPopup, S3Uploader, User, Preference, Size, Status) {

        User.get().success(function(user) {
            $scope.user = user;
        });
        $scope.preferences = Preference.all();
        $scope.sizes = Size.all();

        $scope.panel = 1;

        $scope.update = function () {
            //alert('user json'+JSON.stringify($scope.user));
            User.update($scope.user).success(function() {
                Status.show('Your profile has been saved.');
            })
        };

        $scope.addPicture = function (from) {
        //    alert('camera'+navigator.camera);
            if (!navigator.camera) {
                $ionicPopup.alert({title: 'Sorry', content: 'This device does not support Camera'});
                return;
            }

            var fileName,
                options = {   quality: 45,
                    allowEdit: true,
                    targetWidth: 300,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG };
            if (from === "LIBRARY") {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                options.saveToPhotoAlbum = false;
            } else {
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.saveToPhotoAlbum = true;
            }

            navigator.camera.getPicture(
                function (imageURI) {
                    // without setTimeout(), the code below seems to be executed twice.
                    setTimeout(function () {
                        fileName = new Date().getTime() + ".jpg";
                        S3Uploader.upload(imageURI, fileName).then(function () {
                            //alert('S3uploader called'+fileName);
                            //$scope.user.pictureurl = 'https://s3-us-west-1.amazonaws.com/sfdc-demo/' + fileName;
                              $scope.user.pictureurl = 'https://s3.amazonaws.com/mailgapp/'+fileName;
                        });
                    });
                },
                function (message) {
                    // We typically get here because the use canceled the photo operation. Seems better to fail silently.
                }, options);
            return false;
        };
    });
