(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Users', UsersService);

  // @ngInject
  function UsersService($resource, $cacheFactory) {
    var cache = $cacheFactory('userCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Users = $resource('/api/current_user',
      {},
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: true
        },
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        },
        update: {
          method: 'PUT',
          interceptor: cacheInterceptor
        }
      });

    return Users;
  }

})();
