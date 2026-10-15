import Phaser from 'phaser';
import './style.css';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { Battle } from './scenes/battle';

const start = () =>
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'app',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#e9b98f',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Battle],
  });

// espera a fonte carregar (ou 1,5 s) para o texto sair certo
Promise.race([document.fonts.load('700 24px Fredoka'), new Promise(r => setTimeout(r, 1500))]).then(start, start);