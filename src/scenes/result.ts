import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';
import { addPhosphorIcon } from '../ui/phosphor-icons';

export class Result extends Phaser.Scene {
    constructor() {
        super('result');
    }

    create(data: { playerWon: boolean }) {
        this.add.rectangle(W / 2, H / 2, W, H, 0x2a1608, 0.78).setInteractive();
        addPhosphorIcon(this, data.playerWon ? 'trophy' : 'shield', W / 2, LAYOUT.resultTitleY - 100, 76, data.playerWon ? 0xbaff39 : 0xf3e5c7, 2);
        this.add.text(W / 2, LAYOUT.resultTitleY, data.playerWon ? 'Você venceu!' : 'O oponente venceu', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '110px',
            color: '#ffffff',
        }).setOrigin(0.5);
        this.add.text(W / 2, LAYOUT.resultSubtitleY, 'Voltando ao início...', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '56px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.time.delayedCall(1800, () => this.scene.start('title'));
    }
}
