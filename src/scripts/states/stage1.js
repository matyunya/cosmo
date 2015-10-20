/* global Util, width, height, Logo, Player */

var Stage1 = (function() {
  'use strict';

  return {
    create: function(){
 
      this.game.music = this.game.add.audio('demo');
      this.game.music.play();
      this.game.world.setBounds(0, 0, 17000, 3000);
      this.game.score = 0;
      this.setupPhysics();
      this.nextStageNumber = 6;

      this.rects = {};
      this.bg = this.game.add.group();
      this.rects.black = this.drawRect(13000, 0, 20000, 3000, 0x000000);
      this.addSky();

      this.sky.x = 13600;
      this.sky.y = 2000;
      this.addBandTransparent();
      this.addPlatforms(true, false, 2900);
      this.rects.red = this.drawRect(0,0,width,3000,0x980008);
      this.addPlayer(width/2, 2855);

      this.logoButton = new Logo(this.game, this.player.x, this.player.y - 300);
      this.logoButton.visible = true;

      this.addCrow(13500, 1800);
      this.game.stage.backgroundColor = '#FFFFFF';

      this.switchGravityTime = 40000; //40000
      
      this.game.time.events.add(this.switchGravityTime - 1000, this.preSwitchGravity, this);
      this.game.time.events.add(this.switchGravityTime, this.switchGravity, this);

      if (this.nextStageNumber === 2) {
          this.game.time.events.add(40000, this.nextStage, this); //40000 
      } else {
          this.game.time.events.add(6000, this.nextStage, this); //40000
      }

      this.tweenTint(this.rects.red, 0x980008, 0xffffff, 3000);
    },

    update:  function(){
      this.wrap(3000);
      this.player.body.velocity.x = 0;

      if (this.player.x > 13140) {
        this.nextStage();
      }

      this.player.controls();

      if (!this.player.floating) {
          this.camera.y -= 1000;
      }
    },

    addPlayer: function(x, y) {
      this.player = new Player(this.game, x, y);
      this.player.body.setCollisionGroup(this.playerCollisionGroup);
      this.player.body.collides(this.platformsCollisionGroup);
      this.player.body.collides(this.pandaCollisionGroup);
    },

    preSwitchGravity: function() {
      this.band.visible = false;
      this.crow.visible = false;
      this.player.body.data.gravityScale = 0.01;
      this.player.body.moveUp(100);
      this.game.physics.p2.gravity.y = 0;
      //this.spacePlatforms.destroy();
      this.platforms.destroy();
    },

    fixSky: function() {
      this.sky.fixedToCamera = true;
      this.sky.cameraOffset.x = 0;
      this.sky.cameraOffset.y = 0;
    },

    wrap: function(y) {
      if (this.player.y > y) {
        this.x = this.player.x;
        this.player.destroy();
        this.addPlayer(this.x + 150, y - 500);
      }
    },

    switchGravity: function() {
      this.wrap = false;
      this.player.setFloating();
      this.game.time.events.add(this.basketballTime, this.startBasketball, this);
    },

    startBasketball: function() {
      this.game.basketball = true;
      
      this.game.physics.p2.restitution = 0.8;
      this.game.physics.p2.gravity.y = 1000;   

      this.fishes.forEach(function(panda) {
          panda.body.data.gravityScale = 1;
          panda.body.collideWorldBounds = (Math.random() > 0.8);
          panda.body.collideWorldBounds = false;
          panda.loadTexture('ball');
          panda.animations.add('blink');
          panda.animations.play('blink', 8, true);
          panda.body.gravityScale = 1;
      }, this);

      this.player.loadTexture('ball');
      this.player.animations.add('blink');
      this.player.animations.play('blink', 8, true);
      this.player.gravityScale = 1;
    },

    changeTint: function(body1, body2) {
      body2.sprite.animations.play('blink');
      body1.sprite.animations.play('blink');   
      body1.angularForce += 5;
    },

    nextStage: function() {
      this.game.state.start('stage' + this.nextStageNumber, this.game);
    },

    setupPhysicsTest: function() {
      this.game.physics.startSystem(Phaser.Physics.Arcade);
      this.game.physics.p2.gravity.y = 700;
      this.game.physics.p2.friction = 0;
      this.game.physics.p2.restitution = 0;
      this.game.physics.p2.setImpactEvents(true);
      
      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.pandaCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.platformsCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.trashCollisionGroup = this.game.physics.p2.createCollisionGroup();
    },

    setupPhysics: function() {
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.gravity.y = 700;
      this.game.physics.p2.friction = 0;
      this.game.physics.p2.restitution = 0;
      
      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.pandaCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.platformsCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.trashCollisionGroup = this.game.physics.p2.createCollisionGroup();
    },

    drawRect: function(x, y, width, height, color) {
      var rectangle = this.game.add.graphics(x, y);
      rectangle.beginFill(color, 1);
      rectangle.drawRect(0, 0, width, height);
      rectangle.alpha = 1;
      rectangle.endFill();
      return rectangle;
    },

    addSky: function() {
      this.sky = this.game.add.group();
      var prev = 1,
      tints = [0xe36e43, 0x2698cc, 0xf5dc5b, 0x4cb3a9, 0xe386b0, 0xb4b0d2],
      cur = 0,
      bigCounter;
      for (var j = 1; j < height/10; j++) {
        for (var i = 1; i < width/20; i++) {
          cur = Util.getRandomInt(1,9);
          cur = (cur === prev) ? cur : Util.getRandomInt(1,7);

          if (cur === 8) {
              bigCounter += 1;
          }

          if (bigCounter > 5) {
              cur = 2;
          }

          var star = this.sky.create(i*40 - j*12, j*27, 'stars' + cur);
          star.anchor.setTo(0.5, 0.5);
          star.tint = tints[Util.getRandomInt(0,5)];
          prev = cur;
        }
      }
      
      this.sky.x -= 100;
      this.sky.y -= 30;
      this.sky.alpha = 0.5;
      this.sky.scale.set(0.8); 
    },

    addCrow: function(x, y) {
      this.crow = this.game.add.sprite(x, y, 'crow_no_wing');
      this.crow.scale.x = -1.8;
      this.crow.scale.y = 1.8;
      this.crow.animations.add('run');
      this.crow.animations.play('run', 5, true);

      this.addCrowSprincle(x, y);
    },

    addCrowSprincle: function(x, y) {
      this.emitter = this.game.add.emitter(x-1000, y+600, 200);
      this.emitter.makeParticles('stars3');
      this.emitter.width = 500;
      this.emitter.height = 300;
      this.emitter.minParticleSpeed.setTo(5, 5);
      this.emitter.maxParticleSpeed.setTo(20, 10);
      this.emitter.setRotation(0, 0);
      this.emitter.setAlpha(0.4, 1);
      this.emitter.minParticleScale = 0.2;
      this.emitter.maxParticleScale = 0.5;
      this.emitter.gravity = 2;
      this.emitter.start(false, 5000, 100);
    },

    addSpacePlatforms: function(y) {
      this.spacePlatforms = this.game.add.group();

      this.spacePlatforms.enableBody = true;
      this.spacePlatforms.physicsBodyType = Phaser.Physics.P2JS;

      for (var i = 0; i < 20; i++) {
        var panda = this.spacePlatforms.create(i*1500, y, 'space_ground');
        panda.body.static = true;
        this.game.physics.p2.enable(panda);
        panda.body.setCollisionGroup(this.platformsCollisionGroup);
        panda.body.collides(this.playerCollisionGroup);
        panda.body.collides(this.pandaCollisionGroup);
        panda.x += 1100;
        panda.alpha = 0.6;
      }
    },

    addBandTransparent: function() {
      this.band = this.game.add.group();
      var kan = this.band.create(10000, 2500, 'ilia');
      var lex = this.band.create(8000, 2300, 'lex');
      var max = this.band.create(5000, 2400, 'max');
      var yura = this.band.create(3000, 2200, 'yura');
      
      this.band.forEach(function(member) {
        if (member.key !== 'yura') {
          member.animations.add('test', [3,4,5], 5, false);
        } else {
          member.animations.add('test', [0,1,2], 5, false);
        }
        
        member.animations.play('test', 5, true);
        member.scale.x = 0.8;
        member.scale.y = 0.8;
      });

    },

    addPlatforms: function(visible, noWholes, y) {
      var platform;
      this.platforms = this.game.add.group();
      this.platforms.enableBody = true;
      this.platforms.physicsBodyType = Phaser.Physics.P2JS;

      for (var i = 0; i < 22; i++) {
        if (noWholes) {
          platform = this.platforms.create(i*613, y, 'ground');
        } else {
          if ([6,8,12,13,14].indexOf(i) !== -1) {
            platform = this.platforms.create(i*613 - 200, y, 'ground');
          } else {
            platform = this.platforms.create(i*613, y, 'ground');
          }
        }
          
        platform.visible = visible;
        platform.body.static = true;
        this.game.physics.p2.enable(platform);
        platform.body.setCollisionGroup(this.platformsCollisionGroup);
        platform.body.collides(this.playerCollisionGroup);
        platform.body.collides(this.pandaCollisionGroup);
      }
    },

    skyUpdate: function() {
      if (this.game.basketball) {
        this.sky.forEach(function(star) {
            star.angle += 20;
        });
      } else {
        if (this.player.cursors.up.isDown) {
          this.sky.forEach(function(star) {
              star.angle +=10;
          });
        }

        if (this.player.cursors.down.isDown) {
          this.sky.forEach(function(star) {
              star.angle -=10;
          });
        }

        if (this.player.cursors.right.isDown) {
          this.sky.forEach(function(star) {
            var rnd = (!this.game.basketball) ? Util.getRandomInt(1,100) : 1;
            var scale = (!this.game.basketball) ? 1.1 : 3;
            if (rnd === 1 && star.scale.x < 5) {
                star.scale.x *= scale;
                star.scale.y *= scale;
            }
            star.x -=0.5;
          }.bind(this));

        }

        if (this.player.cursors.left.isDown) {
          this.sky.forEach(function(star) {
              star.x +=0.5;
          });
        }
      }  
    },

    tweenTint: function(obj, startColor, endColor, time) {
      var colorBlend = {step: 0};
      var colorTween = this.game.add.tween(colorBlend).to({step: 100}, time);
      colorTween.onUpdateCallback(function() {
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);   
      });
      obj.tint = startColor;    
      colorTween.start();
    },

    addFishes: function() {
      var fish;
      this.fishes = this.game.add.group();
      this.fishes.enableBody = true;
      this.fishes.physicsBodyType = Phaser.Physics.P2JS;

      this.game.physics.p2.updateBoundsCollisionGroup();

      for (var i = 0; i < 200; i++)
      {
        fish = this.fishes.create(
                        Util.getRandomInt(0, width + 1200),
                        Util.getRandomInt(6500, 7000),
                       'fishes' + Util.getRandomInt(1,10)
                       );

        fish.body.setCircle(30);
        fish.scale.x = 0.8;
        fish.scale.y = 0.8;
        fish.body.data.gravityScale = 1;
        fish.body.setCollisionGroup(this.pandaCollisionGroup);
        fish.body.collides(this.pandaCollisionGroup,this.changeTint, this);
        fish.body.collides(this.playerCollisionGroup, this.changeTint, this);
        fish.body.collides(this.platformsCollisionGroup);
        fish.animations.add('blink');
        fish.animations.play('blink', 5, true);
      }

      //this.fishes.callAll('animations.add', 'animations', 'blink', [0,1,2], 3, false);
      this.player.body.collides(this.pandaCollisionGroup, this.changeTint, this);
    }
  };

}());

window['cosmo'] = window['cosmo'] || {};
window['cosmo'].Stage1 = Stage1;