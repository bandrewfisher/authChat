angular.module('myApp', []).
controller('myController', ['$scope', '$http',
  function($scope, $http) {
    $http.get('/user/profile')
      .success(function(data, status, headers, config) {
        $scope.user = data;
        $scope.error = "";
      }).
    error(function(data, status, headers, config) {
      $scope.user = {};
      $scope.error = data;
    });

    //Display all users in the sidebar
    $scope.users = [];
    $scope.getUsers = function() {
      $http.get('/allUsers').success(function(data) {
        var localUsers = [];
        console.log(data);
        for (var i in data) {
          var pushUser = {
            username: data[i].username,
            profilePic: data[i].profilePic
          }
         localUsers.push(pushUser);
        }
        $scope.users = localUsers;
      })
    }
    $scope.getUsers();

    $scope.username = "";
    $http.get('/userData').success(function(data) {
      console.log("user data:", data);
      $scope.username = data.username;
    })


    //For handling new posts
    $scope.postText = "";
    $scope.submitPost = function() {

      $http.post('/submitPost', { text: $scope.postText }).success(function(data) {
        console.log("successful post");
        console.log(data);
        $scope.postText = "";
        $scope.getPosts();
      })
    }

    //For displaying posts
    $scope.allPosts = [];
    $scope.getPosts = function() {
      $http.get('/allPosts').success(function(data) {
        $scope.allPosts = data;
      })
    }
    $scope.getPosts();

    $scope.formatDate = function(timestamp) {
      var date = new Date(timestamp * 1000);
      var hour = date.getHours();
      var min = date.getMinutes();

      var amPm = "am";
      if (hour > 12) {
        hour -= 12;
        amPm = "pm";
      }
      if (hour == 0) {
        hour = 12;
      }

      return $scope.zeroPad(hour) + ":" + $scope.zeroPad(min) + " " + amPm;
    }

    $scope.zeroPad = function(number) {
      var padding = "";
      if (number < 10) {
        padding = "0";
      }
      return padding + number;
    }

    setInterval($scope.getUsers, 5000);
    setInterval($scope.getPosts, 5000);
  }
]);
