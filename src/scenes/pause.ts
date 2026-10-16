import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';
import { createMenuButton } from '../ui/menu-button';

export class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }

    create() {
        this.add.rectangle(W / 2, H / 2, W, H, 0x0c1411, 0.78).setInteractive();
        this.add.rectangle(W / 2, H / 2, LAYOUT.pausePanelWidth, LAYOUT.pausePanelHeight, 0x1b2924)
            .setStrokeStyle(5, 0xb89557);
        this.add.text(W / 2, LAYOUT.pauseTitleY, 'BATALHA PAUSADA', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '64px',
            color: '#f3e5c7',
        }).setOrigin(0.5);

        createMenuButton(
            this,
            W / 2,
            LAYOUT.pauseResumeY,
            430,
            78,
            'CONTINUAR',
            () => this.resumeBattle(),
            true,
        );
        createMenuButton(
            this,
            W / 2,
            LAYOUT.pauseExitY,
            430,
            78,
            'SAIR PARA O INÍCIO',
            () => this.returnToTitle(),
        );

        this.input.keyboard?.once('keydown-ESC', () => this.resumeBattle());
    }

    private resumeBattle() {
        this.scene.stop();
        this.scene.resume('battle');
    }

    private returnToTitle() {
        this.scene.stop('battle');
        this.scene.start('title');
    }
}
