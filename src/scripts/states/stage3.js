/*global Util, width, height, Stage1 */

var Stage3 = (function(Stage1) {
  'use strict';

  var Stage3 = function(){};
  Stage3 = Util.extend(Stage1);

  Stage3.create = function() {
    this.game.world.setBounds(0, 0, 10000, 1300);
    this.after = false;
    console.log('Stage 4');
    this.setupPhysics();
    this.game.stage.backgroundColor = '#07103A';
    this.hitWallTime = 20000;
    this.game.time.events.add(this.hitWallTime, this.preHitWall, this);
    this.addSpacePlatforms(1250);
    this.letItSnow(1,3);

    this.addCrow(-1000,150);
    
    this.crow.fixedToCamera = true;
    this.crow.scale.x = 1.5;
    this.crow.scale.y = 1.5;

    this.addSpacePlatforms(1250);
    this.addPlayer(-10, 950);
    this.letItSnow(3,5);
  };

  Stage3.update = function() {
      this.wrap();
      if (this.player.cursors.right.isDown) {
          if(this.player.x < 4000) {
              this.crow.cameraOffset.x +=1;   
          } else {
              this.crow.cameraOffset.x -=1;   
          }        
      }

      if (this.canHitWall) {

          if (this.player.x > this.game.camera.x+width - 20) {
              this.player.body.setCollisionGroup(this.trashCollisionGroup);
              this.player.body.velocity.x = -1000;
              this.after = true;
          }

          if (!this.after) {
              this.player.body.velocity.x -= 180;
              this.player.run();
              this.player.body.data.force[0] = -1000;
          } else {
              this.player.angle -= 1;
              this.game.time.events.add(300, this.nextStage, this);
          }
      } else {
          this.player.body.velocity.x = 0;
          this.player.controls();
      }
  };

  Stage3.wrap = function() {
      if (this.player.y > 1300) {
          console.log('revive player');
          this.x = this.player.x;

          this.player.destroy();
          this.addPlayer(this.x + 150, 800);
      }
  };

  Stage3.preHitWall = function() {
      this.game.camera.target = null;
      this.canHitWall = true;
  };//

  Stage3.preload = function() {
      this.game.load.spritesheet('player', 'assets/player/stand_run.png', 57, 93, 7);
  };


  Stage3.nextStage = function() {
      this.game.state.start('stage4', this.game);
  };

  Stage3.letItSnow = function(min, max) {
      this.emitter = this.game.add.emitter(0, 0, 2000);
      this.emitter.makeParticles('stars3');
      this.emitter.fixedToCamera = true;
      this.emitter.width = width*2;
      this.emitter.height = height*2;
      this.emitter.minParticleSpeed.setTo(5, 5);
      this.emitter.maxParticleSpeed.setTo(20, 10);
      this.emitter.setRotation(0, 0);
      this.emitter.setAlpha(0.4, 0.7);
      this.emitter.minParticleScale = min;
      this.emitter.maxParticleScale = max;
      this.emitter.gravity = 2;
      this.emitter.start(false, 3000, 10);
  };
  
  return Stage3;
  
}(Stage1 || {}));

window['cosmo'] = window['cosmo'] || {};
window['cosmo'].Stage3 = Stage3;
