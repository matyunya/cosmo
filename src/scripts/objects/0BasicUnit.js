/* exported BasicUnit */

var BasicUnit = (function() {
  'use strict';

  function BasicUnit(game, x, y, spriteName) {
    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.add.existing(this);
  }

  BasicUnit.prototype = Object.create(Phaser.Sprite.prototype);
  BasicUnit.prototype.constructor = BasicUnit;

  return BasicUnit;

}());
