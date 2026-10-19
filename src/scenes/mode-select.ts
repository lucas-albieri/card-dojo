import Phaser from 'phaser';
import { FONT, GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';
import { createMenuButton } from '../ui/menu-button';
import { addPhosphorIcon } from '../ui/phosphor-icons';

export class ModeSelect extends Phaser.Scene {
    constructor() {
        super('mode-select');
    }

    create() {
        this.cameras.main.setBackgroundColor('#10170f');
        this.add.text(W / 2, LAYOUT.modeHeadingY, 'ESCOLHA O MODO', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '78px',
            color: '#f7f6f2',
        }).setOrigin(0.5);
        addPhosphorIcon(this, 'sword', W / 2 - 330, LAYOUT.modeHeadingY, 54, 0xbaff39, 2);

        createMenuButton(this, W / 2, LAYOUT.modeTowerY, 520, 104, 'TORRE', () => {
            this.scene.start('tower-select');
        }, true, false, 'stairs');
        createMenuButton(this, W / 2, LAYOUT.modeFreeY, 520, 84, 'DOJO LIVRE', () => {
            this.scene.start('monster-select');
        }, false, true, 'boxing-glove');
        createMenuButton(this, W / 2, LAYOUT.modeStoryY, 520, 76, 'HISTÓRIA — EM BREVE', () => {}, false, true, 'book-open');
        createMenuButton(this, W / 2, LAYOUT.modeMultiplayerY, 520, 76, 'MULTIPLAYER — EM BREVE', () => {}, false, true, 'users-three');
        createMenuButton(this, W / 2, LAYOUT.modeBackY, 220, 62, 'VOLTAR', () => {
            this.scene.start('title');
        }, false, true, 'arrow-left');
    }
}
