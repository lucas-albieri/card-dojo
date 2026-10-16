import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W, REDUCED_MOTION, setReducedMotion } from '../config';
import { LAYOUT } from '../layout';
import { ultraT, ultraTAssets } from '../data/monsters/ultra-t';
import { ELEMENTS } from '../core/types';
import { createDojoLobby } from '../ui/dojo-lobby';

export class Title extends Phaser.Scene {
    constructor () {
        super('title');
    }

    preload() {
        this.load.image('dojo-background', '/dojo.png');
        this.load.image('dojo-altar', '/altar.png');
        this.load.image('dojo-table', '/mesa.png');
        this.load.image('dojo-cards', '/cartas.png');
        this.load.image('monster-ultra-t-splash', ultraTAssets.splash);
    }

    create() {
        createDojoLobby(this);

        this.add.text(LAYOUT.lobbyTitleX, LAYOUT.lobbyTitleY, 'DOJO', {
            fontFamily: FONT,
            fontStyle: '900',
            fontSize: '64px',
            color: '#f3e5c7',
            stroke: '#1a1520',
            strokeThickness: 5,
        }).setOrigin(0, 0);
        this.add.circle(LAYOUT.lobbyTaglineX - 15, LAYOUT.lobbyTaglineY, 6, 0x8bce35).setDepth(2);
        this.add.text(LAYOUT.lobbyTaglineX, LAYOUT.lobbyTaglineY, 'PORTÕES ABERTOS', {
            fontFamily: FONT,
            fontStyle: '100',
            fontSize: '27px',
            color: '#baff39',
        }).setOrigin(0, 0.5);

        const splash = this.add.image(LAYOUT.lobbySplashX, LAYOUT.lobbySplashY, 'monster-ultra-t-splash')
            .setDepth(0)
            .setName('lobby-splash');
        splash.setDisplaySize(
            LAYOUT.lobbySplashWidth,
            LAYOUT.lobbySplashHeight
        );
        this.add.text(LAYOUT.lobbyCharacterX, LAYOUT.lobbyAltarTitleY, 'ALTAR DO LUTADOR', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '24px',
            color: '#f3e5c7',
            stroke: '#1a101d',
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(4);
        this.add.text(LAYOUT.lobbyCharacterX, LAYOUT.lobbyAltarNameY, ultraT.name.toUpperCase(), {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '36px',
            color: '#baff39',
            stroke: '#1a101d',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(4);

        this.add.text(LAYOUT.lobbyBattleX, LAYOUT.lobbyGateTitleY, 'PORTÃO DA ARENA', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '27px',
            color: '#f3e5c7',
            stroke: '#321918',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(4);
        this.add.text(LAYOUT.lobbyDeckX, LAYOUT.lobbyDeckTitleY, 'MESA DO BARALHO', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '26px',
            color: '#f3e5c7',
            stroke: '#211416',
            strokeThickness: 5,
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
        const badge = this.add.graphics().setDepth(5);
        const left = x - LAYOUT.lobbySelectedWidth / 2;
        const right = x + LAYOUT.lobbySelectedWidth / 2;
        const top = y - LAYOUT.lobbySelectedHeight / 2;
        const bottom = y + LAYOUT.lobbySelectedHeight / 2;
        badge.fillStyle(0x10101b, 0.96).fillRoundedRect(left, top, LAYOUT.lobbySelectedWidth, LAYOUT.lobbySelectedHeight, 18);
        badge.lineStyle(4, 0x7d3fb2, 0.98).strokeRoundedRect(left, top, LAYOUT.lobbySelectedWidth, LAYOUT.lobbySelectedHeight, 18);
        badge.lineStyle(4, 0xd0a35a, 0.9)
            .lineBetween(left + 10, top + 10, left + 50, top + 10)
            .lineBetween(left + 10, top + 10, left + 10, bottom - 10)
            .lineBetween(right - 50, bottom - 10, right - 10, bottom - 10)
            .lineBetween(right - 10, top + 10, right - 10, bottom - 30);
        const icon = this.add.graphics().setDepth(6);
        const iconX = LAYOUT.lobbySelectedIconX;
        const iconY = LAYOUT.lobbySelectedIconY;
        icon.lineStyle(3, 0xc4bdc9, 0.95).strokeRoundedRect(iconX - 25, iconY - 25, 50, 50, 12);
        icon.fillStyle(0xc4bdc9, 0.95).fillCircle(iconX, iconY - 9, 8);
        icon.fillRoundedRect(iconX - 14, iconY + 3, 28, 14, 7);
        this.add.text(LAYOUT.lobbySelectedTextX, LAYOUT.lobbySelectedLabelY, 'PRÓXIMO A DESBLOQUEAR', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '17px',
            color: '#b9b3c0',
        }).setDepth(6);
        this.add.text(LAYOUT.lobbySelectedTextX, LAYOUT.lobbySelectedNameY, 'Quatro Braços', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '30px',
            color: '#ff5039',
        }).setDepth(6);
    }

    private createSettingsHotspot() {
        const button = this.add.container(LAYOUT.lobbySettingsX, LAYOUT.lobbySettingsY).setDepth(30);
        const disc = this.add.circle(0, 0, 36, 0x10101b, 0.98).setStrokeStyle(3, 0xd1b36e);
        const icon = this.add.graphics();
        icon.lineStyle(5, 0xf3e5c7, 1);
        for (let spoke = 0; spoke < 8; spoke += 1) {
            const angle = spoke * Math.PI / 4;
            icon.lineBetween(Math.cos(angle) * 12, Math.sin(angle) * 12, Math.cos(angle) * 21, Math.sin(angle) * 21);
        }
        icon.lineStyle(5, 0xf3e5c7, 1).strokeCircle(0, 0, 11);
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
        const overlay = this.createOverlay('CONFIGURAÇÕES', 720, 580);
        const addText = (x: number, y: number, text: string, fontSize: string, color = '#f3e5c7') => {
            const item = this.add.text(x, y, text, {
                fontFamily: FONT,
                fontStyle: '700',
                fontSize,
                color,
                align: 'center',
            }).setOrigin(0.5).setDepth(1002);
            overlay.add(item);
            return item;
        };

        addText(0, -200, 'MOVIMENTO REDUZIDO', '30px');
        addText(0, -150, 'Diminui animações e efeitos de câmera', '22px', '#c4b694');
        const motionToggle = this.add.rectangle(0, -65, 380, 76, 0x30483e)
            .setStrokeStyle(3, 0xbaff39)
            .setInteractive({ useHandCursor: true })
            .setDepth(1001);
        overlay.add(motionToggle);
        const motionState = addText(0, -65, REDUCED_MOTION ? 'ATIVADO' : 'DESATIVADO', '28px', '#baff39')
            .setInteractive({ useHandCursor: true });
        motionToggle.on('pointerdown', () => {
            setReducedMotion(!REDUCED_MOTION);
            motionState.setText(REDUCED_MOTION ? 'ATIVADO' : 'DESATIVADO');
        });
        motionState.on('pointerdown', () => motionToggle.emit('pointerdown'));

        const fullscreen = this.add.rectangle(0, 65, 440, 76, 0x32443c)
            .setStrokeStyle(3, 0xb89557)
            .setInteractive({ useHandCursor: true })
            .setDepth(1001);
        overlay.add(fullscreen);
        const fullscreenLabel = addText(0, 65, 'ALTERNAR TELA CHEIA', '25px').setInteractive({ useHandCursor: true });
        fullscreen.on('pointerdown', () => {
            if (this.scale.isFullscreen) this.scale.stopFullscreen();
            else this.scale.startFullscreen();
        });
        fullscreenLabel.on('pointerdown', () => fullscreen.emit('pointerdown'));
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