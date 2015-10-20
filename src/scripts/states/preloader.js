(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {
    preload: function () {
      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.loadResources();

      this.ready = true;
    },

    loadResources: function () {
      var loadingBar = this.add.sprite(this.game.world.width/2, this.game.world.height/2, 'loading');
      loadingBar.anchor.setTo(0.5,0.5);
      this.load.setPreloadSprite(loadingBar);
      this.game.load.atlas('people', 'assets/beach/people/people.png', 'assets/beach/people/people.js');
      //this.game.load.atlasJSONHash('band', 'assets/band.png', 'assets/band.js');

      this.game.load.image('ground', 'assets/ground.png');
      this.game.load.image('space_ground', 'assets/space_ground.png');
      this.game.load.image('logo', 'assets/mari_button.png');
      this.game.load.image('crash', 'assets/crash.png');
      this.game.load.image('piece', 'assets/piece.png');
      this.game.load.image('point', 'assets/point.png');

      this.game.load.spritesheet('player', 'assets/player/player_stand_run.png', 57, 93, 7);
      this.game.load.spritesheet('player_float', 'assets/player/player_float.png', 61, 94, 3);
      this.game.load.spritesheet('player_fall', 'assets/player/player_fall.png', 93, 52, 6);

      this.game.load.spritesheet('player_fence', 'assets/player/player_stab.png', 93, 73, 6);
      this.game.load.spritesheet('player_crawl', 'assets/player/player_crawl.png', 93, 69, 6);
      this.game.load.spritesheet('player_die', 'assets/player/player_falloff.png', 110, 97, 6);

      this.game.load.spritesheet('crow_no_wing', 'assets/crow/crow_no_wing.png', 800, 705, 5);

      this.game.load.spritesheet('fishes1', 'assets/fishes/fishes1.png', 76, 80, 3);
      this.game.load.spritesheet('fishes2', 'assets/fishes/fishes2.png', 76, 72, 3);
      this.game.load.spritesheet('fishes3', 'assets/fishes/fishes3.png', 76, 69, 3);
      this.game.load.spritesheet('fishes4', 'assets/fishes/fishes4.png', 76, 76, 3);
      this.game.load.spritesheet('fishes5', 'assets/fishes/fishes5.png', 76, 92, 3);
      this.game.load.spritesheet('fishes6', 'assets/fishes/fishes6.png', 58, 60, 3);
      this.game.load.spritesheet('fishes7', 'assets/fishes/fishes7.png', 77, 70, 3);
      this.game.load.spritesheet('fishes8', 'assets/fishes/fishes8.png', 86, 70, 3);
      this.game.load.spritesheet('fishes9', 'assets/fishes/fishes9.png', 77, 70, 3);
      this.game.load.spritesheet('fishes10', 'assets/fishes/fishes10.png', 76, 70, 3);

      this.game.load.image('scar1', 'assets/scars/scar1.png');
      this.game.load.image('scar2', 'assets/scars/scar2.png');
      this.game.load.image('scar3', 'assets/scars/scar3.png');

      this.game.load.spritesheet('ball', 'assets/fishes/ball.png', 75, 75, 3);

      for (var i = 1; i < 9; i++) {
          this.game.load.image('stars' + i, 'assets/sky/' + i + '.png');
      }

      for (var k = 1; k < 4; k++) {
          this.game.load.image('cloud' + k, 'assets/beach/cloud' + k + '.png');
      }

      this.game.load.spritesheet('ilia', 'assets/band/ilia.png', 680, 1032, 6);
      this.game.load.spritesheet('max', 'assets/band/max.png', 680, 794, 6);
      this.game.load.spritesheet('lex', 'assets/band/lex.png', 680, 999, 6);
      this.game.load.spritesheet('yura', 'assets/band/yura.png', 612, 954, 6);

      this.game.load.image('beach_sky', 'assets/beach/sky.png');
      this.game.load.image('beach_sea', 'assets/beach/sea.png');
      this.game.load.image('beach_ground', 'assets/beach/ground.png');
      this.game.load.image('beach_island', 'assets/beach/island.png');
      this.game.load.image('beach_mic', 'assets/beach/mic.png');
      this.game.load.image('beach_stage', 'assets/beach/stage.png');

      this.game.load.audio('demo', ['assets/demka_prekrasnoe.mp3']);
      this.game.world.setBounds(0, 0, 12000, 1300);
    },

    create: function () {

    },

    update: function () {
       if (!!this.ready) {
        this.game.state.start('stage1');
       }
    },

    onLoadComplete: function () {
       this.ready = true;
    }
  };

  window['cosmo'] = window['cosmo'] || {};
  window['cosmo'].Preloader = Preloader;
}());
