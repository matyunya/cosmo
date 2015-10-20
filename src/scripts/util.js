/*jshint bitwise: false, unused: false*/
var Util = (function() {
  'use strict';

  return { 
    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    extend: function(defaults, options) {
      var extended = {};
      var prop;
      for (prop in defaults) {
          if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
              extended[prop] = defaults[prop];
          }
      }
      for (prop in options) {
          if (Object.prototype.hasOwnProperty.call(options, prop)) {
              extended[prop] = options[prop];
          }
      }
      return extended;
    }
  };

}());