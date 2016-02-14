module.exports = function () {
  /* Styles */
  require('../index.styl');

  /* JS */
  //jquery is loaded from the cdn via a script in index.html/jade for better cache performance
  require('angular');
};
