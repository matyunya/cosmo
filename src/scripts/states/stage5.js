/*global Util, width, height, Stage1 */

var Stage5 = (function(Stage1) {
  'use strict';

  var Stage5 = function(){};
  Stage5 = Util.extend(Stage1);

  Stage5.create = function() {
    this.murderTime = 172000 - this.game.music.currentTime;
    //this.murderTime = 20000;
    this.game.world.setBounds(0, 0, width, height);
    this.after = false;

    console.log('Stage 6');
    this.setupPhysics();
    this.addPlayer(-1000,500);


    this.crow = this.game.add.sprite(0, 400, 'crow_no_wing');
    this.game.stage.backgroundColor = 0x000000;
    this.game.physics.p2.gravity.y = 0;
    
    this.crow.anchor.setTo(0.5, 0.5);
    this.crow.animations.add('fly');
    this.crow.animations.play('fly', 5, true);
    
    this.crow.angle = -40;
    this.crow.scale.set(2.2);

    this.addPlatforms(false, true, 1200);

    this.player.setCrawling();
    this.player.body.collideWorldBounds = false;

    this.game.time.events.add(this.murderTime - 10000, this.murderCrow, this);
    this.game.time.events.add(this.murderTime, this.playerDie, this);
  };

  Stage5.render = function() {};

  Stage5.pickCoin = function(body1) {
      body1.setZeroVelocity();
      this.game.score += 10;
      var riseTween = this.game.add.tween(body1.sprite).to({y:-10000}, 500, Phaser.Easing.Linear.None);
      var scaleTween = this.game.add.tween(body1.sprite.scale).to({x:2.5,y:2.5}, 700, Phaser.Easing.Linear.In);
      riseTween.onComplete.add(function(){ if (this.sprite) {this.sprite.destroy();}}, body1);
      this.tweenTint(this.player, 0xdddddd, 0xffffff, 100);
      riseTween.start();
      scaleTween.start();
  };

  Stage5.addCoins = function() {
      this.coins = this.game.add.group();
      this.coins.enableBody = true;
      this.coins.physicsBodyType = Phaser.Physics.P2JS;
      //this.coins.body.gravityScale = 0;

      this.game.physics.p2.updateBoundsCollisionGroup();

      for (var i = 0; i < 250; i++)
      {
          var x = this.game.world.randomX - 700;
          var panda = this.coins.create(
                          x,
                          this.game.world.randomY,
                               'stars2');

          panda.body.setCircle(4);
          panda.body.data.gravityScale = 0;
          panda.scale.set(Math.random() + 0.5);
          panda.body.collideWorldBounds = false;
          panda.body.setCollisionGroup(this.pandaCollisionGroup);
          panda.body.collides(this.playerCollisionGroup, this.pickCoin, this);
          this.game.add.tween(panda.scale).to({y : 0.5, x: 0.5}, 700, Phaser.Easing.Linear.In, true, 0, Number.MAX_VALUE, true).loop();
      }
  };

  Stage5.update = function() {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;

      if (this.after) {
          if (!this.coins) {
              this.addCoins();
          }
      
          this.player.controls();
      }

    if (this.player.x < 400 && !this.after) {
          this.crow.x = this.player.x;
          this.crow.y = this.player.y;
          this.player.body.moveRight(180);
      } else {
          this.after = true;
      }

      if (this.player.dying) {
          this.player.body.velocity.y = -50;
          this.player.angle -= 3;
      }

      if (this.player.stabbing) {
          this.game.score += 1000;
          var angle = (Math.random() > 0.5) ? Util.getRandomInt(1,3) : Util.getRandomInt(-1,-3);
          this.crow.angle += angle;
          this.coins.angle += angle*0.3;
          this.player.angle += angle;
          //this.text.angle += angle;
      }

      
      this.player.stabUpdate();

      if ((this.player.crawling || this.player.stabbing) && this.player.cursors.up.isDown && this.after) {

          if (this.player.crawling) {
              this.player.body.velocity.y = -40;
              this.player.animations.play('crawl', 15, false);
          }

          if (this.player.stabbing) {
              this.player.body.velocity.y = -80;
          }
      }

      if ((this.player.crawling || this.player.stabbing) && this.player.cursors.down.isDown && this.after) {

          if (this.player.crawling) {
              this.player.body.velocity.y = 40;
              this.player.animations.play('crawl', 15, false);    
          }

          if (this.player.stabbing) {
              this.player.body.velocity.y = 80;
          }
      }
  };

  Stage5.nextStage = function() {
      this.game.state.start('stage6', this.game);
  };

  Stage5.playerDie = function() {
      this.player.setDying();
      this.player.body.moveLeft(2000);
      this.game.physics.p2.gravity.x = -40000;
      this.game.time.events.add(2000, this.crowFall, this);
      this.coins.destroy();
  };


  Stage5.murderCrow = function() {
     this.player.setStabbing();

    /* var textTween = this.game.add.tween(this.text.scale).to({x:1.1, y:1.1}, 500, Phaser.Easing.Linear.None).loop();
     textTween.yoyo(true);
     textTween.start(); */
     
     this.game.time.events.add(10000, this.playerDie, this);
  };

  Stage5.crowFall = function() {

      var fallTween = this.game.add.tween(this.crow).to({angle:-70},500, Phaser.Easing.Quadratic.In);
      fallTween.start();
     // this.player.emitter.visible = 0;
      var crowScaleTween = this.game.add.tween(this.crow.scale).to({x:1.7,y:1.7}, 7000, Phaser.Easing.Linear.In);
      this.crow.frame = 3;
      crowScaleTween.start();
      this.crow.animations.stop();
      //this.tweenTint(this.player.emitter, 0xffffff, 0x000000, 15000);
      this.tweenTint(this.crow, 0xffffff, 0x000000, 15000);
     // var cameraTween = this.game.add.tween(this.game.camera).to({x:-300}, 4000, Phaser.Easing.Linear.None);
      //cameraTween.start();

      this.player.visible = false;
      this.player.x += 400;
      this.game.time.events.add(5000, this.nextStage, this);
  };

  Stage5.setupPhysics = function() {
          this.game.physics.startSystem(Phaser.Physics.P2JS);
          this.game.physics.p2.gravity.y = 0;
          this.game.physics.p2.friction = 0;
          this.game.physics.p2.restitution = 0;

          this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
          this.pandaCollisionGroup = this.game.physics.p2.createCollisionGroup();
          this.platformsCollisionGroup = this.game.physics.p2.createCollisionGroup();
          this.trashCollisionGroup = this.game.physics.p2.createCollisionGroup();
  };

  Stage5.changeTint = function(body1, body2) {
      body1.setZeroVelocity();
      body2.setZeroVelocity();
      this.game.add.tween(body2.sprite.scale).to({y : 0.5, x: 0.5}, 700, Phaser.Easing.Linear.In, true, 0, Number.MAX_VALUE, true).loop();
  };
  
  return Stage5;
  
}(Stage1 || {}));

window['cosmo'] = window['cosmo'] || {};
window['cosmo'].Stage5 = Stage5;
