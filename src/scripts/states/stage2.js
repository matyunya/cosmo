/*global Util, width, Stage1 */

var Stage2 = (function(Stage1) {
  'use strict';

  Stage2 = Util.extend(Stage1);

  Stage2.create = function() {
    this.jumpFactor = 2;
    this.nextTime = 40000 - this.game.music.currentTime;
    this.nextTime2 = 51000 - this.game.music.currentTime;
    //debug
    //this.nextTime = 5000;
    //this.nextTime2 = 5000;
    this.game.world.setBounds(0, 0, width + 1200, 7000);

    this.addSky();
    this.fixSky();
    this.bg = this.game.add.group();
    console.log('Stage 2');
    this.game.stage.backgroundColor = '#000000';

    this.setupPhysics();
    this.addPlayer(0, 6300);

    this.addFishes();

    this.switchGravityTime = 40000 - this.game.music.currentTime; //40000
    this.game.time.events.add(this.switchGravityTime, this.switchGravity, this);
    this.basketballTime = 52000 - this.game.music.currentTime; //52000

  };

  Stage2.switchGravity = function() {
      this.game.physics.p2.restitution = 0.9;
      this.player.body.data.gravityScale = 0.01;
      this.player.body.moveUp(500);
      this.player.setFloating();
      this.game.physics.p2.gravity.y = 0;
      this.fishes.forEach(function(panda) {
          panda.body.velocity.y = 2000;
      });
      this.game.time.events.add(this.basketballTime, this.startBasketball, this);
      console.log('floor');
      this.game.time.events.add(2000, this.addPlatforms, this);
      this.game.time.events.add(12000, this.afterFall, this);
  };

  Stage2.afterFall = function() {
      this.game.time.events.add(12000, this.toNextStage, this);
  };

  Stage2.update = function() {

      if (this.player.stopVelocity) {
          this.player.body.velocity.x = 0;    
      }

      this.skyUpdate();
      this.player.controls();
  };

  Stage2.toNextStage = function() {
          this.game.state.start('stage3', this.game);
  };

  Stage2.addFloor = function() {
      this.floors = this.game.add.group();
      this.floors.enableBody = true;
      this.floors.physicsBodyType = Phaser.Physics.P2JS;
      var floor = this.floors.create(0, 6850);
      floor.body.static = true;
      this.game.physics.p2.enable(floor);
      floor.height = 2;
      floor.width = 3000;
      floor.body.setCollisionGroup(this.platformsCollisionGroup);
      floor.body.collides(this.playerCollisionGroup, this.jumpHigher, this);
  };

  Stage2.changeTint = function(body1, body2) {
      if (this.game.basketball) {
          body2.sprite.loadTexture('ball');
          body2.sprite.animations.add('ballin');
          body2.sprite.animations.play('ballin', 8, true);
      } else {
          body2.sprite.animations.play('blink');
          body1.angularForce += 5;
      }

      if (body1.sprite.key === 'player_float' || body2.sprite.key === 'player_float') {
          this.game.score += 10;    
      }
  };

  Stage2.jumpHigher = function(body1) {
      body1.setZeroVelocity();
  };
  
  return Stage2;
  
}(Stage1 || {}));

window['cosmo'] = window['cosmo'] || {};
window['cosmo'].Stage2 = Stage2;
