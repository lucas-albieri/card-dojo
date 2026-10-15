import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W, REDUCED_MOTION, setReducedMotion } from '../config';
import { LAYOUT } from '../layout';
import { ultraT, ultraTAssets } from '../data/monsters/ultra-t';
import { ELEMENTS } from '../core/types';
import { createDojoLobby } from '../ui/dojo-lobby';

export class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    preload() {
        this.load.image('monster-ultra-t-logo', ultraTAssets.logo);
        this.load.image('monster-ultra-t-splash', ultraTAssets.splash);
    }

    create() {
        createDojoLobby(this);

        this.add.image(LAYOUT.lobbyLogoX, LAYOUT.lobbyLogoY, 'monster-ultra-t-logo')
            .setScale(LAYOUT.lobbyLogoScale);
        this.add.text(LAYOUT.lobbyTitleX, LAYOUT.lobbyTitleY, 'DOJO', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '72px',
            color: '#f3e5c7',
            stroke: '#38281c',
            strokeThickness: 8,
        }).setOrigin(0, 0.5);
        this.add.text(LAYOUT.lobbyTitleX + 8, LAYOUT.lobbyTitleY + 52, 'PORTÕES ABERTOS', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '24px',
            color: '#baff39',
        });

        const splash = this.add.image(LAYOUT.lobbySplashX, LAYOUT.lobbySplashY, 'monster-ultra-t-splash')
            .setDepth(2)
            .setName('lobby-splash');
        const targetAspect = LAYOUT.lobbySplashWidth / LAYOUT.lobbySplashHeight;
        const sourceAspect = splash.width / splash.height;
        if (sourceAspect > targetAspect) {
            const cropWidth = splash.height * targetAspect;
            splash.setCrop((splash.width - cropWidth) / 2, 0, cropWidth, splash.height);
        } else {
            const cropHeight = splash.width / targetAspect;
            splash.setCrop(0, (splash.height - cropHeight) / 2, splash.width, cropHeight);
        }
        splash.setDisplaySize(LAYOUT.lobbySplashWidth, LAYOUT.lobbySplashHeight);
        this.add.text(LAYOUT.lobbyCharacterX, 748, 'ALTAR DO LUTADOR', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '25px',
            color: '#e5d6b2',
            stroke: '#172522',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(4);
        this.add.text(LAYOUT.lobbyCharacterX, 784, ultraT.name.toUpperCase(), {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '34px',
            color: '#baff39',
            stroke: '#172522',
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(4);

        this.add.text(LAYOUT.lobbyBattleX, 740, 'PORTÃO DA ARENA', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '28px',
            color: '#f2cb7a',
            stroke: '#38251b',
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(4);
        this.add.text(LAYOUT.lobbyDeckX, 886, 'MESA DO BARALHO', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '25px',
            color: '#f3e5c7',
            stroke: '#38281c',
            strokeThickness: 6,
        }).setOrigin(0.5).setDepth(4);

        this.createSelectedBadge();
        this.createSettingsHotspot();
        this.createHotspot(
            LAYOUT.lobbyBattleX,
            LAYOUT.lobbyBattleY,
            LAYOUT.lobbyBattleWidth,
            LAYOUT.lobbyBattleHeight,
            () => this.scene.start('battle', { monster: ultraT }),
        );
        this.createHotspot(
            LAYOUT.lobbyCharacterX,
            LAYOUT.lobbyCharacterY,
            LAYOUT.lobbyCharacterWidth,
            LAYOUT.lobbyCharacterHeight,
            () => this.scene.start('monster-select'),
        );
        this.createHotspot(
            LAYOUT.lobbyDeckX,
            LAYOUT.lobbyDeckY,
            LAYOUT.lobbyDeckWidth,
            LAYOUT.lobbyDeckHeight,
            () => this.openDeck(),
        );

        if (!REDUCED_MOTION) {
            this.tweens.add({ targets: splash, y: '-=8', duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
    }

    private createSelectedBadge() {
        const x = LAYOUT.lobbySelectedX;
        const y = LAYOUT.lobbySelectedY;
        this.add.rectangle(x, y, 430, 86, 0x1c2925, 0.92).setStrokeStyle(3, 0xb89557, 0.9);
        this.add.text(x - 190, y - 20, 'PERSONAGEM ATIVO', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '18px',
            color: '#c4b694',
        });
        this.add.text(x - 190, y + 13, ultraT.name.toUpperCase(), {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '26px',
            color: '#f3e5c7',
        });
    }

    private createSettingsHotspot() {
        const button = this.add.container(LAYOUT.lobbySettingsX, LAYOUT.lobbySettingsY).setDepth(30);
        const disc = this.add.circle(0, 0, 42, 0x1c2925, 0.96).setStrokeStyle(3, 0xd1b36e);
        const icon = this.add.text(0, -2, '⚙', { fontSize: '44px', color: '#f3e5c7' }).setOrigin(0.5);
        button.add([disc, icon]);
        disc.setInteractive({ useHandCursor: true });
        disc.on('pointerover', () => disc.setFillStyle(0x395247));
        disc.on('pointerout', () => disc.setFillStyle(0x1c2925, 0.96));
        disc.on('pointerdown', () => this.openSettings());
    }

    private createHotspot(x: number, y: number, width: number, height: number, onPress: () => void) {
        const zone = this.add.zone(x, y, width, height).setDepth(11).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', onPress);
    }

    private openSettings() {
        const overlay = this.createOverlay('CONFIGURAÇÕES', 700, 560);
        const addText = (x: number, y: number, text: string, fontSize: string, color = '#f3e5c7') => {
            const item = this.add.text(x, y, text, { fontFamily: FONT, fontStyle: '700', fontSize, color }).setOrigin(0.5);
            overlay.add(item);
            return item;
        };

        addText(0, -190, 'MOVIMENTO REDUZIDO', '30px');
        addText(0, -142, 'Diminui animações e efeitos de câmera', '22px', '#c4b694');
        const motionState = addText(0, -60, REDUCED_MOTION ? 'ATIVADO' : 'DESATIVADO', '28px', '#baff39');
        const motionToggle = this.add.rectangle(0, -60, 310, 68, 0x30483e).setStrokeStyle(3, 0xbaff39).setInteractive({ useHandCursor: true });
        overlay.add(motionToggle);
        motionToggle.on('pointerdown', () => {
            setReducedMotion(!REDUCED_MOTION);
            motionState.setText(REDUCED_MOTION ? 'ATIVADO' : 'DESATIVADO');
        });

        const fullscreen = this.add.rectangle(0, 55, 390, 70, 0x32443c).setStrokeStyle(3, 0xb89557).setInteractive({ useHandCursor: true });
        overlay.add(fullscreen);
        const fullscreenLabel = addText(0, 55, 'ALTERNAR TELA CHEIA', '25px');
        fullscreen.on('pointerdown', () => {
            if (this.scale.isFullscreen) this.scale.stopFullscreen();
            else this.scale.startFullscreen();
        });
        fullscreenLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => fullscreen.emit('pointerdown'));
    }

    private openDeck() {
        const overlay = this.createOverlay('BARALHO DO ULTRA T', 1180, 760);
        const cardWidth = 330;
        const cardHeight = 150;
        const columnXs = [-370, 0, 370];
        const rowYs = [-190, -10, 170];

        ultraT.deck.forEach((card, index) => {
            const x = columnXs[index % 3];
            const y = rowYs[Math.floor(index / 3)];
            const info = ELEMENTS[card.element];
            const background = this.add.rectangle(x, y, cardWidth, cardHeight, 0x26342e)
                .setStrokeStyle(3, info.tint, 0.95);
            overlay.add(background);
            const stripe = this.add.rectangle(x - cardWidth / 2 + 8, y, 12, cardHeight - 10, info.tint);
            overlay.add(stripe);

            const kindLabel = card.kind === 'special' ? 'ESPECIAL' : 'BÁSICA';
            const name = card.animation ? this.animationLabel(card.animation) : info.label.toUpperCase();
            const detail = this.add.text(x - 140, y - 42, `${info.label.toUpperCase()}  ·  ${card.value}`, {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '25px',
                color: '#f3e5c7',
            });
            const type = this.add.text(x - 140, y + 5, kindLabel, {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize: '17px',
                color: card.kind === 'special' ? '#baff39' : '#c4b694',
            });
            const effect = this.add.text(x - 140, y + 34, name, {
                fontFamily: FONT,
                fontSize: '18px',
                color: '#d5dcd2',
            });
            overlay.add([detail, type, effect]);
        });

        const summary = this.add.text(0, 286, '9 CARTAS  ·  6 BÁSICAS  ·  3 ESPECIAIS', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '22px',
            color: '#c4b694',
        }).setOrigin(0.5);
        overlay.add(summary);
    }

    private createOverlay(title: string, width: number, height: number) {
        const overlay = this.add.container(W / 2, H / 2).setDepth(1000);
        const backdrop = this.add.rectangle(0, 0, W, H, 0x0c1411, 0.82).setInteractive();
        const panel = this.add.rectangle(0, 0, width, height, 0x1b2924).setStrokeStyle(5, 0xb89557).setInteractive();
        overlay.add([backdrop, panel]);

        const heading = this.add.text(0, -height / 2 + 58, title, {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '38px',
            color: '#f3e5c7',
        }).setOrigin(0.5);
        const close = this.add.text(width / 2 - 34, -height / 2 + 28, '×', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '48px',
            color: '#f3e5c7',
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        overlay.add([heading, close]);

        const closeOverlay = () => overlay.destroy();
        backdrop.on('pointerdown', closeOverlay);
        close.on('pointerdown', closeOverlay);
        this.input.keyboard?.once('keydown-ESC', closeOverlay);
        return overlay;
    }

    private animationLabel(animation: string) {
        const labels: Record<string, string> = {
            'ninja-cut': 'Corte Ninja',
            'snow-freeze': 'Nevasca',
            'vine-cage': 'Prisão de Vinhas',
        };
        return labels[animation] ?? 'Finalização especial';
    }
}