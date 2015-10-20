/*global width, height*/
window.addEventListener('load', function () {
  'use strict';

  var ns = window['cosmo'];
  var game = new Phaser.Game(width, height, Phaser.AUTO, 'cosmo-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('stage1', ns.Stage1);
  game.state.add('stage2', ns.Stage2);
  game.state.add('stage3', ns.Stage3);
  game.state.add('stage4', ns.Stage4);
  game.state.add('stage5', ns.Stage5);
  game.state.add('stage6', ns.Stage6);
  game.state.start('boot');
}, false);
