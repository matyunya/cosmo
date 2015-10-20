/* global Util, width, height, Stage1 */
/* exported lex */

var Stage6 = (function(Stage1) {
  'use strict';

  var Stage6 = function(){};
  Stage6 = Util.extend(Stage1);

  Stage6.create = function() {
    this.game.world.setBounds(0, 0, width, height);
    console.log('Stage 7');

    this.rects = {};
    this.sky = this.game.add.sprite(0,0,'beach_sky');
    this.sea = this.game.add.sprite(0,height/3 - 3,'beach_sea');
    this.sea.height = height + 100;

    this.hills = this.game.add.sprite(0, height/3, 'beach_island');
    this.hills.anchor.setTo(0,1);
    var hillsTween = this.game.add.tween(this.hills).to({x:-300}, 30000, Phaser.Easing.Linear.None).loop();
    hillsTween.yoyo(true, 4000);
    hillsTween.start();

    this.bg = this.game.add.group();
    this.sea2 = this.game.add.sprite(0,height/3 + 80,'beach_sea');
    this.ground = this.game.add.sprite(0,height/3 + 100, 'beach_ground');
    this.stage = this.game.add.image(0,350, 'beach_stage');
    this.clouds = this.game.add.group();

    this.addBand();

    for (var n = 0; n < 20; n++) {
        var cloud = this.clouds.create(-100 * Util.getRandomInt(1, 10), Util.getRandomInt(0, 200), 'cloud' + Util.getRandomInt(1,3));
        cloud.scale.set(0.3);
        var cloudTween = this.game.add.tween(cloud).to({x:width+100},10000 * Util.getRandomInt(1,3), Phaser.Easing.Linear.None).loop();
        cloudTween.start();
    }
    this.mic = this.game.add.image(200, 350, 'beach_mic');
    this.party = this.game.add.group();
    for (var j = 0; j < 10; j++) {
            for (var k = 1; k < 10; k++) {
            var people = this.party.create(Util.getRandomInt(0, width), 450 + j*30, 'people', Util.getRandomInt(1, 60));
            people.scale.set(0.7);
            var pTween = this.game.add.tween(people).to({y:people.y+10}, Util.getRandomInt(420,430), Phaser.Easing.Linear.None).loop();
            pTween.start();
        }
    }

    this.sea.width = width;
    this.sea2.width = width;
    this.sky.width = width;
    this.ground.width = width;

    this.crow = this.bg.create(2*width/3, -100, 'crow_no_wing');
    this.crow.visible = false;

    var crowFallTime = 190000 - this.game.music.currentTime;
    crowFallTime = 3000;
    
    this.game.time.events.add(crowFallTime, this.crowFalls, this);
  };

  Stage6.update = function() {};

  Stage6.crowFalls = function() {
      this.crow.visible = true;
      this.crow.scale.set(0.1);
      this.crow.angle = -90;
      var tween = this.game.add.tween(this.crow).to({y:height/3 + 200}, 2000, Phaser.Easing.Linear.In);
      tween.onComplete.add(function(){
          this.crow.destroy();
          this.game.time.events.add(1500, function() {
             var waveTween = this.game.add.tween(this.ground).to({y:2000}, 20000, Phaser.Easing.Cubic.Out);
             this.game.time.events.add(1000, this.swipePeople, this);
             waveTween.start();
          }, this);

      }, this);
      tween.start();
  };

  Stage6.swipePeople = function() {
      this.party.forEach(function(people) {
          var tween = this.game.add.tween(people).to({y:4000},30000, Phaser.Easing.Cubic.Out);
          tween.start();
      }.bind(this));
  };

  Stage6.addBand = function() {
      this.band = this.game.add.group();
      var y = this.game.world.height/2 + 750;
      
      var yura = this.band.create(1300, y, 'yura');
      
      var max = this.band.create(1800, y - 50, 'max');
      
      var lex = this.band.create(200, y - 50, 'lex');
      var kan = this.band.create(900, y - 100, 'ilia');

      yura.scale.set(0.8);
      max.scale.set(1.3);
      kan.scale.set(1.1);
      
      this.band.forEach(function(member) {
          if (member.key === 'yura') {
              member.animations.add('test', [3,4,5], 5, false);
          } else {
              member.animations.add('test', [0,1,2], 5, false);
          }
          
          member.animations.play('test', 5, true);
      });

      this.band.scale.set(0.2);
  };
  
  return Stage6;
  
}(Stage1 || {}));

window['cosmo'] = window['cosmo'] || {};
window['cosmo'].Stage6 = Stage6;
