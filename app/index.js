'use strict';

module.exports = angular.module('app', []);

angular.module('app', [])
.factory('apiSvc', ['$http', '$q', function($http, $q) {

	// Return public API.
	return({
		addFriend: addFriend,
		getFriends: getFriends,
		removeFriend: removeFriend
	});

	// ---
	// PUBLIC METHODS.
	// ---
	// I add a friend with the given name to the remote collection.
	function addFriend( name ) {

		var request = $http({
			method: "post",
			url: "api/index.cfm",
			params: {
				action: "add"
			},
			data: {
				name: name
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}

	// I get all of the friends in the remote collection.
	function getFriends() {

		var request = $http({
			method: "get",
			url: "api/index.cfm",
			params: {
				action: "get"
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}

	// I remove the friend with the given ID from the remote collection.
	function removeFriend( id ) {

		var request = $http({
			method: "delete",
			url: "api/index.cfm",
			params: {
				action: "delete"
			},
			data: {
				id: id
			}
		});
		return( request.then( handleSuccess, handleError ) );
	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I transform the error response, unwrapping the application dta from
	// the API response payload.
	function handleError( response ) {
		// The API response from the server should be returned in a
		// nomralized format. However, if the request was not handled by the
		// server (or what not handles properly - ex. server error), then we
		// may have to normalize it on our end, as best we can.
		if (!angular.isObject( response.data ) || !response.data.message) {
			return( $q.reject( "An unknown error occurred." ) );
		}
		// Otherwise, use expected error message.
		return( $q.reject( response.data.message ) );
	}


	// I transform the successful response, unwrapping the application data
	// from the API response payload.
	function handleSuccess( response ) {
		return( response.data );
	}

}])
.controller('mainCtl', ['$scope', 'apiSvc', function($scope, apiSvc) {
  console.log('in main ctl');
  var JQ = jQuery;
  $scope.dog = 'helen';

  function printMessage (status='working') {		// default params
    let message = 'ES6';					            	// let
    console.log(`${message} is ${status}`);	    // template string
  }
  printMessage();


}]);
