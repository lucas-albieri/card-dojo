import Phaser from 'phaser';
import { FONT, GAME_WIDTH as W } from '../config';
import { LAYOUT } from '../layout';
import { ultraT, ultraTAssets } from '../data/monsters/ultra-t';
import { createMenuButton } from '../ui/menu-button';

export class MonsterSelect extends Phaser.Scene {
    private availableFrame!: Phaser.GameObjects.Rectangle;

    constructor() {
        super('monster-select');
    }

    preload() {
        this.load.image('monster-ultra-t-logo', ultraTAssets.logo);
        this.load.image('monster-ultra-t-splash', ultraTAssets.splash);
    }

    create() {
        this.cameras.main.setBackgroundColor('#10170f');
        this.add.image(LAYOUT.selectLogoX, LAYOUT.selectLogoY, 'monster-ultra-t-logo')
            .setScale(LAYOUT.selectLogoScale);

        this.add.text(W / 2, LAYOUT.selectHeadingY, 'ESCOLHA SEU LUTADOR', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '72px',
            color: '#f7f6f2',
        }).setOrigin(0.5);
        this.add.text(W / 2, LAYOUT.selectSubtitleY, 'OUTROS PORTAIS AINDA ESTÃO SELADOS', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '25px',
            color: '#bba9d0',
        }).setOrigin(0.5);

        createMenuButton(this, LAYOUT.selectBackX, LAYOUT.selectBackY, 220, 66, 'VOLTAR', () => this.scene.start('title'));

        LAYOUT.selectSlotXs.forEach((x, index) => this.createSlot(x, index));

        createMenuButton(
            this,
            LAYOUT.selectActionX,
            LAYOUT.selectActionY,
            LAYOUT.selectActionWidth,
            LAYOUT.selectActionHeight,
            'ENTRAR NO DOJO',
            () => this.scene.start('battle', { monster: ultraT }),
            true,
        );
    }

    private createSlot(x: number, index: number) {
        const available = index === 0;
        const frame = this.add.rectangle(
            x,
            LAYOUT.selectSlotY,
            LAYOUT.selectSlotWidth,
            LAYOUT.selectSlotHeight,
            available ? 0x1c241a : 0x17181d,
            0.96,
        ).setStrokeStyle(available ? 4 : 2, available ? 0xbaff39 : 0x5b5267, available ? 1 : 0.72);

        if (available) {
            this.availableFrame = frame;
            this.add.text(x, LAYOUT.selectSlotY - 198, 'DISPONÍVEL', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '22px',
                color: '#baff39',
            }).setOrigin(0.5);
            this.add.image(x, LAYOUT.selectSlotY - 35, 'monster-ultra-t-splash')
                .setScale(LAYOUT.selectSplashScale);
            this.add.text(x, LAYOUT.selectSlotY + 158, ultraT.name.toUpperCase(), {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '34px',
                color: '#f7f6f2',
            }).setOrigin(0.5);
            const hitArea = this.add.zone(x, LAYOUT.selectSlotY, LAYOUT.selectSlotWidth, LAYOUT.selectSlotHeight)
                .setInteractive({ useHandCursor: true });
            hitArea.on('pointerdown', () => this.selectAvailable());
        } else {
            this.add.text(x, LAYOUT.selectSlotY - 20, '?', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '150px',
                color: '#8b70a7',
            }).setOrigin(0.5);
            this.add.text(x, LAYOUT.selectSlotY + 112, '???', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '34px',
                color: '#d4cbdc',
            }).setOrigin(0.5);
            this.add.text(x, LAYOUT.selectSlotY + 166, 'BLOQUEADO', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '21px',
                color: '#a58fb8',
            }).setOrigin(0.5);
        }
    }

    private selectAvailable() {
        this.availableFrame.setStrokeStyle(5, 0xd5ff83, 1).setFillStyle(0x26351e, 1);
        this.tweens.add({ targets: this.availableFrame, scaleX: 1.025, scaleY: 1.025, duration: 120, yoyo: true });
    }
}