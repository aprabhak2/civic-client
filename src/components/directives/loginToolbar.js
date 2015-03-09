(function() {
  'use strict';
  angular.module('civic.security.login.toolbar', [])
    .directive('loginToolbar', loginToolbar);

  // @ngInject
  function loginToolbar() {

    var directive = {
      templateUrl: 'components/directives/loginToolbar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      controller: /* @ngInject */ function($scope, $rootScope, $location, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.login = Security.showLogin;
        $scope.logout = Security.logout;

        // $scope.alert = alert('clicked');

        $scope.$watch(function() {
          return Security.currentUser;
        }, function(currentUser) {
          $scope.currentUser = currentUser;
        });

        $scope.status = {
          isopen: false
        };

        $scope.toggleDropdown = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.status.isopen = !$scope.status.isopen;
        };

        if(!$scope.currentUrl) { $scope.currentUrl = $location.url() }
        $rootScope.$on('$stateChangeSuccess', function() {
          $scope.currentUrl = $location.url();
        });
      }
    };
    return directive;
  }
})();
