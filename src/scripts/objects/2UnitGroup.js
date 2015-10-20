/* global Unit */
/* exported UnitGroup */
var UnitGroup = (function() {
  'use strict';

  function UnitGroup(game, xy, spriteName, immovable) {
    var i, unit;
      this.game = game;
    Phaser.Group.call(this, this.game);
    this.enableBody = true;
      this.physicsBodyType = Phaser.Physics.P2JS;

    for (i = 0; i < xy.length; i++) {
      unit = new Unit(this.game, xy[i][0], xy[i][1], spriteName);
      this.add(unit);
      this.additionalParams();

      if (immovable) {
        unit.setStatic();
      }
    }
  }

  UnitGroup.prototype = Object.create(Phaser.Group.prototype);
  UnitGroup.prototype.constructor = UnitGroup;

  UnitGroup.prototype.additionalParams = function() {};

  return UnitGroup;

}());
