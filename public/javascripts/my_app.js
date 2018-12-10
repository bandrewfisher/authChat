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
    $http.get('/allUsers').success(function(data) {
      console.log(data);
      for(var i in data) {
        var pushUser = {
          username: data[i].username,
          profilePic: data[i].profilePic
        }
        $scope.users.push(pushUser);
      }
    })
    
    $scope.postText = "";
    $scope.submitPost = function() {
      
      $http.post('/submitPost', {text: $scope.postText}).success(function(data) {
        console.log("successful post");
        console.log(data);
        $scope.postText = "";
      })
      
      
    }
  }
]);
