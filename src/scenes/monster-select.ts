import Phaser from 'phaser';
import { FONT, GAME_WIDTH as W, REDUCED_MOTION } from '../config';
import { LAYOUT } from '../layout';
import { ultraT, ultraTAssets } from '../data/monsters/ultra-t';
import { createMenuButton } from '../ui/menu-button';
import { playSfx } from '../ui/audio';
import { addPhosphorIcon } from '../ui/phosphor-icons';
import { getGameSave, selectHero } from '../storage/local-save';

export class MonsterSelect extends Phaser.Scene {
    private availableFrame!: Phaser.GameObjects.Rectangle;
    private availableSelected = false;

    constructor() {
        super('monster-select');
    }

    preload() {
        this.load.image('monster-ultra-t-logo', ultraTAssets.logo);
        this.load.image('monster-ultra-t-splash', ultraTAssets.splash);
    }

    create(data: { towerId?: string } = {}) {
        this.availableSelected = getGameSave().progress.selectedHeroId === ultraT.id;
        this.cameras.main.setBackgroundColor('#10170f');
        this.add.image(LAYOUT.selectLogoX, LAYOUT.selectLogoY, 'monster-ultra-t-logo')
            .setScale(LAYOUT.selectLogoScale);

        this.add.text(W / 2, LAYOUT.selectHeadingY, 'ESCOLHA SEU LUTADOR', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '72px',
            color: '#f7f6f2',
        }).setOrigin(0.5);
        addPhosphorIcon(this, 'sword', W / 2 - 500, LAYOUT.selectHeadingY, 56, 0xbaff39, 2);
        this.add.text(W / 2, LAYOUT.selectSubtitleY, 'OUTROS PORTAIS AINDA ESTÃO SELADOS', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '25px',
            color: '#bba9d0',
        }).setOrigin(0.5);

        createMenuButton(this, LAYOUT.selectBackX, LAYOUT.selectBackY, 220, 66, 'VOLTAR', () => {
            this.scene.start(data.towerId ? 'tower-select' : 'mode-select');
        }, false, false, 'arrow-left');

        LAYOUT.selectSlotXs.forEach((x, index) => this.createSlot(x, index));

        createMenuButton(
            this,
            LAYOUT.selectActionX,
            LAYOUT.selectActionY,
            LAYOUT.selectActionWidth,
            LAYOUT.selectActionHeight,
            'ENTRAR NO DOJO',
            () => {
                if (data.towerId) this.scene.start('tower-run', { towerId: data.towerId, heroId: ultraT.id });
                else this.scene.start('battle', { monster: ultraT });
            },
            true,
            false,
            'sword',
        );
    }

    private createSlot(x: number, index: number) {
        const available = index === 0;
        const frame = this.add.rectangle(
            x,
            LAYOUT.selectSlotY,
            LAYOUT.selectSlotWidth,
            LAYOUT.selectSlotHeight,
            available && this.availableSelected ? 0x26351e : available ? 0x1c241a : 0x17181d,
            available && this.availableSelected ? 1 : 0.96,
        ).setStrokeStyle(available ? this.availableSelected ? 5 : 4 : 2, available ? 0xbaff39 : 0x5b5267, available ? 1 : 0.72);

        if (available) {
            this.availableFrame = frame;
            this.add.text(x, LAYOUT.selectSlotY - 198, 'DISPONÍVEL', {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '22px',
                color: '#baff39',
            }).setOrigin(0.5);
            addPhosphorIcon(this, 'check-circle', x - 86, LAYOUT.selectSlotY - 198, 24, 0xbaff39, 2);
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
            hitArea.on('pointerover', () => {
                this.availableFrame.setStrokeStyle(4, 0xd5ff83, 1)
                    .setFillStyle(0x26351e, 1);
                if (!REDUCED_MOTION) {
                    this.tweens.killTweensOf(this.availableFrame);
                    this.tweens.add({ targets: this.availableFrame, scaleX: 1.025, scaleY: 1.025, duration: 140, ease: 'Sine.easeOut' });
                }
            });
            hitArea.on('pointerout', () => {
                this.availableFrame
                    .setStrokeStyle(this.availableSelected ? 5 : 4, this.availableSelected ? 0xd5ff83 : 0xbaff39, 1)
                    .setFillStyle(this.availableSelected ? 0x26351e : 0x1c241a, this.availableSelected ? 1 : 0.96);
                if (!REDUCED_MOTION) {
                    this.tweens.killTweensOf(this.availableFrame);
                    this.tweens.add({ targets: this.availableFrame, scaleX: 1, scaleY: 1, duration: 140, ease: 'Sine.easeOut' });
                } else this.availableFrame.setScale(1);
            });
            hitArea.on('pointerdown', () => {
                playSfx(this, 'ui-click');
                this.selectAvailable();
            });
        } else {
            addPhosphorIcon(this, 'question', x, LAYOUT.selectSlotY - 20, 116, 0x8b70a7, 2);
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
            addPhosphorIcon(this, 'lock-key', x - 84, LAYOUT.selectSlotY + 166, 22, 0xa58fb8, 2);
        }
    }

    private selectAvailable() {
        selectHero(ultraT.id);
        this.availableSelected = true;
        this.availableFrame.setStrokeStyle(5, 0xd5ff83, 1).setFillStyle(0x26351e, 1);
        if (!REDUCED_MOTION) {
            this.tweens.add({ targets: this.availableFrame, scaleX: 1.025, scaleY: 1.025, duration: 120, yoyo: true });
        }
    }
}