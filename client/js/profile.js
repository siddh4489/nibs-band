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
    .controller('ProfileCtrl', function ($rootScope, $scope, $state, User, STATUS_LABELS, STATUS_DESCRIPTIONS) {

       var peopleElement = document.getElementById("people");
        var orgChart = new getOrgChart(peopleElement, {
            primaryFields: ["name", "title", "phone", "mail"],
            photoFields: ["image"],
            dataSource: [
                { id: 1, parentId: null, name: "Amber McKenzie", title: "CEO", phone: "678-772-470", mail: "lemmons@jourrapide.com", adress: "Atlanta, GA 30303", image: "images/f-11.jpg" },
                { id: 2, parentId: 1, name: "Ava Field", title: "Paper goods machine setter", phone: "937-912-4971", mail: "anderson@jourrapide.com", image: "images/f-10.jpg" },
                { id: 3, parentId: 1, name: "Evie Johnson", title: "Employer relations representative", phone: "314-722-6164", mail: "thornton@armyspy.com", image: "images/f-9.jpg" },
                { id: 4, parentId: 1, name: "Paul Shetler", title: "Teaching assistant", phone: "330-263-6439", mail: "shetler@rhyta.com", image: "images/f-5.jpg" },
                { id: 5, parentId: 2, name: "Rebecca Francis", title: "Welding machine setter", phone: "408-460-0589", image: "images/f-4.jpg" },
                { id: 6, parentId: 2, name: "Rebecca Randall", title: "Optometrist", phone: "801-920-9842", mail: "JasonWGoodman@armyspy.com", image: "images/f-8.jpg" },
                { id: 7, parentId: 2, name: "Spencer May", title: "System operator", phone: "Conservation scientist", mail: "hodges@teleworm.us", image: "images/f-7.jpg" },
                { id: 8, parentId: 6, name: "Max Ford", title: "Budget manager", phone: "989-474-8325", mail: "hunter@teleworm.us", image: "images/f-6.jpg" },
                { id: 9, parentId: 7, name: "Riley Bray", title: "Structural metal fabricator", phone: "479-359-2159", image: "images/f-3.jpg" },
                { id: 10, parentId: 7, name: "Callum Whitehouse", title: "Radar controller", phone: "847-474-8775", image: "images/f-2.jpg" }
            ]
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
