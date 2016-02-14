'use strict';

module.exports = angular.module('app', []);

angular.module('app', [])
.controller('mainCtl', function($scope) {
  console.log('in main ctl');
  $scope.JQ = jQuery;

  function printMessage (status='working') {		// default params
    let message = 'ES6';					            	// let
    console.log(`${message} is ${status}`);	    // template string
  }
  printMessage();
});
