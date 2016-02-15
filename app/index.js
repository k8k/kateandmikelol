'use strict';

module.exports = angular.module('app', []);

angular.module('app', [])
.factory('apiSvc', ['$http', '$q', function($http, $q) {

  var octoberStart = /^2015-11/;

  // Return public API.
  return({
    getInsta: getInsta,
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

  function getInsta() {
    var request = $http({
      method: "jsonp",
      url: 'https://api.instagram.com/v1/tags/kateandmikelol/media/recent',
      params: {
        access_token: '47879835.1677ed0.290441ceffbf4fc682ee11a93a699238',
        callback: 'JSON_CALLBACK',
        count: 4
      },
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
  (function printMessage (status='working') {   // default params
    let message = 'ES6';                        // let
    console.log(`${message} is ${status}`);     // template string
  })();
  window.JQ = jQuery;
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

  apiSvc.getInsta()
    .then(function(data) {
      console.log('insta data', data);
      $scope.instagramPhotos = data.data;
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
            delete valObj.policebeat;
            delete valObj.state;
            delete valObj.casenumber;
            memo.push(valObj);
          }
        }
      }
      return memo;
    }, []);
  }

  $scope.qa = [
    {
      Q: "Wtf is this?",
      A: "It's a party - we're getting married the day before at City Hall so \
       don't expect an aisle and vows, but do expect food and drinks and \
       possibly even some floral arrangements."
    },
    {
      Q: "Okay, whatever, when is this thing?",
      A: "October 8th, 2016"
    },
    {
      Q: "Where is it?",
      A: "Starline Social Club in Oakland, CA."
    },
    {
      Q: "Wait it's in Oakland? Am I gonna get mugged?",
      A: "¯\\_(ツ)_/¯"
    },
    {
      Q: "Okay. Where can I stay?",
      A: "We've booked a block of rooms at SOMEWHERE FILL IN, which is one of \
      nicer hotels in Oakland. If you don't want to stay there, check out Airbnb \
      or stay in San Francisco, or whatever you do you."
    },
    {
      Q: "What should I wear?",
      A: "Something that looks nice and probably not white, but if you have a \
      really fly white thing you want to wear that's cool nbd."
    },
    {
      Q: "Where can I find your registry?",
      A: "You can't because we don't have one! Showing up and hanging out with \
      even though our social anxiety precludes an actual wedding is gift enough."
    },
    {
      Q: "Are you sending paper invites?",
      A: "Only to our grandmas."
    }
  ]

}])
.directive('crimeDir', [function() {
  return {
    link: function(scope, elem, attrs) {

    }
  }
}]);
