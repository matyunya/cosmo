/* global Unit, Util, p2 */
/* exported Player */
   
var Player = (function() {
  'use strict';

  function Player(game, x, y) {
      this.game = game;
      this.canControl = true;
      this.facingRight = true;
      this.falling = false;
      this.floating = false;
      this.speed = 400;
      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON);  
      
      Unit.call(this, this.game, x, y, 'player');
      this.animations.add('run', [2,3,4,5,6], 5, true);
      this.animations.add('stand',[0,1], 15, true);
      this.floating = false;
      this.anchor.setTo(0.5, 0.5);
  }

  Player.prototype = Object.create(Unit.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.setFloating = function() {
      Unit.call(this, this.game, this.x, this.y, 'player_float');
      this.anchor.setTo(0.5, 0.5);
      this.animations.add('float', [0,1,2], 3);
   //   this.animations.play('float', 10, true);
      this.floating = true;
      this.body.fixedRotation = false;
  };

  Player.prototype.setFalling = function() {
      Unit.call(this, this.game, this.x, this.y, 'player_fall');
      this.animations.add('fall', [0,1,2,3,4,5,4,3,2,1]);
      this.animations.play('fall', 5, true);
      this.floating = false;
      this.falling = true;
      this.scale.set(1.2);
      this.anchor.setTo(0.5, 0.5);
  };

  Player.prototype.setCrawling = function() {
      Unit.call(this, this.game, this.x, this.y, 'player_crawl');
      this.animations.add('crawl');
      this.floating = false;
      this.frame = 2;
      this.falling = true;
      this.crawling = true;
      this.scale.set(1.2);
      this.anchor.setTo(0.5, 0.5);
      this.speed = 90;
  };

  Player.prototype.setStabbing = function() {
      Unit.call(this, this.game, this.x, this.y, 'player_fence');
      this.stabAnimation = this.animations.add('stab');
      this.animations.play('stab', 15, true);
      this.speed = 40;
      this.floating = false;
      this.falling = true;
      this.stabbing = true;
      this.crawling = false;
      this.coinsAmount = 100;
      this.scale.set(1.2);
      this.stabFactor = 0;
      this.anchor.setTo(0.5, 0.5);
  };

  Player.prototype.setDying = function() {
      Unit.call(this, this.game, this.x, this.y, 'player_die');
      this.animations.add('die');
      this.speed = 0;
      this.animations.play('die', 20, false);
      this.floating = false;
      this.stabbing = false;
      this.falling = true;
      this.dying = true;
      this.scale.set(1.2);
      this.anchor.setTo(0.5, 0.5);
  };

  Player.prototype.setRunning = function() {
      Unit.call(this, this.game, this.x, this.y, 'player');
      this.animations.add('run', [2,3,4,5,6], 5, true);
      this.animations.add('stand',[0,1], 15, true);
      this.floating = false;
      this.anchor.setTo(0.5, 0.5);
      this.speed = 400;
  };

  Player.prototype.enableP2Physics = function() {
    this.physics = 'p2';
    this.game.physics.p2.enable(this);
    this.game.physics.p2.gravity.y = 300;
    console.log('p2 physics');
    this.body.fixedRotation = true;
  };

  Player.prototype.run = function() {
          if (this.stabbing) {
              return;
          }

          if (this.touchingDown()) {
              this.animations.play('run', 10, false);
          } else {
              this.frame = 4;
          }
  };

  Player.prototype.stabUpdate = function() {
      if (this.animations.currentAnim.frame === 5 && this.stabbing) {
              this.coinsAmount *= 1.4;
              this.emitCoins(this.coinsAmount);
      } 
  };

  Player.prototype.emitCoins = function(amount) {
      if (this.emitter) {
         this.emitter.x = this.x+20;
         this.emitter.y = this.y+30;
      } else {
          this.emitter = this.game.add.emitter(this.x+20, this.y+30, amount);
      }

      //scars
      if (Math.random() > 0.6) {
          var scar = this.game.add.sprite(this.x+20, this.y+30, 'scar' + Util.getRandomInt(1,3));
          scar.scale.set(Math.random());
          scar.angle = Util.getRandomInt(0,360);
          scar.alpha = Math.random()/2;
          this.game.time.events.add(3000, function(){this.destroy();}, scar);
      }
      
      
      this.emitter.makeParticles('stars2');
      this.emitter.setXSpeed(-600,-1000);
      //this.emitter.width = 0;
      this.emitter.setYSpeed(-600, -1000);
      this.emitter.setScale(1,1.5,1,1.5);

      this.emitter.start(false, 400, 1, amount/2);  
  };

  Player.prototype.touchingDown = function() {

      var yAxis = p2.vec2.fromValues(0, 1);
      var result = false;

      for (var i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++)
      {
          var c = this.game.physics.p2.world.narrowphase.contactEquations[i];

          if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
              var d = p2.vec2.dot(c.normalA, yAxis);
              if (c.bodyA === this.body.data) {
                  d *= -1;
              }

              if (d > 0.5) {
                result = true;
              }
          }
      }
      
      return result;
  };

  return Player;

}());
