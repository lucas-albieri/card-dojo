import Phaser from 'phaser';
import { FONT, GAME_HEIGHT as H, GAME_WIDTH as W, REDUCED_MOTION, setReducedMotion } from '../config';
import { LAYOUT } from '../layout';
import { ultraT, ultraTAssets } from '../data/monsters/ultra-t';
import { ELEMENTS } from '../core/types';
import { createDojoLobby } from '../ui/dojo-lobby';
import {
    getMusicVolume,
    getMusicEnabled,
    getSfxVolume,
    playSfx,
    setMusicEnabled,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
} from '../ui/audio';
import { addPhosphorIcon } from '../ui/phosphor-icons';

export class Title extends Phaser.Scene {
    private hoverTweens = new WeakMap<Phaser.GameObjects.Image, Phaser.Tweens.Tween>();

    constructor () {
        super('title');
    }

    preload() {
        this.load.image('dojo-background', '/dojo.png');
        this.load.image('dojo-portal', '/portal.png');
        this.load.image('dojo-altar', '/altar.png');
        this.load.image('dojo-table', '/mesa.png');
        this.load.image('dojo-cards', '/cartas.png');
        this.load.image('next-fighter-frame', '/moldura-prox-lutador.png');
        this.load.image('monster-ultra-t-splash', ultraTAssets.splash);
    }

    create() {
        const lobbyArt = createDojoLobby(this);

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
        addPhosphorIcon(this, 'person-simple', LAYOUT.lobbyCharacterX - 170, LAYOUT.lobbyAltarTitleY, 24, 0xf3e5c7, 5);
        this.add.text(LAYOUT.lobbyCharacterX, LAYOUT.lobbyAltarNameY, ultraT.name.toUpperCase(), {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '36px',
            color: '#baff39',
            stroke: '#1a101d',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(4);
        addPhosphorIcon(this, 'cards-three', LAYOUT.lobbyDeckX - 155, LAYOUT.lobbyDeckTitleY, 27, 0xf3e5c7, 5);

        this.add.text(LAYOUT.lobbyBattleX, LAYOUT.lobbyGateTitleY, 'PORTÃO DA ARENA', {
            fontFamily: FONT,
            fontStyle: '700',
            fontSize: '27px',
            color: '#f3e5c7',
            stroke: '#321918',
            strokeThickness: 5,
        }).setOrigin(0.5).setDepth(4);
        addPhosphorIcon(this, 'boxing-glove', LAYOUT.lobbyBattleX - 132, LAYOUT.lobbyGateTitleY, 28, 0xf3e5c7, 5);
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
            () => this.scene.start('mode-select'),
            [lobbyArt.portal],
        );
        this.createHotspot(
            LAYOUT.lobbyCharacterX,
            LAYOUT.lobbyCharacterY,
            LAYOUT.lobbyCharacterWidth,
            LAYOUT.lobbyCharacterHeight,
            () => this.scene.start('mode-select'),
            [splash, lobbyArt.altarFrame],
        );
        this.createHotspot(
            LAYOUT.lobbyDeckX,
            LAYOUT.lobbyDeckY,
            LAYOUT.lobbyDeckWidth,
            LAYOUT.lobbyDeckHeight,
            () => this.openDeck(),
            [lobbyArt.cards],
        );

        if (!REDUCED_MOTION) {
            this.tweens.add({ targets: splash, y: '-=8', duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
    }

    private createSelectedBadge() {
        const x = LAYOUT.lobbySelectedX;
        const y = LAYOUT.lobbySelectedY;
        this.add.image(x, y, 'next-fighter-frame')
            .setDisplaySize(LAYOUT.lobbySelectedFrameWidth, LAYOUT.lobbySelectedFrameHeight)
            .setDepth(5);
        const iconX = LAYOUT.lobbySelectedIconX;
        const iconY = LAYOUT.lobbySelectedIconY;
        addPhosphorIcon(this, 'lock-key', iconX, iconY, 44, 0xc4bdc9, 7);
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
        const icon = addPhosphorIcon(this, 'gear', 0, 0, 38, 0xf3e5c7, 31);
        button.add([disc, icon]);
        disc.setInteractive({ useHandCursor: true });
        disc.on('pointerover', () => {
            disc.setFillStyle(0x395247);
            this.tweens.killTweensOf(button);
            if (!REDUCED_MOTION) this.tweens.add({ targets: button, scale: 1.1, duration: 140, ease: 'Sine.easeOut' });
        });
        disc.on('pointerout', () => {
            disc.setFillStyle(0x1c2925, 0.96);
            this.tweens.killTweensOf(button);
            if (REDUCED_MOTION) button.setScale(1);
            else this.tweens.add({ targets: button, scale: 1, duration: 140, ease: 'Sine.easeOut' });
        });
        disc.on('pointerdown', () => {
            playSfx(this, 'ui-click');
            this.openSettings();
        });
    }

    private createHotspot(
        x: number,
        y: number,
        width: number,
        height: number,
        onPress: () => void,
        hoverTargets: Phaser.GameObjects.Image[] = [],
    ) {
        const zone = this.add.zone(x, y, width, height).setDepth(11).setInteractive({ useHandCursor: true });
        const originalScales = hoverTargets.map(target => ({ x: target.scaleX, y: target.scaleY }));
        zone.on('pointerover', () => this.animateHoverTargets(hoverTargets, originalScales, true));
        zone.on('pointerout', () => this.animateHoverTargets(hoverTargets, originalScales, false));
        zone.on('pointerdown', () => {
            playSfx(this, 'ui-click');
            onPress();
        });
    }

    private animateHoverTargets(
        targets: Phaser.GameObjects.Image[],
        originalScales: { x: number; y: number }[],
        hovered: boolean,
    ) {
        targets.forEach((target, index) => {
            this.hoverTweens.get(target)?.stop();
            this.hoverTweens.delete(target);
            if (hovered) target.setTint(0xfff2d1);
            else target.clearTint();
            if (REDUCED_MOTION) {
                if (!hovered) target.setScale(originalScales[index].x, originalScales[index].y);
                return;
            }
            const scale = hovered ? 1.05 : 1;
            const tween = this.tweens.add({
                targets: target,
                scaleX: originalScales[index].x * scale,
                scaleY: originalScales[index].y * scale,
                duration: 160,
                ease: 'Sine.easeOut',
            });
            this.hoverTweens.set(target, tween);
        });
    }

    private openSettings() {
        const overlay = this.createOverlay('CONFIGURAÇÕES', 720, 780);
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

        overlay.add(addPhosphorIcon(this, 'person-simple', -196, -235, 30, 0xf3e5c7, 1002));
        addText(0, -235, 'MOVIMENTO REDUZIDO', '30px');
        addText(0, -195, 'Diminui animações e efeitos de câmera', '22px', '#c4b694');
        const motionToggle = this.add.rectangle(0, -145, 380, 64, 0x30483e)
            .setStrokeStyle(3, 0xbaff39)
            .setInteractive({ useHandCursor: true })
            .setDepth(1001);
        overlay.add(motionToggle);
        const motionState = addText(0, -145, REDUCED_MOTION ? 'ATIVADO' : 'DESATIVADO', '28px', '#baff39')
            .setInteractive({ useHandCursor: true });
        const setMotionToggleHover = (hovered: boolean) => {
            motionToggle.setFillStyle(hovered ? 0x425f4b : 0x30483e);
            this.tweens.killTweensOf(motionToggle);
            if (REDUCED_MOTION) {
                if (!hovered) motionToggle.setScale(1);
            } else {
                this.tweens.add({
                    targets: motionToggle,
                    scaleX: hovered ? 1.025 : 1,
                    scaleY: hovered ? 1.06 : 1,
                    duration: 130,
                    ease: 'Sine.easeOut',
                });
            }
        };
        motionToggle.on('pointerover', () => setMotionToggleHover(true));
        motionToggle.on('pointerout', () => setMotionToggleHover(false));
        motionState.on('pointerover', () => setMotionToggleHover(true));
        motionState.on('pointerout', () => setMotionToggleHover(false));
        motionToggle.on('pointerdown', () => {
            playSfx(this, 'ui-click');
            setReducedMotion(!REDUCED_MOTION);
            motionState.setText(REDUCED_MOTION ? 'ATIVADO' : 'DESATIVADO');
        });
        motionState.on('pointerdown', () => motionToggle.emit('pointerdown'));

        const sliderWidth = 360;
        let activeSlider: ((pointer: Phaser.Input.Pointer) => void) | null = null;
        const addVolumeSlider = (
            label: string,
            y: number,
            initial: number,
            setter: (value: number) => void,
        ) => {
            const icon = label === 'EFEITOS SONOROS' ? 'speaker-high' : 'music-notes';
            overlay.add(addPhosphorIcon(this, icon, -270, y - 28, 26, 0xf3e5c7, 1002));
            addText(-100, y - 28, label, '24px');
            const track = this.add.rectangle(0, y, sliderWidth + 40, 38, 0x000000, 0)
                .setInteractive({ useHandCursor: true })
                .setDepth(1001);
            const fill = this.add.graphics().setDepth(1002);
            fill.fillStyle(0x526057).fillRoundedRect(-sliderWidth / 2, y - 6, sliderWidth, 12, 6);
            const thumb = this.add.circle(-sliderWidth / 2 + sliderWidth * initial, y, 13, 0xf3e5c7)
                .setStrokeStyle(3, 0xbaff39)
                .setDepth(1003);
            const valueLabel = addText(230, y, `${Math.round(initial * 100)}%`, '21px', '#baff39');
            overlay.add([track, fill, thumb, valueLabel]);
            const setPercent = (percent: number) => {
                const clampedPercent = Math.max(0, Math.min(100, Math.round(percent)));
                setter(clampedPercent / 100);
                fill.clear();
                fill.fillStyle(0x526057).fillRoundedRect(-sliderWidth / 2, y - 6, sliderWidth, 12, 6);
                fill.fillStyle(0xbaff39).fillRoundedRect(-sliderWidth / 2, y - 6, sliderWidth * clampedPercent / 100, 12, 6);
                thumb.setPosition(-sliderWidth / 2 + sliderWidth * clampedPercent / 100, y);
                valueLabel.setText(`${clampedPercent}%`);
            };
            const setFromPointer = (pointer: Phaser.Input.Pointer) => {
                setPercent((pointer.x - (W / 2 - sliderWidth / 2)) / sliderWidth * 100);
            };
            setPercent(initial * 100);
            track.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                playSfx(this, 'ui-click');
                activeSlider = setFromPointer;
                setFromPointer(pointer);
            });
        };

        addVolumeSlider('EFEITOS SONOROS', -65, getSfxVolume(), setSfxVolume);
        addVolumeSlider('MÚSICA', 45, getMusicVolume(), setMusicVolume);
        const handleSliderMove = (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) activeSlider?.(pointer);
        };
        const stopSlider = () => {
            activeSlider = null;
        };
        this.input.on('pointermove', handleSliderMove);
        this.input.on('pointerup', stopSlider);
        overlay.once('destroy', () => {
            this.input.off('pointermove', handleSliderMove);
            this.input.off('pointerup', stopSlider);
        });

        const musicToggle = this.add.rectangle(0, 115, 380, 58, 0x30483e)
            .setStrokeStyle(3, 0xbaff39)
            .setInteractive({ useHandCursor: true })
            .setDepth(1001);
        overlay.add(musicToggle);
        overlay.add(addPhosphorIcon(this, 'music-notes', -115, 115, 25, 0xbaff39, 1002));
        const musicState = addText(
            15,
            115,
            getMusicEnabled() ? 'MÚSICA ATIVADA' : 'MÚSICA DESATIVADA',
            '23px',
            '#baff39',
        ).setInteractive({ useHandCursor: true });
        const toggleMusic = () => {
            const enabled = !getMusicEnabled();
            setMusicEnabled(enabled);
            musicState.setText(enabled ? 'MÚSICA ATIVADA' : 'MÚSICA DESATIVADA');
            playSfx(this, 'ui-click');
        };
        musicToggle.on('pointerdown', toggleMusic);
        musicState.on('pointerdown', toggleMusic);

        const fullscreen = this.add.rectangle(0, 190, 440, 64, 0x32443c)
            .setStrokeStyle(3, 0xb89557)
            .setInteractive({ useHandCursor: true })
            .setDepth(1001);
        overlay.add(fullscreen);
        overlay.add(addPhosphorIcon(this, 'arrows-out', -135, 190, 26, 0xf3e5c7, 1002));
        const fullscreenLabel = addText(25, 190, 'ALTERNAR TELA CHEIA', '25px').setInteractive({ useHandCursor: true });
        const setFullscreenHover = (hovered: boolean) => {
            fullscreen.setFillStyle(hovered ? 0x496257 : 0x32443c);
            this.tweens.killTweensOf(fullscreen);
            if (REDUCED_MOTION) {
                if (!hovered) fullscreen.setScale(1);
            } else {
                this.tweens.add({
                    targets: fullscreen,
                    scaleX: hovered ? 1.025 : 1,
                    scaleY: hovered ? 1.06 : 1,
                    duration: 130,
                    ease: 'Sine.easeOut',
                });
            }
        };
        fullscreen.on('pointerover', () => setFullscreenHover(true));
        fullscreen.on('pointerout', () => setFullscreenHover(false));
        fullscreenLabel.on('pointerover', () => setFullscreenHover(true));
        fullscreenLabel.on('pointerout', () => setFullscreenHover(false));
        fullscreen.on('pointerdown', () => {
            playSfx(this, 'ui-click');
            if (this.scale.isFullscreen) this.scale.stopFullscreen();
            else this.scale.startFullscreen();
        });
        fullscreenLabel.on('pointerdown', () => fullscreen.emit('pointerdown'));

        const soundToggle = this.add.rectangle(0, 270, 380, 64, 0x30483e)
            .setStrokeStyle(3, 0xbaff39)
            .setInteractive({ useHandCursor: true })
            .setDepth(1001);
        overlay.add(soundToggle);
        const soundIcon = addPhosphorIcon(
            this,
            this.sound.mute ? 'speaker-slash' : 'speaker-high',
            -120,
            270,
            26,
            0xbaff39,
            1002,
        );
        const soundState = addText(15, 270, this.sound.mute ? 'ÁUDIO DESATIVADO' : 'ÁUDIO ATIVADO', '24px', '#baff39')
            .setInteractive({ useHandCursor: true });
        overlay.add(soundIcon);
        const toggleSound = () => {
            const muted = toggleMute(this);
            soundState.setText(muted ? 'ÁUDIO DESATIVADO' : 'ÁUDIO ATIVADO');
            soundIcon.setTexture(`phosphor-${muted ? 'speaker-slash' : 'speaker-high'}`);
            if (!muted) playSfx(this, 'ui-click');
        };
        soundToggle.on('pointerdown', toggleSound);
        soundState.on('pointerdown', toggleSound);
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
        overlay.add([summary, addPhosphorIcon(this, 'cards-three', -286, 286, 28, 0xc4b694, 1002)]);
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
        const close = addPhosphorIcon(this, 'x', width / 2 - 34, -height / 2 + 28, 30, 0xf3e5c7, 1003)
            .setInteractive({ useHandCursor: true });
        close.on('pointerover', () => {
            this.tweens.killTweensOf(close);
            if (!REDUCED_MOTION) this.tweens.add({ targets: close, scale: 1.15, duration: 120, ease: 'Sine.easeOut' });
        });
        close.on('pointerout', () => {
            this.tweens.killTweensOf(close);
            if (REDUCED_MOTION) close.setScale(1);
            else this.tweens.add({ targets: close, scale: 1, duration: 120, ease: 'Sine.easeOut' });
        });
        overlay.add([heading, close]);

        const closeOverlay = () => {
            playSfx(this, 'ui-click');
            overlay.destroy();
        };
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