/*jshint browser:true */
'use strict';

require('./vendor.js')();

var appModule = require('../index');
console.log('bootstrapping angular');

angular.element(document).ready(function () {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});
