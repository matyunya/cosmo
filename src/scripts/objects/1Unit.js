/* global BasicUnit */
/* exported Unit */
  
var Unit = (function() {
  'use strict';

  function Unit(game, x, y, spriteName) {
    BasicUnit.call(this, game, x, y, spriteName);
      this.enablePhysics(game);
  }

  Unit.prototype = Object.create(BasicUnit.prototype);
  Unit.prototype.constructor = Unit;

  Unit.prototype.enablePhysics = function(game) {
    this.enableP2Physics(game);
      console.log('Enabling ' + this.physics);
  };

  Unit.prototype.enableArcadePhysics = function(game) {
    this.physics = 'arcade';
    game.physics.arcade.enable(this);
    this.enableBody = true;
      this.body.collideWorldBounds = true;
  };

  Unit.prototype.enableP2Physics = function (game) {
    this.physics = 'p2';
    game.physics.p2.enable(this);
      this.anchor.setTo(0.5, 0.5);
  };

  Unit.prototype.setStatic = function() {
    if (this.physics === 'p2') {
      this.body.static = true;
    } else if (this.physics === 'arcade') {
      this.body.immovable = true;
    }
  };

  Unit.prototype.scaleTween = function(game) {
      game.add.tween(this.scale)
              .to({y : 0.72, x: 0.72}, 400, Phaser.Easing.Linear.In, true, 0, Number.MAX_VALUE, true)
              .to({y : 0.7, x: 0.7}, 800, Phaser.Easing.Linear.Out, true, 0, Number.MAX_VALUE, true)
              .loop();
  };

  Unit.prototype.ascendTween = function(game) {
      game.add.tween(this).to({y:600}, 10000, Phaser.Easing.Linear.Out);
  };

  Unit.prototype.controls = function() {
      if (!this.canControl) {
        return;
      }

      if (this.cursors.left.isDown) {
          this.body.moveLeft(this.speed);

          if (this.facingRight && !this.floating && !this.falling) {
              this.scale.x = -1;
              this.facingRight = false;
          }

          if (!this.crawling) {
              this.run();   
          } else {
              this.animations.play('crawl', 15, false);
          }

      } else if (this.cursors.right.isDown) {
          this.body.moveRight(this.speed);

          if (!this.game.music) {
              this.game.music = this.game.add.audio('demo');
              this.game.music.play();
          }


          if (!this.facingRight && !this.floating && !this.falling) {
              this.scale.x = 1;
              this.facingRight = true;
          }

          if (!this.crawling) {
              this.run();   
          } else {
              this.animations.play('crawl', 15, false);
          }

      } else {
          this.animations.play('stand', 3, true);
      }
      
      if (this.cursors.up.isDown && (this.touchingDown() || this.floating) && !this.falling) {
          this.body.moveUp(200);
          this.animations.play('fall', 8, true);
      }

      if (this.cursors.down.isDown && !this.stopVelocity && !this.falling) {
          this.body.moveDown(200);
          this.animations.play('fall', 8, true);
      }
      
  };

  return Unit;

}());
