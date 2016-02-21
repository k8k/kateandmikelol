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
          title: 'sat october 1 - thurs october 6',
          description: 'kates playing hooky from work - hmu if you wanna hang out.'
        },
        {
          image: './images/prawn-toasts-sketch.jpg',
          title: 'fri october 7, afternoonish',
          description: 'going down to sf city hall to make it legal'
        },
        {
          image: './images/chinese-broccoli-sketch.jpg',
          title: 'fri october 7, eveningish',
          description: 'a rehearsal dinner of sorts at the finest restaurant in oakland'
        },
        {
          image: './images/golden-steamed-sponge-sketch.jpg',
          title: 'sat october 8, daytime',
          description: ['enjoy all the beauty oakland has to offer - by yourself. ',
                        'if you are feeling particularly ambitious, saturday would ',
                        'be a great day to take a drive up to napa or sonoma, and ',
                        'taste some wines, or check out the golden gate bridge, or ',
                        'idk, go to alcatraz or something. go, have a nice day, just be',
                        'ready to party by 6pm.'
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
        "https://lh3.googleusercontent.com/mbQ8pl02R0pS6YTUc9cDwppAdxwBqi4n54_ykq0SaF9p3Mv5d0jnamIGGxTs6zJTp_LC31gN9AU5GqtQTiD1qyNH0jN93YuWt1_mxBJv9LmJ1QJCXy-B4B3jIcRIASri1NOavYhK7t6IQ0L8x_qK8Bn4flriwkIVFAE7zelEQh9Mrcb-AOvj3aCMyX909PtFw7dP4o4nxK7SJtQzYE44Ax-t2wPdwPhWxFgfMvUAbRpCU9A1iGGJpxgkJ0h-KpG1QnQXrGEX_bzRaIFNDEKWI3JoN59kH8AB3BL5PNmDCzD3yxv3UoL5lTWubOEdS9mqg5AazcB6kW7Sdb9Do2Pbr_jvbDT-JC4HI6kENIv98K8cv9IEE7yKwV-zHd8brUU8URd574yIX3aTGrDc8ud7RQ_Kwmj47aCCVEGtSSRPq0XkTWduV8cre81dq38j_ZeLI2gXvXwTqyhG5Urm-s2lTKIE0wtZlA2aASaLlBpYHS72gxJfLnjWA8KLlT9XECTNytH-vGwM8TEaQkMlU0K87Uc8ySyH0xm5G_-XW2x2UOHzXkq-Yx3hp8qxH77Kc74G35XB=s321-no",
        "https://lh3.googleusercontent.com/gfgzQniLm4g3irBca7Llz6N_U9a9YxIh0lnZrEAfT3_Awr1ynAyTWJZzoTZDgInTOQRw7J-MFFBVeUmh5M9Jc0i8Q3Jw21VvJuwT24Q5Vd2FdODSE3zyynNTfgeKGuD8fOepRW5YiOEjrhOn8UnZkQgBdRgdRbuwWEJNlnwiJgu0iwg45r2jz9MgWEsi1_Ct8EWsHzUK6AUaxG-WSCXHE4cfG6c3jMCjdoI5QF2gQQ8Q2VtPbeoBtWMuNA3nijZgiZ9t4LUyYfDE__WMvcUxkKwXb1lvJ9sVuOm2dCAezzcgkjARZub42se5J7B99Cjb0hRNxBYYUc90XW0XCVzzljeK5R2sHFfnsv-Qw3oA4xC3LqLXnAH50L3FyUDFePUzNUpwWH1Wt2aN-lf-_ce5bMNZorZQGAVy32Yzrq5rAx21w_DYmZ9bt7LHjAUmUNcx7hqIe1S0LiKLNIuhQqTJlbLjYstRDYwcB9PKtrkzEf32QSVA4BOnLnha9oYS3dkgGnRx-oZqAvFZyBnUonfuj7q2f6U63aSwT67QAYTM9ZWlLLOkH1wOejlF-frL2gk-OvnO=w341-h321-no",
        "https://lh3.googleusercontent.com/wiafvohWyfqPKvNllZakwKuj5dud4_a5zNtFUCVQXMt3astnyCiNxYnhYlEznLJcJQDvk2ToQGpZhi5m1GOy64M4Jdk8wHUH5OSyWygkM5KDXBt3-IZ9ot0Ve_a2CfLbKRI3LYc_9FDpV6riTXWIsdudutOiNr1Pxgld46QJUVNW0_ydwN3CTN7jbc0V905vvy6GRhhXv5j6-fap-TVXf1tLMAynfSgO4w7Shr3TJbdOgyUfnb3mx_cEhaM1F3w8fOtbGyMem7yw7TuAh65v07x6JpI_UA4sYz5X7iSHb2bQD0j9keG1bvt-Pd7jmFGH8-pSwscjzAuZP39IfJKJw7e98skIz73MFC-Y4fG6LQON8___0s-qKqS_ZvoJKw6Q2Y-5wuV436ANT0hWt61Ef5Rrfpd-cpm7PyMn4xMxdiNj-vOKJe6IF6KOgBq8TBjsc8OEvWNeywPjW61VBjwu0_fjGfxbE81Dw3-TuhsyWvO01XpBXSZZnkkUNz9w0YhbjfUZGZYZOAjwLASDexEIfr8d_56vRVo2tkZpxnh9fpDAnxM0vWujg42_tAFl_WL4ubtD=w340-h321-no",
        "https://lh3.googleusercontent.com/5yPuCoHufNPKbJEolXMzWE3uPYGP7CZQHBmub-iAlWEoSD_63-ZmLqZQzeaQS9N8myEuLsI3GxWpsReqga7zj63QAff6yV6Io66U6U3ZEvfgbCaLq0Gh4K2Yk8vu9j17a0VZB9HrJevHIkQIs_FGduvHta3VFizaLISfO2RCkdhAOBIHKHoEGFgCXqKBsri0vhAwxrmR0JrUJDZMUxIWHyHqm2Er5CUIJmNCoRDmWahSNm7f9tsDBJPWzJ5tsj9wS1efc3C7eToIchOgOjeQ7Tk-FvSBLaVa6lV8_kgUL5urynI2ipESztGDs-k05V84Xq85CSOcPdzTEty4Ksbn-mx1POigdjJi7tqRpjF08nFfF0YcKvKcE4mfE4U5eYIN6UauS-kCvfcVEngfhmITTGyze9D3ZJq9y4Uy9J3HPHO7kP2fyqgmVN9zkJi457g43KsMHZrIgZjlmX7wG0tkVprQjYb74uo9oFxo9CjEkv9PfNyWz9YCMnHzSJYxttXlSIyeqTPBGWNSiZdNqxmBvhlIyhRIblUjZXjfPA8THnmHIAIrZM5S7mTRhlOqvDSbUgG7=w310-h311-no",
        "https://lh3.googleusercontent.com/pT77336FRSy21VSPegVMrhQGxFKUamoZl-KSPYpgWvC94x7Xk_ShCGxZ87eZSluCJJL2YXPItS4R0JDmUruL-Lqp5OVBtlBTGmcg0ytxR672Q4WZ_-QZKImvHzoKTlGbjMQWAlmz_ZIgU1zHd6XSj4EuUPv13wglqxhV1dOSdl7xp5TWlH4yI4gESAMA4S6R2skG2fzOu5gj7Jf4IZ4L7lQ55L5iJd0UBThSR-cQWzrgef8Ae_ibCyl_phnK_My6uGahjuFi2Z-95eCz9hZBwtvrSFeVeGouQy4VxP_Br-Vj2sOfgPq_dvHWnb9feOIFOemTcyooLFKbLgrTNT2wrSnLuAhzoPL7wc1OEAw2QjD6XVH-BmmaBZ_wWgFob2g00nJsminnHGgbPLKGhWYHMhldvEwGGNPhM-Sq9bu836pIAJ9WN0mENe2J0cV2XrUruj7qWNUih3OrBDlVyYMnCb7jsg5rugxKFMn2yLggRviZZmXJeSz0rcz20BLDL-aouC8KVLxk3oYA5Apk3hW5qm9GC4nGtZ1KmJMDW3HGAzPE-DY-ypJquI4cENA3JvdjM7Bq=w340-h311-no",
        "https://lh3.googleusercontent.com/ULa2YEi5rQvwGlHX_f42P1MGgryNHNXHAJC5TqtAhtj1AnkIhj5mXBZ1juTfDpG_whrNOFToDRV9dAM6LHE29anL8uvZYJNsHuMEQMbbSw4tN2WgmdY6Q1k0zSCCPQrJQx2uOQCDQ2Wa9HuMYY5KbEkrytoBfySU4SI6nIrm2jwKIiHCTGxxIsaSrIcQmRTsIVza3DAhAX3VMDEMmxNZPYKJ_JtQLXjCT_NseI_nn41XCT7PpG1CZtQaDuh9HnYfjVNVWO-nbrJI0pTQre8HstFdA1UOfY4c9RAaPr-ICCXW4L2uSATrBVAnPhSYs6VaXHDARhZ_JOiu4K-Q-7LMlh8gCr0n-nDzyzg0mabFUUnGkzwMF3OolNUEjiiE3ZGtwzOGxP6AafnJAAD-NOhatt311lEg6pr9MIss7MaQydTmV00s4ZDEFjItciJ0W0OzDk__AGw_INBM4Kzbje9rZesalKcRWUDfJDdThg3V5DeY_0o7cEsHXqizsXej6jx47s5P43TZuQfbFEnkW7DGNuJvAYFxkT_SNZ2koOUvWmEvrl_oqoesvaHDXbHa1Coo6fQh=w352-h311-no",
        "https://lh3.googleusercontent.com/pr2AYkrrum8mo3hpihTLtzC4-X9TPhbZT3U8kxeHzZpH7AxcDKZshqTAbYET9DYAcovll5VSYu140LTtvNpsaPAl5x47ryB--19dbRBzlyAmPSlN4zNhNYHDA28dxw9K7pPZMBwUh_Zzw21BoXgbH9xgtn-cMCd0osDhaJFCySHpnHP5lxMYVdM8abMXd2QrVxng22Rv2dloS7VGXp9esau4sUIaFDmhmV3Qtir4h0_iwDId12fNj0GT603_5J1CEgptl2BwzKaWaDeCT8SwI3AB1_iDTNoqenFuwLNjQD3lbc0yH7EK_m7ckeqJOTQNC437qREE9BSP5L64aO6UXuhhWzPdeW7KgAhPPxgAkHxeivSmnu2M6HIBz4K_Tj9TWiVepJXsIsaZomiYvEUu6bYelY5oiOEJou5F6T8vVLOf3oIftPJCZMp-YYgCbQho4FbrvfT6KQKt48G61R5Ah7GUDnK9WL_aVT4ItOINzXOlRexN6vK_jeZJln16xtLAQ5mpb8vSgVOtd85cK93Fei-s6J7pzwZvC3ogl9dAx6Nw2zl2J7IXRS4ikiOxX4uCfPWX=w333-h312-no",
        "https://lh3.googleusercontent.com/6UCR9xsN5T9DwXwqzz_Njw_VwWccTTmYNwT_wPMvp3y5RklfMfugSsBBkm2cLjT8_5fAZwrR7kvq_brDU7ZgxPB4Y8Th65d4HhsSDaH4QXaOQUHEGwj9qRyegyypKvAZaD-ZIjRpV-cVGPlnkXKWdk0MrMwEhRoLp7BwYh6smYx1N6aXjzOP3m1HUwLpIbs27DJcQEvluhsfUKYqXya14YynglDcP2mwB27Q4BbQK6NbzMSp1cS-9-XG8J5yyMYCe2f-pkAkN1mHpQUxWjp5OhvO1_so6OHWBzNDe4ko4AJuUiFE3-1cWVzHE3iVU_DYRPi9shuNcwyDDCKEVdvwz1CKCIsym5fn6_sfkiZVnkb0H1RUO1-89T5dx0_19cN0EnSHLW8PriDjcJpHqKiKyxsWwwO1cwNKCoJ9LOOpyiAtwVCcvJlrzc99nwxov9ZJ0eYQcu4dA6JEtPG2w61jKbHsNvOnYs-lfq8kigKANOiyLK2HtXSe6DKaz3wedb08fLgLJ75uW6HE43iOQqravs_Lcl5NH0oSMrt-b9KpWjwlH9BjPVlQ1MsgWeLbm9_paa0H=w344-h312-no",
        "https://lh3.googleusercontent.com/AG5MjacyYYkuQfDQqNhgEzoWkDR_HI25y9xgxZqPULVJIEwyaM2GHjMKp_naXNb6D36YEUtISFT1MeoirIVZDV_qwOio0IPInwCB1z7C06iFgSMbntdsDhYnhd0rae23JPnQR6xGWvbM5CW4sBb8i9py88BCxsMc3pVpObCm98hjtogDI75pHLIhKQvGxfKE14vuWRp-fD1KFhGf-Ymcrrapw6DvKb0QekuIRO_6e2WQ3YrsCxf636_xgtXYLVEJ4ZgwCuFN2bSNhdkdTrkIWGPAuf06Lmgbzp044iWLc495vSHmmLlbt_6AO3q5L5oC2anWB0qwnwW4leDzESfcGVW-azkip5c34oTAGq7jAD2F_I3_9jMaIAxdIMWcsnw4BFoRGuGJxYCBH1nYYnskZaZ5ndJtuuYl6dCcMbDQ_2mqUXNHxXzFYOLksD6C7D0pZOKXhD1isTaSJfbk5FYpqi9yEEuoxLgfKqY43CDMoNT0CSRWGWuElGeEjXzwhSqMMGO73wJbacEzU63h9a3ahXz5Lg7pwr_hpApB0q_oXW00QQ_F3LYQC9pZvDmNsfKg1-ML=w325-h312-no",
        "https://lh3.googleusercontent.com/KOMnwwomh5gx209-MbtIq6PC3pBpG4gnxsm0HVDz0wf6O5GNRs6OSGXzQghhcSAPDNUJjE-sRCNP0pPNj4vMlnePnaZD2GLdoCJc7-ohWXSGYkcND5LkKlP4nwUEvwRvMF66XEHVneQ88AdtKksRXvGCbXlfz8_vFHGtpMthl2TfYWSKC0v_C4ijKGrOXvnF2CLj10umMOGfXNU5npW43X5PK1wuBs5wgH4iGlSSF16OZTqkeGWl_ZKST7gRr6mb8bwir50kQ8W0C3Iip2UYwWsNcqTRfGsol7sQLHAp4rY6GUk_PohcXNs3Ry_jPEjTlw4IlSYNUy3QaCQTdDoeGVK1HDMtu_d9RZefDOb3D3x5o44qvXV88JNffuDsBTvYvDL8-gTva63H70LFipNChqUfQXd7fpHyQEYf_6In9q_C7Hv92eXK7bUz3ZGcCRucRk3sifFzMBWAdkr7Nhk1F9Q2fj2ai-M_V7On2pr1dVHxK7XBVoXeqiKvg0XliIPT0mVbIHcXiVMVy7sxz9jwxc68rF-3CRgo8mB4aeWY_0H-ozjRPD2hPDtO-SL7X52kokjM=w327-h316-no",
        "https://lh3.googleusercontent.com/zzEHWSvQYrFfySdiCqgux4yCoCmVdOj-Ml_hAQ65Fi-b5TOrIWACPVKQAWCQcWPOKoKSKSATumeJYjVLOMoHdyr0lELdoQ_HlEA7NhbmrPU4V2pIWQ2a0EIbr5BwEQVUl5ZNE2dUo2-Z-_XJf8v0VHFlLsCHeI1ckzoJtcuWTKft8cPzJX_SFNsneY5C6qH21hcqMlXyo_0l06d8sI92iugK9LCLAYYNR1zpMjK2_IiHml9eKuYh65atmcDbhJQs98IKOUcubzHEXDYsxA6AgtUrJzyEWXIkPNeRzcKG1V2VGwNTPdde6fTPgG-lhdAHkxVbVYGARBg84NDGJn-322MYKgMXNoTLekh71QuAAuaNzmZey6rCiUticgVTDm2uYNspGJ51Bf-dH06t3Ty4RSAVrdFypKuBl_CrBnwUfuzVd5Of2ywgJAzx_OpkaVE_3ah_FThYoBGdUBGis22Avltp7XS3qaZJDhAbSMVLl3-gYoZx4M6o_b4rZQiyIk6YUpeGpowWjKchYbvZ3sMa_ufXOeW0HHICj8KtLnxFPEOIAng2UTMwbjp-zUIOUlUTiOVg=w337-h316-no",
        "https://lh3.googleusercontent.com/crUrFsZm93S5wTV-lXKC6UWFoYuSEyHCiawadnKLaBAYs6IqSHLZnTN5Y6o2QNPcRydWUfHN810xdUIDTJrC7CNsMRR-UTuWOA2uuEoF3ukVPCx-FIMFQ40lFvt-aBqQYa9ZnlZsB67d-R-pTBtEIUib_Rh7SPL6Cy7yjkQlthKIwR-5hHjapG6QrAtN7TxCu0ZcN2fRWy6GNvBr4en3G1jnivrYQK1sh0qqBPc0hmlkVDMpplJqrkyDFo_eXDqXueBdslhVUgLNIYrLbquP6wBbu4NjSqghsy-em4DKLyhx-hI74SH0az511aGq1QbT4jC6ILCEAAnHVDCXYx6hlocexrSHmBpl_WXr6Jf-RdJjoRjimjX-TxJ5kVEIQcreFt-dFVDTnJU_futkm7Dnwf9d_KBK9-poeg9bsJo-SuBaSeMbpPZ37rqGl8TR0GDGUT2Av9TsIgTF5gUTSHVIRFhK_DPhktyRkl7Qmm98IB5osXVjKfZljcVb_zF8xcnlbQ4CN4ffSs6Uh7GB2cw468vSscgIV7YOXFd1Ni_HSIe72zlzD0LO97MCA0PU5LJ76dLE=w338-h316-no",
        "https://lh3.googleusercontent.com/uHQqdOnc2q8R_YIc_RV9ZMnoFgdRGKiFObpt6vgx5LpnLgWv56Vs8x03NOhGy3Fe50A4k7gZWs4w5XZwVMum9githUbP5QH17Y0MPAu_ZZdlMoTJ5TMZ2P-L83wm8wu-vFu7sXANv91ZaAdiKPrn5UJ7HA8y0BvMSKCZojxo-Zi6nWt1vLJS7_d9I2qRHO11nkIhHFHX3nFKd0LAtpX1VkL7Jij-rYgw0kw-t0V_19bweeDZfVbqMUJyO3s_Fft6-VE-dpgblBcBiIp7lvg48HPbZSGDXeiYKsbUdNs9sCA8zQeB_grKUQD9FVxnlI-_SyDRfDc5jHiqsSI8gEpxrE324lbDbUxGokhW071VtY3jdLiL9NRwvNkIvn3OA2CeJ5FVz3XIpgz8e1u8O4LMZwb1Po5nxKIJQwv2kFHAfauYgQV5tTXp8VB9CsKvFz6A6KVAnf9BVSxlHMqjKY225s1-wWvUqWsgL6vjGzfxmmk1J8S50ZrFiDuN7_4IthxhDK1-eFOVdQO-4hUh3gRopuQ6QOD7eFU8cefruOKBnUDWS5IXSFTZ8fepX_-eYNJhFasN=w329-h309-no",
        "https://lh3.googleusercontent.com/zJSiXxi8qGALWxiYi3kn7Hon5tdHBqbh_OA_4upqm29KEaC-2OKCUsxaZq3WGLn7vpt32O4gn_nGAVck6Dy4rzaH8tV-vptv-af46Jmj4UriDBNxDv5nFOYHEPvd1lXbkVRRp2svbLruPziLyOaycQjMpP5ZsW0P9ZCuhHVRXHIow-MgR0KSne5UC2mB4rBZ_sS5U4sj5UKT1_9l9c60D38cZOEG5v3fs33CLvB3uatA9r1UissO0-BaH5n1Qx3yKxsYQ-L2z-AgF3ntNmvJdwa6IDCW-UzQOEmnIo6426VaaVgMfXvE7YBwMdO-YON7Zxo87QPY4fdRyUQQ6b1OP1tip9wJMwnW6ihjnzWQ6opjcf78X8JSvMobZdzco334RVTGlU-3wEyN0u2L4yZOCf3o3D0n0UBeiS1lF9Hrjo7_sMZeNTQxI3KRoOT6nfR6MuQOb_CXDT9fEwLZ9-4kG9hm1Po87N20EXJCcoVmU7NxjtzPgzvQJmcVSfPSEcZaVzPHSAeQA8v3ldTtvJ7vObpCPqglsByqAFEJqA37coBvIJzLLfHdX9f5511bqIoa0cFC=w365-h309-no",
        "https://lh3.googleusercontent.com/l2oi1ivtQS-pnm671ZbQGFbS-W2a0YvM_26adVZ8c922jToCf-WroyYFa1XKXbb8SaZXBPHBfAVRejHGGysGiwPueOJDNOdqr_0ZmV9oUy2s8FCMPcfzwwe_P0SeDTZur5MNh1wNMFSAf6kwHq7PGHL45k5J3MinjuCNnOk26HPrgZEaZqq51rIGDcLX2voMY9OKtWJGTthCtXuwD305onhewPa2xbYYiGcPeQ9s2Uh8RlkkaSsstjNFiZlBIvVCmwhcHxHKZ96XV55MQ12y7nCZ727uguJX-gxkKvo9wd3eXjseAXgMela3fMdB4-mCeNsKnACxCGcNspZmzI1taNhPC_TbZweQIMKoPHARO8rA9UJhwTZ8g2Tr1DyFstkhAYsnJ2fgKYBRNXfQPL_injpqk7_0EHxkV8K77_Egc5_ynce_b-dE7D9OTIwstkq3ZVxpwOTZGC9ETJ2J7BDnMURuxY9Y1Qmj_1PrL5bebI8ozz0HNBEnNiPVFa-g59ZpgNez9QY0xZZl0cFh_G8Bj1MZp5YmjPtFRAlpSOojRyu-f_gI4PVdXXG8pCz_Hb804luv=w308-h309-no"
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
