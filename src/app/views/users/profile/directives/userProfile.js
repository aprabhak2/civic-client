(function() {
  'use strict';
  angular.module('civic.users')
    .directive('userProfile', userProfile)
    .controller('UserProfileController', UserProfileController);

// @ngInject
  function userProfile(Security) {
    var directive = {
      restrict: 'E',
      scope: {
        'user': '='
      },
      replace: true,
      templateUrl: 'app/views/users/profile/directives/userProfile.tpl.html',
      link: /* ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
        $scope.login = Security.showLogin;
      },
      controller: 'UserProfileController'
    };

    return directive;
  }

  // @ngInject
  function UserProfileController($log) {
    $log.info('UserProfileController loaded.');
  }
})();
