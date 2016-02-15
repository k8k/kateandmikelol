'use strict';

module.exports = angular.module('app', []);

angular.module('app', [])
.factory('apiSvc', ['$http', '$q', function($http, $q) {

  var octoberStart = /^2015-11/

	// Return public API.
	return({
		addFriend: addFriend,
		getFriends: getFriends,
		removeFriend: removeFriend,
    getCrime: getCrime,
    crimeDescriptionKeys: [
      'VANDALISM', 'STOLEN VEHICLE', 'DISORDERLY CONDUCT', 'ROBBERY', 'BURG - AUTO',
      'BURG - COMMERCIAL', 'BURG - RESIDENTIAL', 'PETTY THEFT', 'WEAPONS', 'NARCOTICS',
      'THEFT', 'BURGLARY-AUTO', 'POSSESS NARCOTIC CONTROLLED SUBSTANCE', 'ARSON'
    ],
    crimeDateRange: octoberStart
	});

  function getCrime() {
    var request = $http({
      method: "get",
      url: "http://data.oaklandnet.com/resource/ym6k-rx7a.json",
      params: {},
      data: {}
    });
    return (request.then(handleSuccess, handleError));
  }

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
  $scope.JQ = jQuery;
  var SEN = 37.807082;
  var SEW = -122.266949;
  var NEN = 37.819212;
  var NEW = -122.278830;
  var octoberEnd = '2015-10';

  apiSvc.getCrime()
    .then(function(crimeData) {
      var crimeResults = filterCrime(crimeData);
      console.log('filtered results', crimeResults);
    }, function(err) {
      if (err) {
        console.log('ERR', err);
      }
    });


  function filterCrime(crime) {
    return crime.reduce(function(memo, valObj) {
      if (!!~apiSvc.crimeDescriptionKeys.indexOf(valObj.crimetype)) {
        var day = new Date(valObj.datetime);
        if (apiSvc.crimeDateRange.test(valObj.datetime)) {
          //just comparing largest geo ranges for now
          if (valObj.location_1.longitude <= SEW && valObj.location_1.latitude <= NEN) {
            valObj.datetime = valObj.datetime.replace(apiSvc.crimeDateRange, octoberEnd);
            memo.push(valObj);
          }
        }
      }
      return memo;
    }, []);
  }

  function printMessage (status='working') {		// default params
    let message = 'ES6';					            	// let
    console.log(`${message} is ${status}`);	    // template string
  }
  printMessage();


}]);
