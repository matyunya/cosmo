/*global Util, width, height, Stage1 */

var Stage4 = (function(Stage1) {
  'use strict';

  var Stage4 = function(){};
  Stage4 = Util.extend(Stage1);

  Stage4.create = function() {
    this.after = false;
    this.added = false;
    this.y = 0;
    this.glass = {};
    this.nextTime = 115000 - this.game.music.currentTime;
    this.addNewObjectTime = 2000;

    this.addSky();
    this.fixSky();
    this.bg = this.game.add.group();

    this.game.world.setBounds(0, 0, width, height);
    console.log('Stage 2');
    this.setupPhysics();

    this.game.stage.backgroundColor = '#000000';

    this.addPlayer(250, -100);
    this.player.setFalling();
    this.game.physics.p2.updateBoundsCollisionGroup();
    this.game.time.events.add(this.nextTime, this.unfixPlayer, this);
  };


  Stage4.update = function() {
      this.player.body.velocity.x = 0;
      this.player.controls();

      this.game.world.wrap(this.player, 0, true);
      this.sky.forEach(function(star) {
          if (star.y > height*2) {
              star.y -= height*2 + 550;
          }
          star.y += (!this.game.fishes) ? 3 : 1;
      }.bind(this));

      this.fixPlayer();

      this.bg.forEach(function(object) {
          if (object.y < 0) {
              object.destroy();
          }
      });
  }; 

  Stage4.unfixPlayer = function() {
      this.fixPlayer = function() {};
      this.game.physics.p2.gravity.y = 1000;
      this.player.body.collideWorldBounds = false;
      this.bg.forEach(function(object) {
          var tween = this.game.add.tween(object).to({alpha:0},500, Phaser.Easing.Linear.None);
          tween.start();
      }.bind(this));

      var fishesDisappear = this.game.add.tween(this.sky).to({alpha:0}, 8000, Phaser.Easing.Quadratic.Out);

      this.game.time.events.add(9000, this.nextStage, this);
      fishesDisappear.start();
  };

  Stage4.fixPlayer = function() {
      if (this.player.y > 400 && this.player.y < 450) {
          this.player.body.gravityScale = 0;
          this.game.physics.p2.gravity.y = 0;
          this.y = this.player.y;
          this.after = true;
      }

      if (this.after) {
          this.game.physics.p2.gravity.y = -150;
          this.player.body.velocity.y = 0;
          if (!this.added) {
              this.game.time.events.add(1000, this.addObject, this);
              this.added = true;
          }
      }
  };

  Stage4.addObject = function() {
      this.glass = this.bg.create(this.game.world.randomX, this.player.y + 1000, 'crash');
      this.glass.alpha = 0.75;
      
      this.glass.tint = 0xFFFFFF;
      this.glass.scale.set(0.6);
      this.game.physics.p2.enable(this.glass);
      this.glass.body.setCollisionGroup(this.platformsCollisionGroup);
      this.glass.body.collideWorldBounds = false;
      this.glass.body.collides(this.playerCollisionGroup, this.shatter, this);

      if (this.addNewObjectTime < 700) {
          this.addNewObjectTime = 700;
      } else {
          this.addNewObjectTime -= 200;
      }
      
      this.game.time.events.add(this.addNewObjectTime, this.addObject, this);
  };

  Stage4.crowPickup = function() {
      this.camera.reset();
      this.karaokeOne = this.karaoke('ty');
      this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {
          this.karaoke('ya');
      }, this);
      //возвращение верхом
      this.crow = this.game.add.sprite(0,500,'player_with_crow');
      this.crow.animations.add('run');
      this.crow.animations.play('run', 1, true);
      this.crow.fixedToCamera = true;

  };

/*  Stage4.replaceStarsWithFishes = function() {
      var count = 0;
      this.sky.forEach(function(star) {
          if (count % 3 === 0) {
              star.loadTexture('fishes' + Util.getRandomInt(1,5));
              star.animations.add('blink');
              star.animations.play('blink', 5, true);
          }
          count++;
      });
      this.game.fishes = true;
      this.sky.alpha = 0.3;
  }; */

  Stage4.nextStage = function() {
      this.game.state.start('stage5', this.game);
  };

  Stage4.shatter = function(body1, body2) {
      var direction = (Math.random() < 0.5) ? 359 : -359;
      this.game.score +=10;

      //spin the player
      var tween = this.game.add.tween(body2.sprite).to({angle: direction}, 700, null);
      tween.start();

      var emitter = this.game.add.emitter(body1.sprite.x, body1.sprite.y - 10, 600);
      body1.sprite.destroy();
      emitter.width = 220;

      emitter.makeParticles('piece');

      emitter.minParticleSpeed.set(0, -1500);
      emitter.maxParticleSpeed.set(0, -1000);

      emitter.setRotation(0, 0);
      emitter.setAlpha(0.3, 0.7);
      emitter.setScale(0.5, 0.5, 1, 1);
      emitter.gravity = 2000;
      this.game.stage.backgroundColor = 0x000000;
      emitter.start(true, 3000, 1, 500);
  };
  
  return Stage4;
  
}(Stage1 || {}));

window['cosmo'] = window['cosmo'] || {};
window['cosmo'].Stage4 = Stage4;
