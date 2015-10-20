/* global Unit */
/* exported Logo */

var Logo = (function() {
  'use strict';

  function Logo(game, x, y) {
      this.game = game;
    Unit.call(this, game, x, y, 'logo');
      this.scale.x = 0.7;
      this.scale.y = 0.7;
      this.setStatic();
      this.anchor.setTo(0.5, 0.5);
      this.scaleTween(this.game);
  }

  Logo.prototype = Object.create(Unit.prototype);
  Logo.prototype.constructor = Logo;

  return Logo;

}());
