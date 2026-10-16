import Phaser from 'phaser';
import { FONT } from '../config';

export function createMenuButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    onPress: () => void,
    primary = false,
    compact = false,
): Phaser.GameObjects.Container {
    const fill = compact ? 0x15131c : primary ? 0xbaff39 : 0x1a201b;
    const stroke = compact ? 0x8e78aa : primary ? 0xd5ff83 : 0x8e78aa;
    const fillAlpha = compact ? 0.82 : 1;
    const background = scene.add.rectangle(0, 0, width, height, fill, fillAlpha)
        .setStrokeStyle(compact ? 2 : 3, stroke, compact ? 0.8 : 1);
    const text = scene.add.text(0, 0, label, {
        fontFamily: FONT,
        fontStyle: '700',
        fontSize: compact ? '21px' : '40px',
        color: compact ? '#e1dce8' : primary ? '#11170d' : '#f4f1fa',
    }).setOrigin(0.5);
    const button = scene.add.container(x, y, [background, text]);

    background.setInteractive({ useHandCursor: true });
    background.on('pointerover', () => background.setFillStyle(compact ? 0x30273d : primary ? 0xd5ff83 : 0x303a31));
    background.on('pointerout', () => background.setFillStyle(fill, fillAlpha));
    background.on('pointerdown', onPress);

    return button;
}