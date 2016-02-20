'use strict';

module.exports = angular.module('app', []);

angular.module('app', [])
.factory('apiSvc', ['$http', '$q', function($http, $q) {

  // Return public API.
  var octoberStart = /^2015-11/;
  return({
    getInsta: getInsta,
    getCrime: getCrime,
    crimeDescriptionKeys: [
      'VANDALISM', 'STOLEN VEHICLE', 'DISORDERLY CONDUCT', 'ROBBERY', 'BURG - AUTO',
      'BURG - COMMERCIAL', 'BURG - RESIDENTIAL', 'PETTY THEFT', 'WEAPONS', 'NARCOTICS',
      'THEFT', 'BURGLARY-AUTO', 'POSSESS NARCOTIC CONTROLLED SUBSTANCE', 'ARSON'
    ],
    crimeDateRange: octoberStart
  });

  // ---
  // PUBLIC METHODS.
  // ---

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
.controller('mainCtl', ['$scope', '$location', 'apiSvc', function($scope, $location, apiSvc) {
  (function printMessage (status='working') {   // default params
    let message = 'ES6';                        // let
    console.log(`${message} is ${status}`);     // template string
  })();

  apiSvc.getInsta()
    .then(function(data) {
      $scope.instagramPhotos = data.data;
    }, function(err) {
      if (err) {
        console.log('ERR', err);
      }
    });

  var navOffset = jQuery('#main-nav').height();
  console.log(navOffset);
  $scope.scrollTo = function(selector, animateDuration) {
    //Default is to use scroll animation
    if (animateDuration === false) {
      jQuery("body, html").scrollTop(jQuery(selector).offset().top - navOffset);
    } else {
      // Convert string ms into a number else default to 'slow' animation
      animateDuration = ++animateDuration || 'slow';
      jQuery("body, html").animate({scrollTop: jQuery(selector).offset().top - navOffset}, animateDuration);
    }
  };

  //On mobile you cannot do both href and ng-click on an 'a' tag
  //Instead do:
  //a(ng-click="scrollTo('.sections','/account/auto-delivery')")
  $scope.linkScrollTo = function(selector, url, flag, animateDuration) {
    //Change route
    $location.path(url);
    // Flag whether to scroll or not
    if (flag) {
      //Scroll to selector passed in
      $scope.scrollTo(selector, animateDuration);
    }
  };

  $scope.scrollTop = function() {
    jQuery("body, html").animate({scrollTop: jQuery(".angular-div").offset().top}, "slow");
  };

  $scope.qa = [
    {
      Q: "Wtf is this?",
      A: [
        "It's a party - we're getting married the day before at City Hall so ",
        "don't expect an aisle and vows, but do expect food and drinks and ",
        "possibly even some floral arrangements."
      ].join('')
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
      A: [
        "We've booked a block of rooms at SOMEWHERE FILL IN, which is one of the ",
        "nicer hotels in Oakland. If you don't want to stay there, check out Airbnb ",
        "or stay in San Francisco, or whatever you do you. Just whatever you do don't ",
        "confuse the Jack London Inn for The Inn at Jack London."
      ].join('')
    },
    {
      Q: "What should I wear?",
      A: [
        "Something that looks nice and probably not white, but if you have a ",
        "really fly white thing you want to wear that's cool nbd."
      ].join('')
    },
    {
      Q: "Where can I find your registry?",
      A: [
        "You can't because we don't have one! Showing up and hanging out, ",
        "even though our social anxiety precludes an actual wedding, is gift enough."
      ].join('')
    },
    {
      Q: "Are you sending paper invites?",
      A: "Only to our grandmas."
    },
    {
      Q: "Can I bring a craigslist date",
      A: "Ideally, no, but Starline has plenty of space so, if you must, go ahead."
    },
    {
      Q: "Can I eat?",
      A: "Yup. There will be plenty of veg and gluten-free options. There may even be some meat."
    },
    {
      Q: "Can I drink?",
      A: "To your heart's content."
    },
    {
      Q: "Can I smoke?",
      A: "I mean, there's a parking lot, so sure."
    },
    {
      Q: "I have more questions!!!",
      A: [
        "Well, since you're invited to our wedding you likely already have, at ",
        "the very least, or emails. You can also email kateandmikelol@gmail.com, ",
        "which we will be checking as often as we remember it exists."
      ].join('')
    }
  ];

}])
.directive('crimeDir', ['apiSvc', function(apiSvc) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: './crime.html',
    link: function(scope, elem, attrs) {
      var SEN = 37.807082;
      var SEW = -122.266949;
      var NEN = 37.819212;
      var NEW = -122.278830;
      var octoberEnd = '2015-10';

      apiSvc.getCrime()
        .then(function(crimeData) {
          scope.crimeResults = filterCrime(crimeData);
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
                valObj.datetime = new Date(valObj.datetime);
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

      //begin jQuery animate
      var marquee = jQuery('div.marquee'); // jshint ignore:line
      var originalIndent = marquee.width();
      marquee.each(function() {
        var mar = jQuery(this),indent = mar.width(); // jshint ignore:line
        mar.marquee = function() {
          indent--;
          mar.css('text-indent',indent);
        };
        mar.data('interval',setInterval(mar.marquee,1000/90));
      });

    }
  }; //end directive return
}])
.directive('scheduleDir', ['apiSvc', function(apiSvc) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: './schedule.html',
    link: function(scope, elem, attrs) {
      scope.menuImagesAndDescriptions = [
        {
          image: './images/shark-fin-sketch.jpg',
          description: 'text about schedule 1'
        },
        {
          image: './images/prawn-toasts-sketch.jpg',
          description: 'text about schedule 2'
        },
        {
          image: './images/chinese-broccoli-sketch.jpg',
          description: 'text about schedule 3'
        },
        {
          image: './images/golden-steamed-sponge-sketch.jpg',
          description: 'text about schedule 4'
        },
        {
          image: './images/jelly-sketch.jpg',
          description: 'text about schedule 5'
        },
        {
          image: './images/sticky-rice-parcel-sketch.jpg',
          description: 'text about schedule 6'
        },
        {
          image: './images/coconut-tarts-sketch.jpg',
          description: 'text about schedule 7'
        }
      ];


    }
  }; //end directive return

}]);
