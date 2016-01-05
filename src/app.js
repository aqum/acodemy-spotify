angular.module('app', [])
.filter('duration', function() {
  return function(durationMs) {
    var seconds = Math.round(durationMs / 1000);
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
  };
})
.provider('SpotifyApi', function($sceDelegateProvider) {
  var whitelist = $sceDelegateProvider.resourceUrlWhitelist();
  whitelist.push('https://p.scdn.co/mp3-preview/**');
  $sceDelegateProvider.resourceUrlWhitelist(whitelist);

  this.apiUrl = 'https://api.spotify.com/v1';
  this.defaults = {
    params: {
      limit: 10
    }
  };

  this.$get = function($http) {
    return {
      apiUrl: this.apiUrl,
      defaults: this.defaults,
      search: function(query, types) {
        var url = this.apiUrl + '/search';
        var config = angular.copy(this.defaults);

        config.params.q = query;
        config.params.type = types.join(',');

        return $http.get(url, config);
      }
    };
  };
})
.controller('MainController', function($scope, $location, SpotifyApi) {
  $scope.search = $location.search().q || '';
  $scope.searchResults = {};

  $scope.$watch('search', function(search) {
    $location.search('q', search || null);

    if (!search) {
      $scope.searchResults = {};
      return;
    }

    SpotifyApi.search(search, ['album', 'artist', 'track'])
    .then(function(response) {
      $scope.searchResults = response.data;
    });
  });

})
.directive('clearableInput', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    link: function ($scope, $element, $attrs, modelCtrl) {
      var input = $element[0];

      input.addEventListener('input', function() {
        $scope.$apply(function() {
          modelCtrl.$setViewValue(input.value);
        });
      });

      modelCtrl.$render = function() {
        input.value = modelCtrl.$viewValue;
      };
    }
  };
});
