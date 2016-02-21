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
    //must be done with your dev tools console popped into a separate window on small screens
    var expression = /"(.*)"/;
    var x = document.getElementsByClassName('RY3tic');// jshint ignore:line
    var urlArray = [];
    for (var i = 0; i < x.length; i++) {
      urlArray.push(x[i].style.backgroundImage.match(expression)[1]);
    }
    //then hit command v to assign to a large obj
    copy(urlArray);// jshint ignore:line
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

  $scope.launchHelen = function() {
     $scope.$broadcast('launchHelen');
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
        "the very least, our emails. You can also email kateandmikelol@gmail.com, ",
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
              valObj.datetime = valObj.datetime.replace(apiSvc.crimeDateRange, octoberEnd);
              valObj.datetime = new Date(valObj.datetime);
              delete valObj.policebeat;
              delete valObj.state;
              delete valObj.casenumber;
              memo.push(valObj);
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
          title: 'sat october 1 - thurs october 6',
          description: ['kate\'s playing hooky from work and wants to hang out. ',
                        'general agenda for the week is some spa-like things, ',
                        'drinking wine in sonoma, hanging out with dogs, maybe getting a ',
                        'piercing. just normal stuff'
                        ].join('')
        },
        {
          image: './images/prawn-toasts-sketch.jpg',
          title: 'fri october 7, afternoonish',
          description: ['going down to sf city hall to make it legal. we are trying ',
                        'to keep this portion of the celebration as low-key as possible. ',
                        'sf city hall is stunning so people are more than welcome to come ',
                        'hang out, snap some pics, etc. but the ceremony itself ',
                        'will be about 30 seconds long and just us and our witness. ',
                        'after the cerermony we\'ll head over to a nearby bar, ',
                        'have a cheeky drink, then hop on bart to get back to oakland.'
                        ].join('')
        },
        {
          image: './images/chinese-broccoli-sketch.jpg',
          title: 'fri october 7, eveningish',
          description: 'a rehearsal dinner of sorts at the finest restaurant in oakland.'
        },
        {
          image: './images/golden-steamed-sponge-sketch.jpg',
          title: 'sat october 8, daytime',
          description: ['enjoy all the beauty oakland has to offer - by yourself. ',
                        'if you are feeling particularly ambitious, saturday would ',
                        'be a great day to take a drive up to napa or sonoma, and ',
                        'taste some wines, or check out the golden gate bridge, or ',
                        'idk, go to alcatraz or something. go, have a nice day, just ',
                        'be ready to party by 6pm.'
                        ].join('')

        },
        {
          image: './images/jelly-sketch.jpg',
          title: 'october 8th, 6pm',
          description: 'the most weddingy event all weekend.',
          cocktail: '6pm: cocktail hour',
          dinner: '7pm: dinner hour',
          party: '8pm - 11pm: party hours',
          afterparty: '11pm - 2am: afterparty hours'
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
      scope.helenArray = [
        "https://lh3.googleusercontent.com/I4kzcaLrnuO8mjVTVUNoNV9U2OWb-bb5hPxT0P3kvmM-X7d1V1cr7RSczOnVcOiS50JISPf_jCBIUlEToxA9Vh4Bgyz3jcWzI7xg5pIdP_DeTJOnpYv9sOaaB2GGcS5NarRDBtjYFYZFF4RM7E3lQA9G0uU0TLnBCNmcRtN7h_0yNEuCpmzKzsQL2LNuJz5TQ4CR34O_DaVSKi5_YF2IMCsS0MZrU8kB-pURwQNvS4MBq1z7Uro0xGkPlJL3ibeqMIYROFH_EY1Np5XhEQRWkG68zxMiLplx-pyCJa-6SkQqivbHt6s8SWoOcZUDBTsj0z3a7KrDpje4Si7A7KHU-AbtHUicjebEUn_wwBYAY6TcWd5OZmqf115TDE6Rd6lVpUrgYxVxTcSN_hR_t4iuJhgpBt_5CGJZ6Bo9EWdbeyngWkj5aemgX6n2MRBJ4aJcD0ZHOlCTjqdhxiHVB5evHLgt6LDsy4Nbv0b__128-Dt7VZihCbm15wODmSuAE0sdXBbZeul0caaY4yK0PVGpAsN_AieAAjqPt07P9OzfD--iCwGTLTrbzyRzJtK4T-iRVpDx=w334-h335-no",
        "https://lh3.googleusercontent.com/ydoV_ZnKRJjybBsdu8VMCCE1pUMve1OPd_OeJBhVN9bBz1h7EL5NN5Ra-LNX_YliW8y8pSJYqVupwn1BVMpXEVmMP7C1xc8-JVi5dTkPZbOTAj3pVyswrVXUJCBc6wTJTwf35-0YUpkGYobvNfQ8Spf15xGdSrjXYRKjNwaCuMVL8NThSUeoOfNKYAk6uljX_2Kbmtwdrz2CtGGAx4V1XPVMLQNGCY79yzFMPHrjD7TE2hhuu8GVtENSATLhZedcLvEsMe5gfFvdMgyYZaQeE41kBJbqr8aDwu-sDtPXUPqPb1cnLRql07HYfBh-zLWGdPeWg8wjI_NW4pbJr7D1EBq-ANt_Jn6JNQ3clLiQanm0lExRW5u3uMlbJLRSsPOK74avR9CmzKoiC50pS8RGbIcuLLJKC-CA8Q-Sbu9it79ZJqigydP2Q4s6TulBLnpA6p_-FUGHMAfc8PzOOWpK6NfUZ-nP-BEHDZTIbJvzU6nXDH9LaB-CJ5D0DJWbnhjrAIFoWrEZ1kK_mLht_1DBmsJqMsaqAjKxs4taM2ZP1rq05my-91B3lo0w4qLIN5usqLly=w356-h335-no",
        "https://lh3.googleusercontent.com/SQX7BFkDlu2V64CcMTb57NBhC-c4rzkqgNsF9X1ctx9h0IdnRHjIr-IDqen1LDF-2boQRxdGqIG5IVh5iNsr71fgSFOILgNcfkxWldcaWfTdHy81kdBTMmSa9ViCmQaz8SilyZxinzOyEsZYSJl_yZlVtm-zDbKyZJAsBQRTQqNQq9C-csY8ADQmFHe1qRy8cp_DuNV5a4sOfJVtIqme7T0N_F1gRLcQofnaRAQBLAMR8Io7zfFe3ercmm2KnZqhHK-Gw5IzYUQxjKBlq5eE_t1J9j-sX4rk9Np4qTpE8Vs-zLhHnLpp9lQQ-1Ftlts0Ij3tBHK4FXMdxb1nmh4rWVGobY7Wk2p1F7DqRgo7qCgaOd5rryHj5uv_V1Z8qUR3sfjyfUX0Nmp5V-0CWI4DheEQgjvCSVWgvlt51z6HAwlZCgXv0yt8VA2UtZclRBUKxS5VNT1t-KLy9lf3nWzFin-Cut5GaFrzSEJeUUY4YnvckR29iR7QlnV7Y45NJ34BOdISwHv4RrjawvrwpytvyOz18afghFXUD5gxwurieHMLpJqvHkRE0Zk_lS2eNX7U_ebH=w355-h335-no",
        "https://lh3.googleusercontent.com/eA4GES1VIUQ0a1Ii1MN1LOyrgBWuyZrkcF8I7LBKTbShrwwroCQnwodhhwwJK1du61_ZMRwIc50Qi0SLPtDN2RSS19GNj5iUtenLxJr1dZG5VsS3mYlmaU4W6wOR--LV1raqefUm1eSZFZQPgqJaaVdV2SNCCM4OEfswZE7I9HdIJe64yt3F6zp-NrbLu5Zfl7bO-hxDivIr3IjqbiFipup1tAT94-J5AFX4aVF62UWgbtQRAXGP0xLam9FXlJqUifG7TJb-gNPIck7xJ0_KvhmjoJSlMUE3RI5mnvoxezTfm3f5G4AFl1iBKgslrZkR7QAfgu0oqzF5chsttDz8MOCg372wiHBi1N8UEb0OTJsYqflEms3gjexUspQjPMKKrWEVcqnzpqifpFvAzWbNVrXoxdBpDClkGYP1DyX7OtdupGWT8B4pxPmap3Oemzd51uYL_BY8STc3Ly6lxfd9yuzTlg-6MUgz1lNOpOf5jnJdJFAuGMEzZicpi5zeNH08BMmjfF86TKay-q0K3UYB3HWkKXYk4rNlrIGVJE_ASWk1nc3Y6RQ2SRrYGGIEUN3ZS52H=s335-no",
        "https://lh3.googleusercontent.com/73hPgvncujNBxA3SDXd9RXZUgFZJlMZonmy4d1REAWoIcEQGLVvGEzMBLmE6hk_9vYXgz-v3uKVaN7OTqj4hm4xgFcIjRAeLZrv8PpTyCBPx3CRp9EAYF10CWa5fJL0WHZ45NTDDBu7oFvyM-h4E6O8yt0e1ZFjqQFd55NXnEqxtdhjVDrFZc90G4Qk_tfRfHQZFnRp0FLLWoZG9IvL18vLjmYX2u5Kpwwy_btjqTexB2fZA4ZelrQqwrOl1P0LzVIm9elZ6gLaL2uMgvqaJRHj4vZPEjvgCEK5ISrLcjLfINqkSUXYz0DqyIC8NREMPQUIgTLfKTWAi32hZJY_g25ytaufEb2g3-W62gN2PQEAQfXCoVxxtPRr0FLVWIE-kKn1wAURrzrYZa2Eq_ETvFhISM-O4vAw8iJMrXfZ0vnTojX_wFo9YojX0CVOKYLX7t8mJckd8-_ydpa4Ik8mZf0Pr6pQ235bmMu0SYYXTLYeGIHes79l956MeQ4L4waGU9R714mhZNi88PrUJ6GdM6fdFZXniv4SRKV_awA1F7uAP1-_q1ErAGlonua9xD3mbVyIV=w344-h314-no",
        "https://lh3.googleusercontent.com/CXEEnQ7UcVX4gVESHc4ESlmAGaEvZRnuSWxBX1kbCcNzvkS9i9-ibjTfZeFNtYgWPThQ8HHqFRh96UYGO88zDTKqJhF9omIq-3zA3kOoBQCQrXJTshcDd5tilPmgCw872iQGiR_TxZZO8_guVA3FpUxHM_IQrHp304DtlJK4zYFpgplVmYNCD2gPyTFcRTZmCAZls68dwV7romz-a-4laGzpJ0lF8x7gJ7PyBvnFa8ZPxqA5ZuBKcBjqk-MQILI6F_RlSM36WmP3qy5spk8bfEQ276cowUXOwUzovbRjoFDABr3GhKK3Ay5XIumz2vjiDbSkTEV13xlJ88QXftByT7mM1GXWQ0Ecm3k44z6A0j3ZO_GC6r6JcyjMmIWtOIaXw7i_IB2Sm3IAAP8NmoAR2KbHGx5omGZJArWXO6-McfF4s45BGTDxeTIHUxgYPZUgMQrQYO0agCFXj3vtFhhbIFWsuEFNx9jH5mm-130PNWnvl7PVXSf3t7ZISbAqy8sK3Tz1tdRfkkF01Sl1xCg-E9VjGZakBARAYS7FdbXTEOn5yR1fUwZ02CBD-Mizkv4MthWT=w355-h314-no",
        "https://lh3.googleusercontent.com/uBpkBweza5PVTEWrcYuy08eE7_z6Ds5tQpW2-on1afTi-kPv0kd2hm0_ejVAyblUJUt1-xqSs41KxWeD8A3lZkKktJIhpNJy_eofoELHxE7jowRkBJsLx7SWyH8354Woc_GoYY2mA_kzuEV_BoMjGQL7NK1OJbyOKlqKGs1JV5gn1xq_IeX3ATxJc5mVCShtI8yB7JUpctsa_zBRhMrfFh_MGzOZOvqDLbNsAS7yxVpAkEchzK7MGbdrDnd763-gKFIPsE7ZtNFtPUnOBrd_O7okRXGFS_F_W99WUsK6OxqBsGR-1u7hJpFJkmiY5laUZzxFrgsDo6AETORZmfTcuGH3sZCbXhGhInF2hTsYrKKaYXF6aGaZbpjcvzI-NwOWni5nVXLc-SOkyvdqshoXP7alWcByECwefzH9ENR7OuddlMt7UbRH5ZlFtr5KtxMP1PVJ6Lqq6wbYdc-uhptKCbY_iD3Y6Heq2MjImLvZIxfEZRvstREEMnabPxkv39d_h4r-uzt6zKB9JKJiAWa3VEtK0VAFkdwJ-73blbGQ4NIMRE7bV2nqdXxk7jtf7l11uJ5E=w335-h314-no",
        "https://lh3.googleusercontent.com/qd_fzwguBbbSUyg2dwnN3LyqbSlwpTTfy92sDcMueHTpG2N5Unx2XWyIiLMFyeu6IaTHcDVaW6EmwBex3hjhIidyjLroMXQ_3y634Pn8NA09z5wMV7z8DMn8Il0GZ4UDnDBlnyjp-q7AnNKWXv5F0HPTBdSh8rkIyANNWIIwATvN880bF29PlRJgvnUnS20gAhAwmIKN2ZDGqBBqD-ul9JrcKDKV95x7igAodV3ooLIMPgHOTbp0vR_sP9bA0-NgdrCjfwdsByA0Risjfu-eFgekRki8Mlab_mSmIfB2b9NiWBsF3Q4o2SXV_XMX7EsCJCR4C0AjWJeqoYfJHzFQbNhx5RRNFRgE08vWkEUs4ZQGwf70E3oSUp9gYuoo7IAyx7vVhZF2GSEdoP7PlTkCGqhV_wYA42C7RbD7IxjKpPBUzs7Q075_FwBwQWkIcRt76di0mrMEp0N1mNQmpYt3u40blNqu4G35EsGoMS2MedGX9wYIHm7u6L2LJYyRj0d011moUhR2ix46IT-BWJTTpe9MK7Pk1ZrnPIBj1V1Hbj4tZRmBYBUMQY1Q59ov1iteFr2J=w346-h314-no",
        "https://lh3.googleusercontent.com/H-zxZG4xpg7Vllah4HNTk36w6Xl1RRHRj99B1ghJVRjN4Bg0NsChQQyzO-6TvXmOzxMGbD2OC9TlW_6hZfEi65mdcH0akNTiTVAcCUUu5-Ecu7uw06rp9Y9CYA0fUvrCTqo8FMKSUT6cIJuBQ3-HGIIq4ohURvaRnsJAMydKMwuo-bN4bv3oP8H8LFqbEIiMWp5amuI-Ipb0QWtPwvqPrMglS7-p2LBa_z4LgBoM5EIYDCtK_EjZZxoLyS_5vhFB6JAS0MG_hovlyZS2ElkWnm7PQlTu6G3LfYuH02t1EHOMnwU57aJr7nuW1AwL0jAoOs9av6eeAzU0JKIGIiGD5J2HN8X77E9afWkS3W97wI_4rL4UjF4LEnQknrp_ehwXKXfZDss-r6xi75DF_9B5yD3oBnt9mQOBy5Ws7K6ih2KUK2hL38D5hCIzsV4ooXjQEncgII0XCJhzpwWSKu_qrmoRvUYy1A381kybhHUxXkkQZUWnvXt8fjskjvJKEw_JevguYAsS3h0RLzLmHeGjVJO_Y4m0cw3Zc9QMQYWvDczaPGe_Kj4Z0s0yF3qP2rI7bKMA=w341-h328-no",
        "https://lh3.googleusercontent.com/EFWuY2J6HwMa8T0o2UuW1--AXUHVN_7e2C8JjuBgtBL2nkSoLhPtMr_646g-_XcOqS1S18xEb6iDmOaZLqoMJ79O0oXgj0bTjigUzwO_b55_i3hkkaV0U62NSM9E4oIfmAPpKbcTM_4sYCeighQUnNgmG8ZyGlr8-rDt3ultBEAOXfYQg0dbtEVvdh6QMWpaFCx4a6Koneer9P8yQwKDY2D0pFNuzLH761juFSDRAbzfccsK4ZOzSfs77yK9IR6h_q23LJHVFf8w8RnxPMzdv_2bn5VBSU2RsehKFKDnxD-lTen57prqhN4CldjNngRxU2Jt9_CQcxoxfUPlzImr5CpmhzRnAbOwAtvti3LcXW6N1TN3SLqiVTgZmg0zcpbY0rg-Cw0IqmAZxix65EIJy6XjJlcRJ4uyzEGxbgzNStNd4bSoGOP9gSOwjYxMen_uGkZaRbq6msGca5kUqIf2h_MMHmLZUGIpNoQNwClmhGwFyOzjtHACPB-lQLCyi8QXDSltrc7P1En8cB2WNMl21C8ER8JnCfxrhGmZ7KP8jlxJXmc_BNcJkWvlwNa5SO_0fwg9=w339-h328-no",
        "https://lh3.googleusercontent.com/10xR_QdQSJmX18d2Nsx92PyuqKqrL4ZRjsecpPU4wjgBIVmDj9N4KZCvEJzlYyft5X7A1K4X7BqQs-2qpCkqG3oImMcH2H1e8cD1y2W2Mp4ARidJ62u46PcB-DjUMaEBnxIRQXM71fougnTrHurIJYvEbyJYm0YDVUsrvfN-moZDd_mNOPzuQRWjm_MC40_oHowQ3x_YxhL-qQzfD0jI6FUcLj6TkRlUx6fQI-AC8RQ6tpIe4na-B2PkvNN6xJLETIqQggZyDONaFLGN7roJEu8hFPH26XX7_wIdmBMoBy7HvacP_SZgj7Vi-EzJJdsChnj3Q2fu_XQGqqC9DbPtkhoC6tyd0RDO_te_ryK5bOn3_9BjmQPstiK23xBupPNkJVgLTz69BXP5Lx-NsHRwoFwODlk8Kz7syo4VIEEGaQQ_8vlo6wVBH4DTmsrb8CSjUAu9sx8LcKniXxhAKdYuvE8WGS1p4nPJnOw7x5xe3NYMQcMRzwVAUQ2EUe03BjAEz0scxyhSX_X6DHK72mG_XNfIyOiiRtfCeDbKm3x9O2PXBDB7ij3CJNHmfBu92SOzZeVn=w349-h328-no",
        "https://lh3.googleusercontent.com/dfq8VISKVyn9Woi00Z9ziZXHmY6H3bbE59-AXE3CwZcYNDO93RaHeQ85MX5MsNz3hYxBGYGb8zMEUDYx3g1BswTWkz4A6W4ctwEfmPDT8Ty5E_ZK4eUHD5eJR08a1E4K4xhj3ijr8fL-IcVBGMDPE3uFACvGjEz4R-Ravl-kQAkHEy5PuOQ8jkGxBIqzmHcQQjuK8uw3QGgV7ewTJk2XxBie384onqGHjl5rJroQFhKQZayDL2HorXPxhT72dGHgot-TVHThDyAgRWjQ5RcDGdEVN_4b2EQetLytfK5wWkBwJcpzG5e9-tnCnK7rPIWL5Jb9ObX7g5CzOzUxOTGW1760cA_rem6ecAlxafMNIBq20i2XClZFrDj2lMIby3ulNQ8Qiaz56lz-9-oeTdKIXuO-2vYcAhJAJewA2h9xis7dZZd3MarN4ycbtAv8KH_NPgK_MYqBMc2Ko8SdJIW_hwiSueWJjmybtq-7jjB3VBooHNe9nOmGtfqvaK_NTBHmosLGtQAcuRtD70HVVDY6DquM-68uF_SPhHz3WEs91o5KaZnAZYyy7zvfAEyofTAh-XU0=w351-h328-no",
        "https://lh3.googleusercontent.com/mmaAGxenOjjhxV3bhV8RnBvcOgRiEoLnblwSTQxV6T0OJBMlae0AZivr97P5IQzA5dNi8ojCl4o73KlP8N3CBB7DLJ2X13P627h0U8H4RIAQeqaOchLufKE8Bhv2-1_lZ2XIwTT3DSwwRKREoWA6309XlgLg60evIvDwevTnkulpFoWmHAZKcItDmVSPXpnqdY8uT2ah6NAnZy_bIirCwIVddbyGyYy1xJJynZ34_cVgxL-nxGw0blqoB9tEdiZEzjJxwvLvuR4pDLL6iCmetaq2_WFO__9av1jQNqkpXPhG-g7ZYww2Zg2tlXEj4DrYrw2o1KMmc-npdpkcgKmY4t_B0TMNqW9WGfzURLDyjxtVYVprH4ry2ZYlJaLKZMhbHqt4mVqJ79DQoA3JMDNWH2om60YK0q8iLMrAQgE3d2ZEnVvGD4ncK2CDxMY3xlPMjW4F4voSM2rwIxJhpUdNs224woJjKiBLS6JuzU-vnEwRXQ6uaK_j8vq_V0sE38BoebiUk3vZYW9WJV9JXcL1afReqIWaD7OI6hRX-estM5JvtMYtjuMsjCZTo7c7cHowIhya=w344-h323-no",
        "https://lh3.googleusercontent.com/WgvswmfrgEIeaVAHe5Rk8GHb5nz1zDLJ6F87VDS9dWhBoRnIXYukQNrTYaF_Ud3ibNPVDQ_HJSW0GObEjv4H6DuSZBfYynZDbv-r433hhGDS6vmOLIwiLUOozCWsAdG2ff7gVDbaj8xWFwUrcAkKoVhFiORUT7Tz48LXxB0r8ESr8D7qVFEtejyA66FbBWsBpibNuraD_vpFzGWgbXzwe4r2mkK5OhB1ANnG7M6TUQO4bOPv8a31xRCEEUn8_asge5ohGMLwa4_l9DzBXPpP_6_GbiZsDxXbtCrnWouz9r40TyKNczvF7ALOYN_8xjGZZIRMtKPlnLbJtzoNIEGIV1xnbbxHy548Lppeg8UUW7GOu71ogpSNKvv_kBVdGN8j5stjRwxMmbpYSlb6s5bKk5iZgJow4kIcmNB1kFuj5ezdzDNzeYT2rxoG1L4-0s_moLFnFHZjA6evCfM8WPJQAOP5qS5qjXbNXmiCLA4R8evaiPxMe8uzJ0CCNEvsokzNdcyHRv39WylABUd1kgBrNbU5BkvLhT5kMQCqKvv-5twADC6haUfPPuhsO7dk86t6kEjA=w382-h323-no",
        "https://lh3.googleusercontent.com/QJmdSLeg3aUeLiV0DhW-DMT8-GGpOpKWDXp5sCfyku03faP2zDbcehRf-ZvQ3Yxro5Iu9C8w8kTv9Q3CPaRGxq_zX_1xqsuJNj2xPHjL0GaM2z_eeldoT3BtosyzkbSvGKCDhb2fWI9IQX4RFA2JUr1YlPcAZQUB6lCeZ1Jmsouj-GwVk1owi31XYFpfZi6EAKiIx2B98o5ZsU84OfLpnFayZkJB8unmKzHrzIbcCh0IRXx-fzWV7MMziv-CqSRc8BFkXZjcng1Ussbp5DADi_Xl3rsD8NS29sXzc8goDko2ldgR-ksNnxn8bA8FgZuZ3oJsnndMgS1eiGQQbatxr7uvEmUKFkDkih00btAxGAAeWrsPX5xMsXlxRKqlImI-gE-ARFKVebf8dZUhBpl-YqZnpt_Xls34NzfQl_dRvhUSwDzMDSbz9xE5uuBR8RHf5_BZ5FRWRBnc8-vF5AYym8IPdhJZbQFPVU-h434qur9Ftl15JTDnc8DZcjE6iEIh09oVUAP2iDNPsiws2OTzPasshvVC2a51e4ajzS039HtIhdcQBGOeUbEtntcssuWRDKf-=w322-h323-no",
        "https://lh3.googleusercontent.com/plWXDJ3dymY_7avHqGWaPO8c_krxdsUjZhCp6QbJRZYbQkzBQJ_rJfIyf-pqXww0E44UCrfh2Eha_Q_c5wqcLVbIlG4W5LpCJ_SrRdIdqXA-PiWe-cm4apxKxEwHp1-mEULHJ8DGH9rB3oJhNTQWn0o0WfgKG6OFLN-lyfxGDmwwSMJ3bvs1HW1Lbaw_DR0ZlgziDVG4m8ElLlxU15SNy6ltqQHc3iXtapRuY7NUNgaKfqo-MX4N1kIjyOO55TjTk8JNNlQeqSkgRGf0DKCJ9l-Mt4tWqZOxnXQz8xv1qlKM43AO3skmwcDZ3jwJ5lRtLDY5Sl2CavEpRMqXvSp7QhcDWf91OFTNXlTNjVJiCIFoFt5wpjmLF9Pc2Rbkx0a25kxb27zjPhEM_7z--op_pwxH0e_TDlfenByvIlkXmxNA4f-ZhxtugZS3h4gtfWjGAimZ14TYvA2vXZ0rc98eTpGA81nbSnjnlSD1p5zWMh6TWgnK4mb-IIziJPhXFUQjhVL0kKuDpoDkQgDdso4EupOnVGZmyLoIVy_2NaXy3_3FKX3S4K8f7kfNukPPWTJ6EKC4=w332-h323-no"
      ];

      var len = scope.helenArray.length;
      var randomNum = Math.floor(Math.random() * len);
      scope.randomPic = scope.helenArray[randomNum];
      scope.prevPic = scope.randomPic;

      scope.$on('launchHelen', function() {
        scope.anotherHelen();
      });

      scope.anotherHelen = function anotherHelen(prevPic) {
        randomNum = Math.floor(Math.random() * len);
        scope.randomPic = scope.helenArray[randomNum];
        if (scope.randomPic === prevPic) {
          scope.anotherHelen(scope.randomPic);
        }
      };

    }
  };//end return
});
