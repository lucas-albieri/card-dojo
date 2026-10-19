import Phaser from 'phaser';
import './style.css';
import { GAME_WIDTH, GAME_HEIGHT } from './config';
import { Battle } from './scenes/battle';
import { Boot } from './scenes/boot';
import { MonsterSelect } from './scenes/monster-select';
import { ModeSelect } from './scenes/mode-select';
import { TowerSelect } from './scenes/tower-select';
import { TowerRunScene } from './scenes/tower-run';
import { Reward } from './scenes/reward';
import { Pause } from './scenes/pause';
import { Result } from './scenes/result';
import { Title } from './scenes/title';

const start = () =>
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'app',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#e9b98f',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Boot, Title, ModeSelect, TowerSelect, MonsterSelect, TowerRunScene, Battle, Reward, Pause, Result],
  });

// espera a fonte carregar (ou 1,5 s) para o texto sair certo
Promise.race([document.fonts.load('700 24px Fredoka'), new Promise(r => setTimeout(r, 1500))]).then(start, start);