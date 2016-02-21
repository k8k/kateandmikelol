'use strict';

module.exports = angular.module('app', []);

angular.module('app', [])
.config(['$httpProvider', function($httpProvider) {
  }
])
.factory('apiSvc', ['$http', '$q', function($http, $q) {

  // Return public API.
  var octoberStart = /^2015-11/;
  return({
    getInsta: getInsta,
    getCrime: getCrime,
    getHelens: getHelens,
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
      method: 'get',
      url: 'http://data.oaklandnet.com/resource/ym6k-rx7a.json',
      params: {},
      data: {}
    });
    return (request.then(handleSuccess, handleError));
  }

  function getInsta() {
    var request = $http({
      method: 'jsonp',
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

  function getHelens() {
    //utility for scraping google photos site (they dont have a public API and currently protect against CORS)
    var expression = /"(.*)"/;
    var x = document.getElementsByClassName('RY3tic');// jshint ignore:line
    var urlHash = {};
    for (var i = 0; i < x.length; i++) {
      urlHash[i] = x[i].style.backgroundImage.match(expression)[1];
    }
    //then hit command v to assign to a large obj
    copy(urlHash);// jshint ignore:line
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
  $scope.showHelenDir = false;

  apiSvc.getInsta()
    .then(function(data) {
      $scope.instagramPhotos = data.data;
    }, function(err) {
      if (err) {
        console.log('ERR', err);
      }
    });

  var navOffset = jQuery('#main-nav').height();// jshint ignore:line
  $scope.scrollTo = function(selector, animateDuration) {
    //Default is to use scroll animation
    if (animateDuration === false) {
      jQuery("body, html").scrollTop(jQuery(selector).offset().top - navOffset);// jshint ignore:line
    } else {
      // Convert string ms into a number else default to 'slow' animation
      animateDuration = ++animateDuration || 'slow';
      jQuery("body, html").animate({scrollTop: jQuery(selector).offset().top - navOffset}, animateDuration);// jshint ignore:line
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
    jQuery("body, html").animate({scrollTop: jQuery(".angular-div").offset().top}, "slow");// jshint ignore:line
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
          title: '10.4 - 10.6',
          description: 'lets hang out'
        },
        {
          image: './images/prawn-toasts-sketch.jpg',
          title: '10.4 - 10.6',
          description: 'text about schedule 2'
        },
        {
          image: './images/chinese-broccoli-sketch.jpg',
          title: '10.4 - 10.6',
          description: 'text about schedule 3'
        },
        {
          image: './images/golden-steamed-sponge-sketch.jpg',
          title: '10.4 - 10.6',
          description: 'text about schedule 4'
        },
        {
          image: './images/jelly-sketch.jpg',
          title: '10.4 - 10.6',
          description: 'text about schedule 5'
        },
        {
          image: './images/sticky-rice-parcel-sketch.jpg',
          title: '10.4 - 10.6',
          description: 'text about schedule 6'
        },
        {
          image: './images/coconut-tarts-sketch.jpg',
          title: '10.4 - 10.6',
          description: 'text about schedule 7'
        }
      ];


    }
  }; //directive return
}])
.directive('shinshinDir', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: './shinshin.html',
    link: function(scope, elem, attrs) {
    }
  };//end return
})
.directive('helenDir', function() {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: './helens.html',
    link: function(scope, elem, attrs) {
      scope.helenHash = {
        "0": "https://lh3.googleusercontent.com/FQzszzqrff132A8DSGDqx9HdVC1QreCgxm3rxwOGLQnhHevLaI5zACAEjGf38KIODpk9RYxFsVXylW4DGp4rLxHJONAyJ5LrUzcV1cFDswg6YjlSQ5H2X56gUkkWgEW-i-3FlNw_mKW22MyCHQcBPPrCkyrcYOuafFC13sDI8WPVCNtz2t1jDqNUHFDFdAX8y7HsknGMISYGazznNsytE6tKHgirwRuI-3yKhDSP3saGcWfbk1S8duXQUKa88XZBJcsovN79NmRlWepnvBjlcyW6PckI2kYfsU6tQp0SDk07sG0tTdUaq6qSqwGV8wuqL4AdOJmA4pWKoBhhUBg8426HbFUUhAeFhziytUIiEWjU9ciaKfAC81UE4g26ufpEnkhTTh9qSNSQpB6mEGaLoTHeY9FTARnYaxFONK6IwEK5XVvXntXG7Lbw5x7YsRUFj6NceX7A7bPutNxwzjMFhXTMVVHY5qO5YyPtr4xzXczM8aiLQpDiNECF-n0n8E1AOKRx9J6cYsMK7YiOggyvXzCywV16RdyJVT_2xpC0aqOkYQ4L5HK6SIrU5Brbibr9GVEH=w233-h310-no",
        "1": "https://lh3.googleusercontent.com/tw1qmUf4O8e9cJA-AT5DzIG5KrsP0r-iCAiU1s7O6vdzyrJc4k1Kd2wsOhgAhudrgudr5ljXHCNI1jiClq4hiDvqNJRVnLdC84zfGARPaGS__locU1K4KBqfvUPCHUaCJRSMrDqOrlvz4DwXuHcQ5WMR4Qc52052RrqRU9xFxdksjONcESX91i0B97UXDDT2PxeIkNBuaBice4p1ftdHy0OE2xznW4KBgTC4LEXzOeOTHiP_ZI4xCg_EFw1Qk3ix5UzPPGlnN4Ezzc0R715s-n-wVe3QgJBPEZGn8GF47VgsXaPPIgtgiOnsdFglyQ3H4TO1od8hOZUsnWzgo_FyD9wABS_2ZytdBNF73zlPUINo7pCsR-2eQKQB2n2uTXHkCOFJZspKW_sulL1zmgoQORJ3mYIv5gdo1ZeFY0UYw2KfEVheGEZDg0UcvPlP9TO1Ihsgt8uDdGLD2c41B9OhqfOWFb41gC2GRq3X2s-d3FAuGt0BQII-zXrFTwBdEIokP_b2xgaRZSLHA8oC-HsXZNWd6CpCJypEj1XvGpP58rSrcrdCl_4_jEtsPwW4VHREU14R=w233-h310-no",
        "2": "https://lh3.googleusercontent.com/YQcKiYsHL2lMY32OgJbeZmFU9Q9amsc11WHTXye2Zxth5sJCCef3tZDw5rKSFOZhEcmfUFkiO7_toqAp-O66PWtKg-1v1-ZwUtHDi-0hmVOyUQIHiszRfzX4oRM3tzPzEj3zo_R2g9hXEnsrYCxxbCMbcL2ieAjg5D3xdKz3O6ROfcfRVNEniE2tuKMWOhy0o9LZW7b-piSoyO-E6BdR_YvxzEr9uXRIqYoYM6CvbLjaKmyz_pSxSuzTzctLDwKYDtp6s4Gv_rk8YC3VmiAVdMBe3px0b_qhnCvM8LNfpKfYUfcTdSsY8ALBcHhhNC7fauxeBZztzqQHIuoTRvaTIHFTxmos_kVmKuz3CUuJRsSCmSEr2BFKkxEX76yvbF2yZ4yMhI09pa8EyiQU8Rfai3cmoM9nLxiPZmzgQ2v4nLogk4gzTlMfNcVNXr9xJwwsKMN15owoV0J9TezwuVcZR6tKDWQs6_B_LTA429NxT2veRz1uBYvumjSr0gLPJ3jZZamyI_Nug4X_6TLjC8aHB-XD0hcIwISehksgtht2Pf7JLF3r1XUhApd6Fxyzg1R44VJj=w233-h310-no",
        "3": "https://lh3.googleusercontent.com/nI65qWe_mxjUfv3slg0o0ZFqei7-18BPKCPcHlSx7bM1vHynrEqQcy1mrkiO81UmGe_zderS2Mikc26kJ4SOlvFjNJxR6XPyIR_B1coNGojqQ8VHP_OSpHdCzOgFzvjqftM0pbWeDWhkckk6AobKv9JVshwORZcPxNwYAuzpO8XNs-nKySQSeNYpVhkRteLGAVypvoFYRmFLr1WChxuixyWSrP510c8K6BjDo2XTeV6U9-5O1ct83TjlUudCu3S2nleNg2X1uZPz9HE0Y1hkz0zR--W47CCX3z_2xLnWWV45a_wu1_OMKSZ6Tx_ydv-0lWJBIBsb14IgORDOoEywlmfN9itvZV5i5k0xIez7XFzi6bmsObJnM1Unt3QQpynIlLJYI16PfKgEUC8sU2l9yg3ed8KJmSEKbQu_nxKIn8eYBo0xprXoLvFIubpMLaEBbJwHKRv-QxtE0acfW_drMfR3rTHnJUi0uTJ6KXEjsDrs-XZ83YI0rMjLjB8-niVcbbqcWLKVLvw7Yb6zXXKORXV-EE-PNDFJbcu6yphuh0P1qaTz-OSzS7RnSaB7qzN25uk1=w233-h310-no",
        "4": "https://lh3.googleusercontent.com/A70oBFSj9_nytfpppsgYRRCuZ0Owa8LZ8rf-IUumtdInlLZBEjhXU_OdNUSEacUQFXy1UJouOFeBc7heOjeXpFvQx8LWL_1DC88tcFvn7lpnV9LhxplNyxnIxT7a4jGzr3RlnutImjQTfq-wqFd81nCWMmj5jU1Neav76ZhqM3rt7-BABmf6l0YJ0TFqKDpniVvRrSN608Q-Q8MCbWJTsimjxI_KcYWxWnRX7DZ2cQwY2uHZOb6SnySpZ7yGzOxtE3IoNBe-QNrZ-53M18gYedjzMh2gTOCHx6UPd40phQI2p0nJVoH0soG4DsaYyDVdEvkpk2Wkd0m79Knia7haID7vhyO4dL7ibIwcY2XpiioFyBW6juzmPpHAi8-SukawduLxYZWR1-6aPAesIkMO8Ym9EojHpMyullihDlnlXc_cpYbFpqi25vyWY5Wd_oZ6npZd6VaU3Qp_GKjOkG62GRgTDxsXB-jlEQF8Ta9DH-Z-cen5aCojumDHCvDxgg9R_f6CUCd0nMwITs86QpoicmUWrYubEeN3KyKJmSL7jqYsD3M9Yr51NRLFU0s-x2k3Czj5=w207-h310-no",
        "5": "https://lh3.googleusercontent.com/9B88jqvsdoP8zTOkAymkq_oDuuBl9Swp_TnHh3nRhIGZ2UUuoa7d5OufqNZNtONik6iwLPN_8QCteIK1ppfxynSScbOoGfi0YApPzuGoAe2B5_pD-2qcx5wa0BKFfQQVLZZbh8y1n68SPFb0o602cpavRQbAULQkbnOn8TPR6hA9Hl-mhmUV2-bcpudpleDWumX4eQ3Q8U81KBaI2HldotZXrl7UMQhQliuvSk4y5uRW-iRWpmm3drYtmZ2WJrNG-VtS5ElZWCsk1m1Gwlrg9G8PXNm1Qim5MUGsuyOYi1k6miYZrDJswQ6GmlFOLW31YiGepSjVBM0LPTQT92M0R0W8yr4rv_BdOXNhB3H1FuYAKNJTf-l1uWu91ZlpwjjeuDUrAwPLSLxROVVfqIr9L4_5N4GzUh-Hh0MdEnoI_JzXTLtZ4naiVQvtRmywwAP1TzPlvYfmrMPx5lrxvlD7gfo-KNtldzihYoZryJLoL6MU4EVQQ3mVbDk2bKgOCeYM-fH2lI1G9dA8dQ91NlzfYuKoVeEns98FR3C0Lq-17JbySXhQrHJr8jiD3gStBBfzTgxS=w233-h310-no",
        "6": "https://lh3.googleusercontent.com/5mNQ69ztZn4eIaXdqTRmrIPoe7Gp2MMwaUFThzsmxtppmRlpxQsfxZY9ics1XpT10kmuP_CnGRVv6ARP9AuKfPbEE_b95N03OnpfovEugF7qpQusgFidaNCTnqzQkvNaCDw9q2AxaDQXCTNgZKsYRDMQDBld3bFtNtob-KTgWIoaPy0Et_b8xFFz-2dRY3YIXsBnEKYLRMJrm6ynpcrWB-rGA0C8YiUblhYLiGwkCOh-zkwLvfVY8-_N7wMCLIDpaqm4qgY40qzhvg8hdWyxenDwFpNL4ezXtDNnQVS8PT5l_wRqnKk1hzhIwLul8_6Pswsrc6HdtpBdqATvq9ola6Bciwspy42X4_M_7d9JRQan7BK0u0H7t8UHIEbpDj0N5HAX3jAETRkWiWKx65CEoaBKYsg2cyOjfUJrlntXlRHzBD6PpxnH3MuzKrahb8CtkA_eTEdqyPGvyQE95H30H1BsLo076h6wy3Jtj0Kuh7NNyP4ngCXutXsOct1nOZ7HGCfBJRILSXWKx6QieSc0jzNW8Dfi7XeOZwBzQFpK-G9LrfvyonkYOQXmUIZ87HJ71ee0=w225-h299-no",
        "7": "https://lh3.googleusercontent.com/GqKlXs9VuDf3v-pypOxiAcZQiUoSPmrzzh2QPV2XNoZi8SGXE3XZWC_8WIgPLXjKDqz1c1n7nST2NPClIYxhjXpMazx8Ttlmv-cwLFXoomDpQJb5c16Xvk0CpUsGUpvP17jc6iOlL8r6cyB-HErnPUiwNKFI6AIZx7iO0rraXjMmgI1cbJOubUiO7mhgAMwNAm4cpzlYTas8EWqxnsXpoig0zu96uxr0uUNQgh6z-9pCVHBY9TuSrILZK6ZcxEHuV49xseAB6ASnbj6vTdwhM_MLlCWVkQHggvjWd5jbMmOoPi-RP9V4EdM5PbefTp-g65krdp7YvnugR1ZlvdHdDkfIx_fc-KHkE3K-nzNrxFzWXQ7uT5pA72nC8h3xqCBf5sCrIu54vRue-c7R2QL85UYevW6otXfbjr5kpOEiWtU6qUsf2Ppl9_BnfwO9sD88u6jcHaV03x1gwbBW1N7Qt_E0DT1g6-pvQkpL4ta6etqcL0yzCG2ipptky9F-3Rt5pnORP8kMIcVf9wJIXDzuMI0qwRes67B1qKmofgYSNwD6jO3g_W_YwLvECzM1ASdtSr9X=w225-h299-no",
        "8": "https://lh3.googleusercontent.com/l6FNPo3yeo5CVv8PWJbY6GPkNLlnPuj1GD0cVvZwqtn5b26G8lqh4LOtfDXgefx5Z8pvble82UL6BCuNXpkjFnUJaJ1NR-sSqjLV3prKEe4WsgX1s28POVHTSQEVO7ogkaxqH0Fkl6I6EZ7Rj9gtCr_4oCshuvgT29PSImHuQrDVi6PhkFymHiMdohBQxMoKlxdmcCBmEQBqt2azlp2t2STFKWSy5rrBU1LKQslzMPmCLp-VKYOSH4njkIq3fNYSv_OJceoX67JyYkdNNVVwqKMjxDEiMTylIcWvcKFquKygq6xa5FhP4GZudAMTA4cpbMn4ibdmHgTiBC3jrLS82n-AdPddEmIg4AhhOg65CStM7T5QIMYGKNg5Cgi66hgywzUlOV7JKnZ5fB87Ffq6tza5g0dwnkvzkVC3ZfOXK3fRUPQGX30xmsavtMC_rbqbz0YNB46K-8k674INyLR2r2S4hwSeHc6ezga4ENrqwPB1ULEia5xjT_k2KnPqzVFCCvtyejyxrv1IppIFaTXTZwalUqknF2XJVhT5Wf-OdSBCYrvT9euLzhjKgDcCmfAyCA49=w300-h299-no",
        "9": "https://lh3.googleusercontent.com/wT8fIi0G2_C8wPIjJ9eA1ezeXSRvj6xzyR6KDw9qA3EcvzFEjEL_CvfPcShl_QkFW6ZGsxDf5K_oT1Hdfxs21tmpOx9ZatwwLsIA5czqg7okIMtY53kfNm7MkanWpSHWfGeC6xhzWpeZE7_4LxfNjQD45jNbATD_7_HqawdzuATa30I_AU3w21wAaSDa3Dj3irt6VSa1hghDynZHZSZD_N9OaYnK1_AklQviRcws0jB5TSoUu60rGUws2DGKP9TVKabEZp11kdc8zSZSSLQJcS_vtqkEcsYM6oEsQyNxmh9y9H3vjN2r-gXskJP1ya5MQDz51MSdqapnYXlPl6n0RFjXODoOxPWP9SWe8H0gDH1RX9iQnEX3CyYQVvs2QdpVHUW3NY2IBsJB-00aDj0zqbdAxmR7Tfo8xxSSG8pP69c6LeJsjc3aatGM7xmQGGgJHTt0Z6ia97lWu9ETMDSirFGVyB_dbfadjU9MGp2rooQAl-8W9Lhbf4e-SQeW-COeUrUCHDlTEphQOOP4hNwHegUSOm64EPcj-SR4up6eyw5JERlM74bVBzAE4WtoY-LYgfQU=w224-h299-no",
        "10": "https://lh3.googleusercontent.com/kt-4KLkW-TRKy0cbCHMJu3Oq1KVgNhaRZhs5VEgzRNZ4QQsVR2m6Bh9_YaDNL5ABlXcOYgmPAH3ki_pYpgGwehkQeBtnD9Usxv7fS5RGl1GpChZXAevyxVFb9Z_4qzTnUPMNOz6aSh6na49cVTAn1NIzfL18N8buIWSmT1dqPB4eBM-gh-m_2CEpmp3iUJqzYjJ5qFFQImrjDtsXSY90NXDDwaaMr7cH4xmNC-zw6rwd7C8g2DreXeRzvtUOVO4KQckMOf_WfRM5L-XVfuFIzfRx4ASm2T8tEOLToSKGHfICcsRNqAHyNblXByqsWeFgXVRvyu_8xMMl3FHWzY2B-Zdo6kpwe2aGv2nQSF7gJVUdcfVrqB34CB-yx4lV3etot1dsntxQvNIx0nvZqfLiDKadG-RW540FJMmtHOJ_JYF5mpj7c1rMFfSOJX0gSZrGmVFdWE-vfCMTTBa-dE_zbzeS4YNHPHBVAzx3_7LM08xfTFoN41C8WYou2dVznAEiCMmrlGnF4LviMy12FqTdk4GgQzr--D7ve1TBhDDVEchaPH0xFmSA8osBqHgSfj9D64QJ=w199-h299-no",
        "11": "https://lh3.googleusercontent.com/bgugZn_W6V5_txF7Ea0485VyL6wcanlwLD0IXS9NFl94aK3rMVhfDoZJ-fVcadkRhFbtcDCSiFo40Wsea5loZ5oSlqcwYH5wyxVrzhjcZMgMHraUZnhFGi2Hx99zD6hlW3fIGuq6cAvlP0n4pTmVohtvfQhNGEg5_0-L8VsIyUTeuDTSUzwwFhgFky7sWZPeVkBdy9qexKy9JG5Y88baBm6dZ9K8WepdudHeBswg60WOJt9tHwBpPe26I_zozLy11ohgL74xofBirz0jXkwEMmS3apgArv1MbzSKSSDRKw9CeyTrQtY9aojtGfciW051FTWQSsj7VYEE_ErukxNqBDu6x_PVQ9lB0ii3Amc4Tgltb88ejC7ZvRlEyl2c_u3Pw4ph9XZC0sAIsj76adjCbk21GAeC9wSnKRVZ5serrwoOU6slI9ldcznkihnYjuiR_ogA0uv0XbDS7OY8HG-8-7MYxSamGk_1rMgv_PsvDHJU4FcfpUb6seCS5NG7dFsTUex5HRXwGNrpccJz4i0GIx46_9h2GYDjDuJ5j6kQMf1BB4RneiTgYqP2FL9s0LXDqmO2=w199-h299-no",
        "12": "https://lh3.googleusercontent.com/X7RlGOJs4A9CtiG4iy6ZUq11RsqDjsymFD_4Qt01givcdBKUdBsaX5x10vL_M_v5cBxS3PPWYQB9U1FvGrhWX9B96xCXDWN-O7B_eS5e4LKUlix5CJJyUNgtz6iMfKoKRTTVxizwtdIwZZRWMyrppbCdBAXWxB66nZ-waBlpp03_IH_WCRRaIWbBWKlRIJIiLLF-x7DwiaaRTQHQL7BeWo6cUm1YS1vIYR1tnVKdDj_Y9tmjdklHLyFKP1auXgjbuDUuARhH30M7f4gGvVECllqtLML_AvZEJQNMjzU7yQUVmaO3IO3o_CEeZ6YC1kqs5BblPCids6yxzCpzMNz0ZkHEC6aLDIsh3uZjlDKRW_Z8tFmFVKDDhcTAa8t_Zj36Hc9NiDepoeAdXOjOpsdYXFCcGHBQ-MVcsTHDpd0Mujj3forKdUi5LwPnaEFl4-SwfnBK7Uva_IFEzTGUOWmCJav7YUIzkx2_DA0R1CVoRijcSJBAzGWT1Gpup9pATUhE0X1CS_qrIauNXZpug7Tv1JfEuC9bk4U83zhGk3vFbvEVmGoqxj3mZptjyHTVGdJRXJax=w238-h316-no",
        "13": "https://lh3.googleusercontent.com/vxCvHn5kV0vkMaHx6uoRmvWT0m5D9KPoyR868xVHl-IXiNNZr4s82G6Cp7oeNgOVB2OS04m5FIzJ8hf7dKgUo8MMrL1wtUFm8bLB4vDan1ElCpEdXWIcBOsCzpS9r4Yap49ig8KC8raYeIpc7jFE_xNlcT_DZKPeu7FXwblMoYUryU7IZjS-Ysq3ceoFSlnkklHSilcw5eO7W5hF4fIbN8z_joSySBpxc8Dpi3f_YZrpLSnMvJUgXB6exAyrYJOf18eK3J0rqbmzSi9zzALElwXJfcw3XtuIJfrahZMEvu5fZ-u2SpdZzVllV4P-5vGZcxcU9nt4Dy97t1TND0aCCj2zf_cgE9NmvlffQ6B4iz978DlP1FffvDprxh8Cd3CUpCritSJjJQBlYtTJMH3wrFyErB_cNI4qet2ChljxWqHkrHorZHMcX4ZSQa9F-KLgJ1U8A2wO9wpwpEFXKOTOm_jZ5KUrqLYC-tvdstFQOfbD7JoUQWYVM9JLQAj66NOljh53weQJ_N6aFnvc-Auu9oFkJCoI3P64hW3RuL7dVM1cstYOX78ske0PBX60HZgGPaT5=w238-h316-no",
        "14": "https://lh3.googleusercontent.com/RuBj7ZQuLywBNKV7T_KeoGCSIMC8qm6Prs3yK1ks6hBxyCQclS-FEQRV_oMD611g0ixpLiFZ0aBxzwPAEG37_SoLhGjWFozzJf9N_0w6MHcGCj27pCdc-6N0ZGMKLtlCpWOn6rApvKtFRf73gdj5qQM0-gDOkRSFWNjWjRYg8xFVQUim5ZzNRbCqeFRfdX0jJQOwien4jsu64-6vK4G8V0L_gz4gQRHol3VKn8nJxtbgpijKjKFx-o7VFjw5bgDAIL4dbCXA7YoI1lVK28522zDOLwsPmy5G1Zx8Wc0wrGDyH8EdEzjiJVYXh96YLU8Y2cy4JjPrYeGxMD_HhVKqiinJhUP2v-I0Bd5qc3BencsmuGG4RmPlUejBw3wEQAO1WS2Hz39WNM0Hknc6cU5gEuPug1vjXbkes7SPHRAvTB-5LM8veBwEmu6-C7-G-YwKPWduJ4l7lHsBkd7ZyLbmXPYMG1xQU_taoFqctqCcZ7xPVXYWaMUtjYbx0nKlqlt1hmgt5CrCnD3Qti9qhMitUZ_oi3-g2qILu-S7hGSlblvroEhDrYZbwdobINT8beaROdz8=w237-h316-no",
        "15": "https://lh3.googleusercontent.com/uEMYTfYvYAENNW5lOnBhYEnYhFmYHb5mlaz-5X4EmSZtQtXdGNo51htKM1Q00PKTrG9kh2eIv8BiF6ziFwZZUktpjTI7h7qydiVeCm4RmFw8n2RKA_SEkPn5YhF-e7NcsmmBFIMGsEJzBQE3rkh91-lQ_5D5NVe5lb_abxe5R7a2beGu53h2LIIBCbXgJdRyH6rYRhEqoehQ3ptIv_Hvo48EYn5LK6QNDrxyBWu6PDGszEhNvIIWTlM0wb1m_2qPtniM2Bhq9Oqp_aRavb0A5BhzowXW34ftOZLJiRKxZ0H90LQoBSInDEYVmyRBf_o5RdG0QHb9YQGCTHzbPKf305ATAphGHwr3BWwXy0E0xEsT4VH0yD7SGoi47B0AepOSgzvPZEq6ZPT6-cOzgC5Jm86lbQK_pU-xbm5xThCY04Ere8HGcO9ZV2UoC8xIUIjeB6xfBN6LhQHN3DCb8fcrinKrtas8i9LCJa8wSerqkno0F0sBpb4Zl779fXgJvEhTOxBjukbsNDSSmGxnWLW1LU6ZH3j5S_mWCHMCJ6EkWj1T4PHppr8ZDt3nUkTPZkYnQ0TZ=w237-h316-no",
        "16": "https://lh3.googleusercontent.com/xKs1prxa-OFk84P5Oq7KYdz6txbgTMHGEFTKQJmEheA9MGfPrY6Xo-uG5cY2XEA_WgD_VH6L-2eaCVUMfqnKZMPdNgJRbEwMrqksl93H-EHhiIpSAchWdDe3dVWX39Wsn5EX8t19n-JVkf9a-fif7n9BouCUr2fQe3WRlQQvbaDE8mcKfup7Ds1zsq0UzVL_4MgWLLlnPTFmjR5o5o49tQNO75GBth92gGdViEUAz_O6922rqQ6H5JS4gT_ltQ9Akt2MkMrGFBApfZ1EIL-3nvHlJ3yDzJVJBsCqKqUyPVkO14r4gYMQZPIFh2zsq897sk2ASgCxWkd-VmQjVHQG7eoYhOoRRSfZcRUwCIYh_AnnY5TA48H8V1vAXAfBXhq_ULXiWVOfGdEFfrUbxQmsF8w1jG-ShWFRu-bQCwzFxmCmvXXpiFZTJBeJ6M1eJdIMLldPHRq4dPgIjdEHWjx4Px9xnz-ix7q8RpfEUQ2fjDqjF37O07eyjQboXwY5m0qKYU10CnwiFJQxwoqnyERdhSEZh_vneVmrVIrboszb3_GTnWaI7XEA-1YgWQ1Er24LnLFF=w211-h316-no",
        "17": "https://lh3.googleusercontent.com/tU6vUzeN7o5zhKxZMm8uThNenwjuPMUFbQ5udkTDt6qDqvsxN_7sH-UmGH9jT48u_3hjkc2kvitoCGD5ljdTUguV_eQ1_ifGHqaXVvKe9-sfsATiUfDXyHp_i2iAuS61mA9VHJ5qp9ao69pDhvxqSzURXACxo8PohC3KvChSy3iKbMEctChPOx4zgV60LX-uFAlxvA8K8zMA9VCldFs94_QPfAHlWenu9FcOn7BTEY_pxyYbrzxO0LIeU4nqzqWchqwMrjy4LIhUdMMJjHtRXb9ydKCH5GnaytX9jznxS3MuVl0yc4V-ydIsJt-y9clLPQzePWa27umIY0OXpZjOSy1ubxz3cWEXhhwtDE76pSCIXx6jGguNujgq3xahf5f9fGz6htzPL2rHb3qSX1MGnXbiEcqyPeFDQNWpH_CyYO6_-ZsetBJAV5Ar-c-ePr5KSF12H2I2NtrHE3fnwPvw3cg53AMg4BKXQa1NRA180M8uDIKtcMpe4gbETyEbPPjg4rAylMdFuSDa8DhU94_jz2I8kKdoNVZOdNZ9H7LNSGNhpJSFLeoPJ44TIgHkGTbPo2Bh=w211-h316-no"
      };

      var len = Object.keys(scope.helenHash).length;
      var randomNum = Math.floor((Math.random() * len) + 1);

      scope.randomPic = scope.helenHash[''+randomNum];
    }
  };//end return
});
